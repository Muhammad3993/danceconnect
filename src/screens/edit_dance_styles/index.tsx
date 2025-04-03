import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import DanceStylesSelector from '@components/dance_styles_selector';
import { useDCStore } from '@store';
import { useTranslation } from 'react-i18next';
import { DCButton } from '@components/shared/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEditUser } from '@data/hooks/user';
import { StackScreenProps } from '@screens/interfaces';
import { showErrorToast } from '@common/libs/toast';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function EditDanceStylesSreen({
  navigation,
}: StackScreenProps<'editDanceStyles'>) {
  const { styles, theme } = useStyles(styleSheet);

  const user = useDCStore.use.user();
  const setUser = useDCStore.use.setUser();
  const [dStyles, setDstyles] = useState(user?.individualStyles ?? []);
  const { t } = useTranslation();
  const { mutate, isPending } = useEditUser();

  const save = () => {
    mutate(
      { ...user, individualStyles: dStyles },
      {
        onSuccess(data) {
          setUser(data);
          navigation.pop();
        },
        onError(err) {
          const error = err as Error;
          showErrorToast(error.message);
        },
      },
    );
  };
  return (
    <SafeAreaView edges={['bottom']} style={styles.root}>
      <Text style={styles.title}>{t('select_dc')}</Text>
      <DanceStylesSelector value={dStyles} onChange={setDstyles} />
      <View style={{ paddingHorizontal: theme.spacing.LG }}>
        <DCButton
          isLoading={isPending}
          disabled={dStyles.length === 0}
          onPress={save}>
          {t('save_changes')}
        </DCButton>
      </View>
    </SafeAreaView>
  );
}

const styleSheet = createStyleSheet(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.MD,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    fontWeight: '600',
    fontFamily: theme.fonts.latoRegular,
    paddingHorizontal: theme.spacing.LG,
    marginBottom: 28,
  },
}));
