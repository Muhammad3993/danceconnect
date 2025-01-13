import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { DCInput } from 'components/shared/input';
import { SearchIcon } from 'components/icons/search';
import { PlusBigIcon } from 'components/icons/plusBig';
import { useTranslation } from 'react-i18next';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IProps {
  onPress: () => void;
  placeholder: string;
}

export function HeaderWithSearch({ onPress, placeholder }: IProps) {
  // const { t } = useTranslation();
  const { styles } = useStyles(styleSheet);

  return (
    <View style={styles.communitiesSearch}>
      <DCInput
        leftIcon={<SearchIcon />}
        placeholder={placeholder}
        containerStyle={styles.communitiesInputContainer}
        inputStyle={styles.communitiesInput}
      />
      <TouchableOpacity onPress={onPress} style={styles.communitiesPlus}>
        <PlusBigIcon />
      </TouchableOpacity>
    </View>
  );
}

const styleSheet = createStyleSheet(theming => ({
  communitiesPlus: {
    width: 40,
    height: 40,
    backgroundColor: theming.colors.secondary500,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communitiesSearch: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  communitiesInputContainer: {
    width: '82%',
  },
  communitiesInput: {
    padding: 0,
    borderWidth: 0,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    height: 48,
  },
}));
