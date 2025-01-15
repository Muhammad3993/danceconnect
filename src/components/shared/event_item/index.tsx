import { Image, Text, View } from 'react-native';
import React from 'react';
import { SetCalendarIcon } from 'components/icons/setCalendar';
import { images } from 'common/resources/images';
import { DCLine } from '../line';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { TagsList } from '../../tags_list';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface EventItemProps {
  click?: () => void;
}

export const EventItem = ({ click }: EventItemProps) => {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(styleSheet);

  return (
    <TouchableOpacity onPress={click}>
      <View style={styles.item}>
        <View style={styles.itemBody}>
          <View style={styles.itemBodyText}>
            <TagsList
              list={['Festival', '$25.00']}
              backgroundColor={[theme.colors.secondary500, theme.colors.green]}
            />

            <View style={styles.itemDate}>
              <SetCalendarIcon />
              <Text style={styles.itemDateTitle}>Mon, Dec 24 • 21:00</Text>
            </View>
            <Text style={styles.itemTitle}>"Sensual" Bachata </Text>
            <Text style={styles.itemSubtitle} numberOfLines={3}>
              Experience the Magic of Bachata at the Los Angeles Bachata
              Festival!...
              <Text style={{ color: theme.colors.secondary500 }}>
                {t('details')}
              </Text>
            </Text>
          </View>

          <View style={styles.itemImage}>
            <Image source={images.itemImg} style={styles.itemImg} />
          </View>
        </View>

        <View style={styles.itemSpot}>
          <Image
            style={{ width: 16, height: 16 }}
            tintColor={theme.colors.secondary500}
            source={images.icon.locationPin}
          />
          <View style={styles.itemSpotRight}>
            <Text style={styles.itemSpotTitle}>Moderno Dance Academy</Text>
            <View style={styles.itemSpotImages}>
              <Image source={images.eventAvatar} style={styles.itemSpotImg} />
              <Image
                source={images.defaultUser}
                style={[styles.itemSpotImg, { marginLeft: -8, zIndex: -1 }]}
              />
            </View>
            <Text style={styles.itemSpotTitle}>+ 10900 {t('going')}</Text>
          </View>
        </View>

        <DCLine />

        <View style={styles.itemBottom}>
          <TagsList list={['Salsa', 'Bachata', 'Kizomba']} />
          <View style={styles.itemBtn}>
            <Text style={styles.itemBtnTitle}>{t('attend')}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(theming => ({
  item: {
    width: '100%',
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: theming.spacing.XS,
    padding: 12,
    backgroundColor: theming.colors.white,
  },
  itemBody: {
    width: '100%',
    flexDirection: 'row',
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

  itemDate: {
    flexDirection: 'row',
    gap: theming.spacing.XS,
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
    gap: theming.spacing.XS,
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
  itemBtn: {
    backgroundColor: theming.colors.orange,
    paddingHorizontal: 12,
    paddingVertical: theming.spacing.XS,
    borderRadius: 100,
  },
  itemBtnTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: theming.colors.white,
    fontFamily: theming.fonts.latoRegular,
  },
}));
