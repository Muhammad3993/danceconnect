import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import { theming } from 'common/constants/theming'

interface DCIconProps {
    iconBoxStyle?: ViewStyle;
}

export const DCIcon = ({icon, iconBoxStyle}: DCIconProps) => {
  return (
    <View style={[styles.iconBox, iconBoxStyle]}>
      <View style={styles.icon}>
        {icon}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    iconBox: {
        width: 40,
        height: 40,
        backgroundColor: `${theming.colors.textPrimary}50`,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        opacity: 1,
    }
})

