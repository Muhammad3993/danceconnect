import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';
import { DCButton } from 'components/shared/button';
import { useDCStore } from 'store';
import { useDeleteAccount } from 'data/hooks/user';
import { useTranslation } from 'react-i18next';
import { showErrorToast } from 'common/libs/toast';

interface DeleteModalProps {
  onChange: (visible: boolean) => void;
}

export const DeleteModal = ({ onChange }: DeleteModalProps) => {
  const user = useDCStore.use.user();

  const logOutAction = useDCStore.use.clearDCStoreAction();

  const userId = user?.id;

  const { mutate: deleteAccount } = useDeleteAccount();
  const { t } = useTranslation();

  const handleDeleteAccount = () => {
    deleteAccount(userId, {
      onSuccess: logOutAction,
      onError(err) {
        const error = err as Error;
        showErrorToast(error.message);
      },
    });
  };

  return (
    <View style={styles.modalBox}>
      <Text style={styles.modalBoxTitle}>{t('del_acc_question')}</Text>
      <View style={styles.modalBoxButtons}>
        <DCButton
          children={t('cancel')}
          containerStyle={{ width: '50%', height: 58, flex: 1 }}
          onPress={() => onChange(false)}
        />
        <DCButton
          children={t('y_delete')}
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
  );
};

const styles = StyleSheet.create({
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
