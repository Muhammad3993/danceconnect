import { toast } from '@backpackapp-io/react-native-toast';

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};
