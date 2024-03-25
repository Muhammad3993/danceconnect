import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import * as RN from 'react-native';
import colors from '../utils/colors';

type props = {
  title: string;
  onPressFilters: () => void;
  filtersBorderColor?: string;
  containerStyle?: RN.ViewStyle;
};
const Filters = ({
  title,
  onPressFilters,
  filtersBorderColor,
  containerStyle,
}: props) => {
  const {t} = useTranslation();
  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  }, []);
  return (
    <RN.View style={[styles.filterWrapper, containerStyle]}>
      <RN.View style={styles.justCenter}>
        <RN.Text style={styles.count}>{title}</RN.Text>
      </RN.View>
      <RN.TouchableOpacity
        style={[
          styles.filterBtn,
          {
            borderColor: filtersBorderColor ?? colors.gray,
          },
        ]}
        onPress={onPressFilters}>
        <RN.View style={styles.justCenter}>
          <RN.Image source={{uri: 'filter'}} style={styles.iconFilter} />
        </RN.View>
        <RN.Text style={styles.filterText}>{t('filters')}</RN.Text>
        <RN.View style={styles.justCenter}>
          <RN.Image source={{uri: 'downlight'}} style={styles.downIcon} />
        </RN.View>
      </RN.TouchableOpacity>
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  downIcon: {
    height: 16,
    width: 16,
    marginLeft: 4,
    marginTop: 4,
  },
  iconFilter: {
    height: 12,
    width: 14,
    marginRight: 8,
  },
  justCenter: {
    justifyContent: 'center',
  },
  filterWrapper: {
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  count: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '600',
  },
  filterBtn: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    padding: 6,
    borderRadius: 100,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterText: {
    fontSize: 16,
    lineHeight: 22.4,
    color: colors.darkGray,
    fontWeight: '500',
  },
});
export default Filters;
