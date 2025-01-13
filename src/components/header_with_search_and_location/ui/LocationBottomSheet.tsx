import React from 'react';
import { useTranslation } from 'react-i18next';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { ListItem } from 'components/list_item';
import { DCButton } from 'components/shared/button';
import { DCLine } from 'components/shared/line';
import { Text, View } from 'react-native';
import { CountryBottomSheet } from './CountryBottomSheet';
import { RegionBottomSheet } from './RegionBottomSheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IProps {
  content: any;
  setContent: any;
}

export function LocationBottomSheet({ content, setContent }: IProps) {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(styleSheet);

  if (content === 'region') {
    return (
      <View>
        <RegionBottomSheet setContent={setContent} />
      </View>
    );
  }

  if (content === 'country') {
    return (
      <View>
        <CountryBottomSheet setContent={setContent} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{t('location')}</Text>
      <View style={styles.listWrapper}>
        <ListItem
          click={() => setContent('region')}
          title="Search by Region"
          rightIcon={
            <RightArrowIcon
              stroke={theme.colors.textPrimary}
              width={20}
              height={20}
            />
          }
        />
        <DCLine />
        <ListItem
          click={() => setContent('country')}
          title="Search by Country"
          rightIcon={
            <RightArrowIcon
              stroke={theme.colors.textPrimary}
              width={20}
              height={20}
            />
          }
        />
      </View>
      <DCLine />
      <DCButton>Confirm</DCButton>
    </View>
  );
}

const styleSheet = createStyleSheet(theming => ({
  root: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  //List wrapper
  listWrapper: {
    marginVertical: 25,
    paddingVertical: 14,
    gap: 15,
  },
  listItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  listItemText: {
    lineHeight: 25.2,
    paddingLeft: 20,
    color: theming.colors.textPrimary,
    fontWeight: '500',
  },
  listItemLocation: {
    fontSize: 14,
    color: theming.colors.gray700,
    fontWeight: '400',
    fontFamily: theming.fonts.latoRegular,
  },
}));
