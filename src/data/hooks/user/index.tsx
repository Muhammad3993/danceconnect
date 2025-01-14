import { appleAuth } from '@invertase/react-native-apple-authentication';
import { useMutation } from '@tanstack/react-query';
import { localStorage } from 'common/libs/local_storage';
import { showErrorToast } from 'common/libs/toast';
import { images } from 'common/resources/images';
import { userApi } from 'data/api/user';
import { User } from 'data/api/user/inerfaces';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useDCStore } from 'store';

// const boostrap = async ({ token, user }: AuthResponse) => {
//   await localStorage.setItem("token", token);
//   const getStreamToken = await userApi.getGetStreamToken();

//   await client.connectUser(
//     {
//       id: user.id,
//       name: extractUserFullName(user),
//       image: user.photo?.path,
//       // @ts-ignore
//       language: user.lang ?? i18n.language,
//     },
//     getStreamToken.token,
//   );

//   await i18n.changeLanguage(user.lang);

//   const pushToken = await NotificationsService.getDeviceToken();

//   if (pushToken) {
//     try {
//       await userApi.registerDeviceToken(pushToken);
//       await client.addDevice(pushToken, "firebase");

//       await localStorage.setItem("pushToken", pushToken);
//       console.log("registerDeviceToken");
//     } catch (err) {
//       console.log("cannot Register device token");
//       console.log(err);
//     }
//   }

//   // libraryApi.
// };

export function useSocialBtns() {
  const { t } = useTranslation();
  const getUser = useDCStore.use.initAppAction();
  const { mutate: handleGoogleLogin, isPending: isGoogleLoading } =
    useGoogleLoginUser();

  const { mutate: handleAppleLogin, isPending: isAplleLoading } =
    useAppleLoginUser();

  const socialButtons = useMemo(
    () => [
      {
        title: t('auth_btn_goolge'),
        icon: images.googleLogo,
        isAvailable: true,
        isLoading: isGoogleLoading,
        onPress: handleGoogleLogin,
      },
      {
        title: t('auth_btn_apple'),
        icon: images.appleLogo,
        isLoading: isAplleLoading,
        onPress: handleAppleLogin,
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

export const useGoogleLoginUser = () => {
  const setUser = useDCStore.use.setUser();

  return useMutation({
    mutationFn: userApi.googleLoginUser,
    async onSuccess(data) {
      await localStorage.setItem('token', data.token);
      setUser(data.user);
    },
    onError(err) {
      const error = err as Error;
      showErrorToast(error.message);
    },
  });
};

const useAppleLoginUser = () => {
  const setUser = useDCStore.use.setUser();

  return useMutation({
    mutationFn: userApi.appleLoginUser,
    async onSuccess(data) {
      await localStorage.setItem('token', data.token);
      setUser(data.user);
    },
    onError(err) {
      const error = err as Error;
      showErrorToast(error.message);
    },
  });
};

export const useLoginUser = () => {
  return useMutation({ mutationFn: userApi.loginUser });
};

export const useRegisterUser = () => {
  const setUser = useDCStore.use.setUser();

  return useMutation({
    mutationFn: userApi.registerUser,
    async onSuccess(data) {
      await localStorage.setItem('token', data.token);
      setUser(data.user);
    },
    onError(err) {
      const error = err as Error;
      showErrorToast(error.message);
    },
  });
};

export const useEditUser = () => {
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const newUser = await userApi.editUser(data);

      return newUser;
    },
  });
};

export const useDeleteAccount = () => {
  const logOutAction = useDCStore.use.clearDCStoreAction();
  return useMutation({
    mutationFn: userApi.deleteUserAcc,
    onSuccess: () => logOutAction({ endSession: true }),
    onError(err) {
      const error = err as Error;
      showErrorToast(error.message);
    },
  });
};
