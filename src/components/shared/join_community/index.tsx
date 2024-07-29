import { StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import { DCRoundIcon } from '../round_icon';
import { CommunitiesIcon } from 'components/icons/communities';
import { theming } from 'common/constants/theming';
import { DCButton } from '../button';

interface JoinProps {
  title?: ReactNode;
}

export const JoinCommunity = ({ title }: JoinProps) => {
  return (
    <View style={styles.homeEventsFree}>
      <DCRoundIcon
        icon={<CommunitiesIcon active fill={theming.colors.white} />}
        iconBoxStyle={{
          width: 44,
          height: 44,
          backgroundColor: theming.colors.purple,
        }}
      />
      <Text style={styles.homeEventsFreeTitle}>{title}</Text>
      <Text style={styles.homeEventsFreeSubtitle}>
        to see and attend upcoming events that you interested in
      </Text>
      <View style={{ marginTop: 15 }}>
        <DCButton
          children="Search for a community"
          variant="primary"
          containerStyle={{
            paddingHorizontal: theming.spacing.MD,
            paddingVertical: 13,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeEventsFree: {
    width: '100%',
    height: 236,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: theming.spacing.SM,
    marginTop: 20,
    backgroundColor: theming.colors.white,
  },
  homeEventsFreeTitle: {
    color: theming.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    marginTop: 7,
  },
  homeEventsFreeSubtitle: {
    width: '90%',
    color: theming.colors.gray700,
    fontWeight: '400',
    fontSize: 14,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 3,
    textAlign: 'center',
  },
});
