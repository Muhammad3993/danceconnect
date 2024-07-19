import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';
import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';
import { useMutation } from 'react-query';
import { localStorage } from 'common/libs/local_storage';
import { userApi } from 'data/api/user';
import { useDCStore } from 'store';
import { showErrorToast } from 'common/libs/toast';
import { images } from 'common/resources/images';

export function useSocialBtns() {
  const { t } = useTranslation();
  const getUser = useDCStore.use.initAppAction();
  const { mutate: handleGoogleLogin, isLoading: isGoogleLoading } =
    useGoogleLoginUser();

  const { mutate: handleAppleLogin, isLoading: isAplleLoading } =
    useAppleLoginUser();

  const socialButtons = useMemo(
    () => [
      {
        title: t('auth_btn_goolge'),
        icon: images.googleLogo,
        isAvailable: true,
        isLoading: isGoogleLoading,
        onPress: () => {
          handleGoogleLogin(undefined, {
            async onSuccess(data) {
              await localStorage.setItem('token', data.access_token);
              getUser();
            },
            onError(err) {
              const error = err as Error;
              showErrorToast(error.message);
            },
          });
        },
      },
      {
        title: t('auth_btn_apple'),
        icon: images.appleLogo,
        isLoading: isAplleLoading,
        onPress: () => {
          handleAppleLogin(undefined, {
            onSuccess(data) {
              localStorage.setItem('token', data.access_token);
              getUser();
            },
            onError(err) {
              const error = err as Error;
              showErrorToast(error.message);
            },
          });
        },
        isAvailable: Platform.OS === 'ios',
      },
    ],
    [
      getUser,
      handleGoogleLogin,
      isGoogleLoading,
      handleAppleLogin,
      isAplleLoading,
      t,
    ],
  );

  return { socialButtons };
}

const useGoogleLoginUser = () => {
  const handleGoogleSignIn = useCallback(async () => {
    GoogleSignin.configure({ webClientId: Config.GOOGLE_WEB_CLIENT_ID });

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    await auth().signInWithCredential(googleCredential);

    const { currentUser } = auth();

    const token = await currentUser?.getIdToken();

    if (!token) {
      throw Error('Something get wrong!');
    }

    return userApi.googleLoginUser(token);
  }, []);

  return useMutation({ mutationFn: handleGoogleSignIn });
};

const useAppleLoginUser = () => {
  const handleAppleSignIn = useCallback(async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    auth().signInWithCredential(appleCredential);

    const { currentUser } = auth();

    const token = await currentUser?.getIdToken();

    if (!token) {
      throw Error('Something get wrong!');
    }

    return userApi.googleLoginUser(token);
  }, []);

  return useMutation({ mutationFn: handleAppleSignIn });
};

export const useLoginUser = () => {
  return useMutation({ mutationFn: userApi.loginUser });
};

export const useRegisterUser = () => {
  return useMutation({ mutationFn: userApi.registerUser });
};

export const useEditUser = () => {
  return useMutation({ mutationFn: userApi.editUser });
};
