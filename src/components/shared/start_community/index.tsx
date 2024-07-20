import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DCRoundIcon } from '../round_icon'
import { CommunitiesIcon } from 'components/icons/communities'
import { theming } from 'common/constants/theming'
import { PlusIcon } from 'components/icons/plus'
import { RightArrowIcon } from 'components/icons/rightArrow'

export function StartCommunity() {
  return (
    <View style={styles.box}>
        <View style={styles.boxIcon}>
            <DCRoundIcon 
                icon={<CommunitiesIcon active fill={theming.colors.white} />}
                iconBoxStyle={{
                    width: 44,
                    height: 44,
                    backgroundColor: theming.colors.purple,
                }}
            />
            <View style={styles.boxPlusIcon} >
                <PlusIcon />
            </View>
        </View>

        <View style={{width: "77%"}}>
            <Text style={styles.boxTitle}>Start a new community</Text>
            <Text style={styles.boxSubtitle}>to create and manage your own events</Text>
        </View>

        <View>
            <RightArrowIcon />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    box: {
        width: "100%",
        backgroundColor: theming.colors.lightPurple,
        borderWidth: 1,
        borderColor: theming.colors.gray75,
        borderRadius: theming.spacing.SM,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    boxIcon: {
        width: 44,
        position: "relative"
    },
    boxPlusIcon: {
        width: 18,
        height: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theming.colors.white,
        borderWidth: 2,
        borderColor: theming.colors.purple,
        borderRadius: 50,
        position: "absolute",
        right: 0
    },
    boxTitle: {
        color: theming.colors.textPrimary,
        fontWeight: "700",
        fontSize: 18,
        fontFamily: theming.fonts.latoRegular,
    },
    boxSubtitle: {
        color: theming.colors.gray700,
        fontWeight: "400",
        fontSize: 14,
        fontFamily: theming.fonts.latoRegular,
    }
})