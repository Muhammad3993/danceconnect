import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { FilterIcon } from 'components/icons/filter'
import { RightArrowIcon } from 'components/icons/rightArrow'
import { theming } from 'common/constants/theming'

interface FilterComponentProps {
  containerStyle?: ViewStyle;
  title?: ReactNode;
}

export const FilterComponent = ({ title, containerStyle }: FilterComponentProps) => {
  return (
    <View style={[styles.filter, containerStyle]}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.filterBtn}>
        <FilterIcon />
        <Text style={styles.filterBtnTitle}>Filters</Text>
        <RightArrowIcon 
          stroke={theming.colors.textPrimary} 
          style={{
            transform: [{ rotate: '90deg' }]
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  filter: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: "center",
    marginTop: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theming.colors.gray75,
    paddingHorizontal: theming.spacing.MD,
    paddingVertical: theming.spacing.SM,
    borderRadius: 100,
  },
  filterBtnTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theming.colors.darkGray,

  }
})