import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { theming } from 'common/constants/theming';
import { LocationIcon } from 'components/icons/location';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { DCInput } from 'components/shared/input';
import { PlusBigIcon } from 'components/icons/plusBig';
import { SearchIcon } from 'components/icons/search';
import { CommunitiesCardList } from 'components/commuties_cardlist';
import { useDCStore } from 'store';
import { SafeAreaView } from 'react-native-safe-area-context';

export function CommunitiesScreen() {
  const user = useDCStore.use.user();
  const [all, setAll] = useState<Amity.Post[]>([]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.communities}>
        <View style={styles.communitiesLocation}>
          <LocationIcon width={16} height={16} />
          <Text style={styles.communitiesLocationTitle}>
            San Francisco, California
          </Text>
          <RightArrowIcon style={{ transform: [{ rotate: '90deg' }] }} />
        </View>

        <View style={styles.communitiesSearch}>
          <DCInput
            leftIcon={<SearchIcon />}
            placeholder="Community name, dance style"
            containerStyle={styles.communitiesInputContainer}
            inputStyle={styles.communitiesInput}
          />
          <View style={styles.communitiesPlus}>
            <PlusBigIcon />
          </View>
        </View>

        <CommunitiesCardList all={all} communities={[]} events={[]} user={user} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  communities: {
    flex: 1,
    paddingHorizontal: theming.spacing.LG,
  },
  communitiesLocation: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theming.spacing.SM,
    marginTop: 10,
  },
  communitiesLocationTitle: {
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },
  communitiesPlus: {
    width: 48,
    height: 48,
    backgroundColor: theming.colors.purple,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communitiesSearch: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  communitiesInput: {
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
});
