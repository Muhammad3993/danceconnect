import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { LocationIcon } from 'components/icons/location';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { theming } from 'common/constants/theming';

export function HeaderWithLocation() {
  return (
    <View style={styles.communitiesLocation}>
      <LocationIcon width={16} height={16} />
      <Text style={styles.communitiesLocationTitle}>
        San Francisco, California
      </Text>
      <RightArrowIcon style={{ transform: [{ rotate: '90deg' }] }} />
    </View>
  );
}

const styles = StyleSheet.create({
  communitiesLocation: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theming.spacing.SM,
    marginTop: 10,
    borderWidth: 1,
    borderColor: theming.colors.gray300,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  communitiesLocationTitle: {
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },
});
