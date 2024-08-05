import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';
import { DCButton } from 'components/shared/button';
import { useDCStore } from 'store';
import { useDeleteAccount } from 'data/hooks/user';

interface DeleteModalProps {
  visible: boolean;
  onChange: (visible: boolean) => void;
}

export const DeleteModal = ({ visible, onChange }: DeleteModalProps) => {
  const user = useDCStore.use.user();

  const logOutAction = useDCStore.use.clearDCStoreAction();

  const userId = user?.id;

  const { mutate: deleteAccount } = useDeleteAccount();

  const handleDeleteAccount = () => {
    deleteAccount(userId, {
      onSuccess: () => {
        console.log('Account deleted successfully');
        logOutAction();
      },
      onError: error => {
        console.error('Error deleting account:', error);
      },
    });
  };

  return (
    <View style={visible ? styles.modal : styles.modalVisible}>
      <View style={styles.modalBox}>
        <Text style={styles.modalBoxTitle}>
          Do you really want to delete account?
        </Text>
        <View style={styles.modalBoxButtons}>
          <DCButton
            children="Cencel"
            containerStyle={{
              width: '50%',
              height: 58,
              flex: 1,
            }}
            onPress={() => onChange(false)}
          />
          <DCButton
            children="Yes, delete"
            containerStyle={{
              width: '50%',
              height: 58,
              flex: 1,
              backgroundColor: theming.colors.redError,
            }}
            onPress={handleDeleteAccount}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theming.spacing.LG,
  },
  modalVisible: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theming.spacing.LG,
    display: 'none',
  },
  modalBox: {
    width: '100%',
    backgroundColor: theming.colors.white,
    padding: theming.spacing.LG,
    borderRadius: 10,
  },
  modalBoxTitle: {
    color: theming.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalBoxButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 15,
  },
});
