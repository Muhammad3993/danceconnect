import { images } from 'common/resources/images';
import { SetCalendarIcon } from 'components/icons/setCalendar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function RecentEvent() {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(styleSheet);

  // const [isActiveBox, setIsActiveBox] = useState(1);

  return (
    <View style={styles.homeBox}>
      <View style={styles.homeBoxImage}>
        <Image source={images.homeImg} style={{ flex: 1 }} />
        <View style={styles.homePrice}>
          <Text style={styles.homePriceTitle}>$ 25.00</Text>
        </View>
      </View>

      <View style={styles.homeBoxTags}>
        <View style={styles.homeBoxTagActive}>
          <Text style={styles.homeBoxTagTitleActive}>Party</Text>
        </View>
        <View style={styles.homeBoxTag}>
          <Text style={styles.homeBoxTagTitle}>Hip Hop</Text>
        </View>
        <View style={styles.homeBoxTag}>
          <Text style={styles.homeBoxTagTitle}>Afro Dance</Text>
        </View>
        <View style={styles.homeBoxTagCount}>
          <Text style={styles.homeBoxTagCountTitle}>+3</Text>
        </View>
      </View>

      <Text style={styles.homeBoxTitle} numberOfLines={1}>
        National Music Festival
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
        <View style={{ flex: 1 }}>
          <View style={[styles.homeBoxRow, { marginBottom: theme.spacing.SM }]}>
            <SetCalendarIcon />
            <Text style={styles.homeBoxRowTitle} numberOfLines={1}>
              Mon, nov 5 • 21:00
            </Text>
          </View>
          <View style={styles.homeBoxRow}>
            <Image
              style={{ width: 16, height: 16 }}
              tintColor={theme.colors.secondary500}
              source={images.icon.locationPin}
            />
            <Text style={styles.homeBoxRowTitle} numberOfLines={1}>
              night Club 24
            </Text>
          </View>
        </View>

        <View style={styles.homeBoxBottomBtn}>
          <Text style={styles.homeBoxBottomBtnTitle}>{t('attend')}</Text>
        </View>
      </View>
    </View>
  );
}

const styleSheet = createStyleSheet(theming => ({
  homeBox: {
    flex: 1,
    width: 333,
    backgroundColor: theming.colors.white,
    padding: theming.spacing.SM,
    borderWidth: 1,
    borderColor: theming.colors.gray75,
    borderRadius: theming.spacing.XS,
    shadowColor: theming.colors.shadow3,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.75,
    shadowRadius: 6,
    elevation: 3,
  },
  homeBoxImage: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    borderRadius: 6,
  },
  homeBoxImg: {
    width: '100%',
    height: '100%',
  },
  homePrice: {
    paddingHorizontal: theming.spacing.XS,
    paddingVertical: 4,
    backgroundColor: theming.colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  homePriceTitle: {
    fontWeight: '700',
    fontSize: 12,
    color: theming.colors.white,
    fontFamily: theming.fonts.latoRegular,
  },
  homeBoxTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    marginBottom: theming.spacing.XS,
  },
  homeBoxTagActive: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: theming.colors.secondary500,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theming.colors.secondary500,
  },
  homeBoxTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theming.colors.gray250,
  },
  homeBoxTagCount: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: theming.colors.gray75,
    borderRadius: 4,
  },
  homeBoxTagTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theming.colors.secondary500,
    fontFamily: theming.fonts.latoRegular,
  },
  homeBoxTagTitleActive: {
    fontSize: 12,
    fontWeight: '700',
    color: theming.colors.white,
    fontFamily: theming.fonts.latoRegular,
  },
  homeBoxTagCountTitle: {
    color: theming.colors.darkGray,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
  homeBoxTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
    marginBottom: theming.spacing.SM,
  },
  homeBoxBottomBtn: {
    paddingHorizontal: theming.spacing.MD,
    paddingVertical: theming.spacing.XS,
    backgroundColor: theming.colors.orange,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBoxBottomBtnTitle: {
    position: 'relative',
    fontWeight: '600',
    fontSize: 14,
    color: theming.colors.white,
    fontFamily: theming.fonts.latoRegular,
  },
  homeBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theming.spacing.XS,
  },
  homeBoxRowTitle: {
    fontWeight: '800',
    fontSize: 12,
    color: theming.colors.textPrimary,
    textTransform: 'uppercase',
    fontFamily: theming.fonts.latoRegular,
  },
}));
