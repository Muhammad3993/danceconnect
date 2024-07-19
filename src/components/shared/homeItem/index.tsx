import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { images } from 'common/resources/images'
import { SetCalendarIcon } from 'components/icons/setCalendar';
import { LocationIcon } from 'components/icons/location';
import { theming } from 'common/constants/theming';

export function HomeItem() {
  const [isActiveBox, setIsActiveBox] = useState(1);
  return (
    <View style={styles.homeBox}>

        <View style={styles.homeBoxImage}>
            <Image 
                source={images.homeImg}
                style={styles.homeBoxImg}
            />
            <View style={styles.homePrice}>
                <Text style={styles.homePriceTitle}>$ 25.00</Text>
            </View>
        </View>

        <View style={styles.homeBoxTags}>
        <View style={isActiveBox !== 1 ? styles.homeBoxTag : styles.homeBoxTagActive}>
            <Text style={isActiveBox !== 1 ? styles.homeBoxTagTitle : styles.homeBoxTagTitleActive} onPress={() => setIsActiveBox(1)}>Party</Text>
        </View>              
        <View style={isActiveBox !== 2 ? styles.homeBoxTag : styles.homeBoxTagActive}>
            <Text style={isActiveBox !== 2 ? styles.homeBoxTagTitle : styles.homeBoxTagTitleActive} onPress={() => setIsActiveBox(2)}>Hip Hop</Text>
        </View>              
        <View style={isActiveBox !== 3 ? styles.homeBoxTag : styles.homeBoxTagActive}>
            <Text style={isActiveBox !== 3 ? styles.homeBoxTagTitle : styles.homeBoxTagTitleActive} onPress={() => setIsActiveBox(3)}>Afro Dance</Text>
        </View>              
        <View style={styles.homeBoxTagCount}>
            <Text style={styles.homeBoxTagCountTitle}>+3</Text>
        </View>
        </View>

        <Text style={styles.homeBoxTitle}>Afro Beats Meets Hip-Hop</Text>

        <View style={{marginTop: 10}}>
            <View style={styles.homeBoxRow}>
                <SetCalendarIcon />
                <Text style={styles.homeBoxRowTitle}>Mon, nov 5  •  21:00</Text>
            </View>
            <View style={styles.homeBoxBottom}>
                <View style={styles.homeBoxRow}>
                <LocationIcon width={16} height={16} />
                <Text style={styles.homeBoxRowTitle}>night Club 24</Text>
                </View>
                <View style={styles.homeBoxBottomBtn}>
                <Text style={styles.homeBoxBottomBtnTitle}>Attend</Text>
                </View>
            </View>
        </View>

    </View>
  )
}

const styles = StyleSheet.create({
    homeBox: {
        width: 332,
        backgroundColor: theming.colors.white,
        borderWidth: 1,
        borderColor: theming.colors.gray75,
        borderRadius: theming.spacing.SM,
        shadowColor: theming.colors.purpleTransparent,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 5,
        marginRight: 20,
        padding: 10,
    },
    homeBoxImage: {
        width: "100%",
        height: 201,
        position: "relative",
        overflow: "hidden",
        borderRadius: 6,
    },
    homeBoxImg: {
        width: "100%",
        height: "100%"
    },
    homePrice: {
        paddingHorizontal: theming.spacing.SM,
        paddingVertical: 4,
        backgroundColor: theming.colors.green,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        position: "absolute",
        right: 10,
        bottom: 10,
    },
    homePriceTitle: {
        fontWeight: "700",
        fontSize: 12,
        color: theming.colors.white,
        fontFamily: theming.fonts.latoRegular,
    },
    homeBoxTags: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 10
    },
    homeBoxTagActive: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: theming.colors.purple,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theming.colors.purple
    },
    homeBoxTag: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: theming.colors.gray250
    },
    homeBoxTagCount: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: theming.colors.gray75,
        borderRadius: 4,
    },
    homeBoxTagTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: theming.colors.purple,
        fontFamily: theming.fonts.latoRegular,
    },
    homeBoxTagTitleActive: {
        fontSize: 12,
        fontWeight: "700",
        color: theming.colors.white,
        fontFamily: theming.fonts.latoRegular,
    },
    homeBoxTagCountTitle: {
        color: theming.colors.darkGray,
        fontWeight: "700",
        fontSize: 12,
        fontFamily: theming.fonts.latoRegular
    },
    homeBoxTitle: {
        fontSize: 20,
        fontWeight: "700",
        fontFamily: theming.fonts.latoRegular,
        color: theming.colors.textPrimary,
        marginTop: 6,
    },
    homeBoxBottomBtn: {
        paddingHorizontal: theming.spacing.MD,
        paddingVertical: theming.spacing.SM,
        backgroundColor: theming.colors.orange,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    homeBoxBottomBtnTitle: {
        position: "relative",
        top: -1,
        fontWeight: "600",
        fontSize: 14,
        color: theming.colors.white,
        fontFamily: theming.fonts.latoRegular,
    },
    homeBoxRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: theming.spacing.SM
    },
    homeBoxRowTitle: {
        fontWeight: "800",
        fontSize: 12,
        color: theming.colors.textPrimary,
        textTransform: "uppercase"
    },
    homeBoxBottom: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }
})