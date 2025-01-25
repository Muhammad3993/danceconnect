import { useMutation } from '@tanstack/react-query';
import { sharedStorage } from 'common/libs/shared_storage';
import { showErrorToast, showSuccessToast } from 'common/libs/toast';
import { images } from 'common/resources/images';
import { collectionsApi } from 'data/api/common';
import { userApi } from 'data/api/user';
import { AuthUserRequest, User } from 'data/api/user/inerfaces';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useDCStore } from 'store';

// const boostrap = async ({ token, user }: AuthResponse) => {
//   await sharedStorage.setItem("token", token);
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

//       await sharedStorage.setItem("pushToken", pushToken);
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
    mutationFn: async () => {
      const user = await userApi.googleLoginUser();
      const constants = await collectionsApi.getConstants();

      return { user, constants };
    },
    async onSuccess({ user, constants }) {
      await sharedStorage.setItem('token', user.token);
      setUser(user.user, constants);
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
    mutationFn: async () => {
      const user = await userApi.appleLoginUser();
      const constants = await collectionsApi.getConstants();

      return { user, constants };
    },

    async onSuccess({ user, constants }) {
      await sharedStorage.setItem('token', user.token);
      setUser(user.user, constants);
    },
    onError(err) {
      const error = err as Error;
      showErrorToast(error.message);
    },
  });
};

export const useLoginUser = () => {
  const setUser = useDCStore.use.setUser();

  return useMutation({
    mutationFn: async (data: AuthUserRequest) => {
      const user = await userApi.loginUser(data);
      const constants = await collectionsApi.getConstants();

      return { user, constants };
    },

    async onSuccess({ constants, user }) {
      await sharedStorage.setItem('token', user.token);
      setUser(user.user, constants);
    },
    onError(err) {
      const error = err as Error;
      showErrorToast(error.message);
    },
  });
};

export const useRegisterUser = () => {
  const setUser = useDCStore.use.setUser();

  return useMutation({
    mutationFn: async (data: AuthUserRequest) => {
      const user = await userApi.registerUser(data);
      const constants = await collectionsApi.getConstants();

      return { user, constants };
    },

    async onSuccess({ user, constants }) {
      await sharedStorage.setItem('token', user.token);
      setUser(user.user, constants);
    },
    onError(err) {
      const error = err as Error;
      showErrorToast(error.message);
    },
  });
};

export const useEditUser = () => {
  const updateUser = useDCStore.use.setUser();

  return useMutation({
    mutationFn: userApi.editUser,
    onSuccess(newUser) {
      updateUser(newUser);
    },
    onError(err) {
      const error = err as Error;
      showErrorToast(error.message);
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

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: userApi.forgetPasword,
    onSuccess() {
      showSuccessToast(
        'We send confirmation reset password link to your email',
      );
    },
    onError(error) {
      showErrorToast(error.message);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: userApi.resetPasword,
    onSuccess() {
      showSuccessToast('You successfully changed your password');
    },
    onError(error) {
      showErrorToast(error.message);
    },
  });
};
