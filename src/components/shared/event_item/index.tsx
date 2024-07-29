import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SetCalendarIcon } from 'components/icons/setCalendar';
import { theming } from 'common/constants/theming';
import { images } from 'common/resources/images';
import { LocationIcon } from 'components/icons/location';
import { DCLine } from '../line';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface EventItemProps {
  click?: () => void;
}

export const EventItem = ({ click }: EventItemProps) => {
  return (
    <TouchableOpacity onPress={click}>
      <View style={styles.item}>
        <View style={styles.itemBody}>
          <View style={styles.itemBodyText}>
            <View style={styles.itemCategories}>
              <View style={styles.itemCategory}>
                <Text style={styles.itemCategoryTitle}>Festival</Text>
              </View>
              <View
                style={[
                  styles.itemCategory,
                  { backgroundColor: theming.colors.green },
                ]}>
                <Text style={styles.itemCategoryTitle}>$25.00</Text>
              </View>
            </View>
            <View style={styles.itemDate}>
              <SetCalendarIcon />
              <Text style={styles.itemDateTitle}>Mon, Dec 24 • 21:00</Text>
            </View>
            <Text style={styles.itemTitle}>"Sensual" Bachata </Text>
            <Text style={styles.itemSubtitle} numberOfLines={3}>
              Experience the Magic of Bachata at the Los Angeles Bachata
              Festival!...
              <Text style={{ color: theming.colors.purple }}>Details</Text>
            </Text>
          </View>

          <View style={styles.itemImage}>
            <Image source={images.itemImg} style={styles.itemImg} />
          </View>
        </View>

        <View style={styles.itemSpot}>
          <LocationIcon width={16} height={16} />
          <View style={styles.itemSpotRight}>
            <Text style={styles.itemSpotTitle}>Moderno Dance Academy</Text>
            <View style={styles.itemSpotImages}>
              <Image source={images.eventAvatar} style={styles.itemSpotImg} />
              <Image
                source={images.defaultUser}
                style={[styles.itemSpotImg, { marginLeft: -8, zIndex: -1 }]}
              />
            </View>
            <Text style={styles.itemSpotTitle}>+ 10900 going</Text>
          </View>
        </View>

        <DCLine />

        <View style={styles.itemBottom}>
          <View style={styles.itemTags}>
            <View style={styles.itemTag}>
              <Text style={styles.itemTagTitle}>Salsa</Text>
            </View>
            <View style={styles.itemTag}>
              <Text style={styles.itemTagTitle}>Bachata</Text>
            </View>
            <View style={styles.itemTag}>
              <Text style={styles.itemTagTitle}>Kizomba</Text>
            </View>
            <View style={styles.itemAnotherTag}>
              <Text style={styles.itemAnotherTagTitle}>+3</Text>
            </View>
          </View>
          <View style={styles.itemBtn}>
            <Text style={styles.itemBtnTitle}>Attend</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    width: '100%',
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: theming.spacing.SM,
    padding: 12,
    backgroundColor: theming.colors.white,
  },
  itemBody: {
    width: '100%',
    flexDirection: 'row',
    // justifyContent: "center",
    alignItems: 'flex-start',
    gap: 10,
  },
  itemBodyText: {
    width: '70%',
    flex: 1,
  },
  itemCategories: {
    flexDirection: 'row',
    gap: 4,
  },
  itemCategory: {
    backgroundColor: theming.colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  itemCategoryTitle: {
    color: theming.colors.white,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
  itemDate: {
    flexDirection: 'row',
    gap: theming.spacing.SM,
    marginTop: 13,
  },
  itemDateTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 6,
  },
  itemSubtitle: {
    fontWeight: '400',
    fontSize: 14,
    color: theming.colors.gray700,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 6,
  },
  itemImage: {
    width: 80,
    height: 105,
    borderRadius: 6,
    overflow: 'hidden',
  },
  itemImg: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    resizeMode: 'cover',
  },
  itemSpot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theming.spacing.SM,
    marginTop: 10,
    marginBottom: 15,
  },
  itemSpotRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  itemSpotTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: theming.colors.gray700,
    fontFamily: theming.fonts.latoRegular,
  },
  itemSpotImages: {
    flexDirection: 'row',
    position: 'relative',
  },
  itemSpotImg: {
    width: 24,
    height: 24,
    borderRadius: 50,
    position: 'relative',
    borderWidth: 1,
    borderColor: theming.colors.white,
  },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  itemTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  itemTag: {
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  itemTagTitle: {
    color: theming.colors.purple,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
  itemAnotherTag: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: theming.colors.gray75,
  },
  itemAnotherTagTitle: {
    color: theming.colors.darkGray,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
  itemBtn: {
    backgroundColor: theming.colors.orange,
    paddingHorizontal: 12,
    paddingVertical: theming.spacing.SM,
    borderRadius: 100,
  },
  itemBtnTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: theming.colors.white,
    fontFamily: theming.fonts.latoRegular,
  },
});
