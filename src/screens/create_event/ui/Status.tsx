import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';
import { t } from 'i18next';

interface StatusProps {
  containerStyle?: ViewStyle;
  statusStyle1?: ViewStyle;
  statusStyle2?: ViewStyle;
  statusStyle3?: ViewStyle;
  statusColorStyle1?: ViewStyle;
  statusColorStyle2?: ViewStyle;
  statusColorStyle3?: ViewStyle;
  titleStyle1?: TextStyle
  titleStyle2?: TextStyle
  titleStyle3?: TextStyle
}

export const Status = ({
  containerStyle,
  statusStyle1,
  statusStyle2,
  statusStyle3,
  statusColorStyle1,
  statusColorStyle2,
  statusColorStyle3,
  titleStyle1,
  titleStyle2,
  titleStyle3
}: StatusProps) => {
  return (
    <View style={[styles.statusess, containerStyle]}>
      <View style={[styles.status, statusStyle1]}>
        <View style={[styles.statusColor, statusColorStyle1]}></View>
        <Text style={[styles.statusTitle, titleStyle1]}>{t("basic_info")}</Text>
      </View>
      <View style={[styles.status, statusStyle2]}>
        <View style={[styles.statusColor, statusColorStyle2]}></View>
        <Text style={[styles.statusTitle, titleStyle2]}>{t("detail")}</Text>
      </View>
      <View style={[styles.status, statusStyle3]}>
        <View style={[styles.statusColor, statusColorStyle3]}></View>
        <Text style={[styles.statusTitle, titleStyle3]}>{t("set_tickets")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusess: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theming.spacing.LG,
    marginTop: 20,
    paddingBottom: 14,
  },
  status: {
    width: '31.5%',
    opacity: .5,
  },
  statusColor: {
    width: '100%',
    height: 4,
    borderRadius: 100,
    backgroundColor: theming.colors.gray250,
  },
  statusTitle: {
    fontWeight: '400',
    color: theming.colors.gray500,
    fontSize: 12,
    marginTop: 5,
  },
});
