import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { DCButton } from 'components/shared/button';
import { useDCStore } from 'store';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { theming } from 'common/constants/theming';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { CloseIcon } from 'components/icons/close';

export function RegionBottomSheet({ setContent }: any) {
  const regions = useDCStore.use.constants()?.regions;

  // console.log('regions', regions);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setContent('main')}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Regions</Text>
        <CloseIcon height={20} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 24 }}
        data={regions}
        keyExtractor={item => item.name}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.searchItemContainer}
              key={item.name}
              onPress={() => {}}>
              <Text style={styles.searchItemText}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: theming.spacing.MD,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theming.spacing.MD,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  searchItemContainer: {
    borderBottomColor: theming.colors.gray,
    borderBottomWidth: 0.5,
  },
  searchItemText: {
    fontSize: 16,
    lineHeight: 22.4,
    color: theming.colors.textPrimary,
    marginVertical: theming.spacing.MD,
    fontWeight: '500',
  },
  closeIcon: {
    height: 20,
  },
});
