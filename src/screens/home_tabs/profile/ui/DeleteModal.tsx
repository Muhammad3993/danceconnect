import { DCButton } from 'components/shared/button';
import { useDeleteAccount } from 'data/hooks/user';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface DeleteModalProps {
  onChange: (visible: boolean) => void;
}

export const DeleteModal = ({ onChange }: DeleteModalProps) => {
  const { styles, theme } = useStyles(styleSheet);

  const { mutate: deleteAccount } = useDeleteAccount();
  const { t } = useTranslation();

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
            backgroundColor: theme.colors.error,
          }}
          onPress={deleteAccount}
        />
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(theme => ({
  modalBox: {
    width: '100%',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.LG,
    borderRadius: 10,
  },
  modalBoxTitle: {
    color: theme.colors.textPrimary,
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
}));
