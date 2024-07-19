import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { theming } from 'common/constants/theming';
import { images } from 'common/resources/images';
import { LocationIcon } from 'components/icons/location';
import { DCRoundIcon } from 'components/shared/round_icon';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { SetCalendarIcon } from 'components/icons/setCalendar';
import { HomeItem } from 'components/shared/homeItem';

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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.homeBoxes}>
          <HomeItem />
          <HomeItem />
      </ScrollView>
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
  homeBoxes: {
    marginTop: 20,
  },




});