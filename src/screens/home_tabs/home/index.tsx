import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { theming } from 'common/constants/theming';
import { DCRoundIcon } from 'components/shared/round_icon';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { HomeItem } from 'components/shared/home_item';
import { StartCommunity } from 'components/shared/start_community';
import { CommunitiesIcon } from 'components/icons/communities';
import { DCButton } from 'components/shared/button';

export function HomeScreen() {
  return (
    <ScrollView style={styles.root}>

      <View style={styles.homeTop}>
        <Text style={styles.homeTitle}>You might be interested</Text>
        <DCRoundIcon
          icon={<RightArrowIcon />} 
          iconBoxStyle={{
            width: 28,
            height: 28,
            backgroundColor: theming.colors.lightPurple,
          }} 
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HomeItem />
          <HomeItem />
      </ScrollView>

      <StartCommunity />

      <View style={styles.homeEvents}>
        <Text style={styles.homeEventsTitle}>Your upcoming events</Text>
        <View style={styles.homeEventsFree}>
          <DCRoundIcon 
            icon={<CommunitiesIcon active fill={theming.colors.white} />}
            iconBoxStyle={{
              width: 44,
              height: 44,
              backgroundColor: theming.colors.purple,
            }}
          />
          <Text style={styles.homeEventsFreeTitle}>Join a community </Text>
          <Text style={styles.homeEventsFreeSubtitle}>to see and attend upcoming events that you interested in</Text>
          <View style={{marginTop: 15}}>
            <DCButton children="Search for a community" variant='primary' containerStyle={{paddingHorizontal: theming.spacing.MD, paddingVertical: 13}}   />
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
    padding: theming.spacing.LG,
  },
  homeTop: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  homeTitle: {
    fontSize: theming.spacing.LG,
    fontWeight: "700",
    color: theming.colors.textPrimary,
  },
  homeEvents: {
    marginVertical: 30,
  },
  homeEventsTitle: {
    color: theming.colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    fontFamily: theming.fonts.latoRegular,
  },
  homeEventsFree: {
    width: "100%",
    height: 236,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: theming.spacing.SM,
    marginTop: 20,
  },
  homeEventsFreeTitle: {
    color: theming.colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: theming.fonts.latoRegular,
    marginTop: 7,
  },
  homeEventsFreeSubtitle: {
    width: "90%",
    color: theming.colors.gray700,
    fontWeight: "400",
    fontSize: 14,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 3,
    textAlign: "center",
  }
});