import {StyleSheet, View} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {SCREEN_WIDTH} from '../utils/constants';
import colors from '../utils/colors';

interface Props {
  header: React.ReactElement;
  data: any[];
}

export function ProfileMedia({header, data}: Props) {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={{flex: 1, paddingHorizontal: 24}}
      numColumns={3}
      columnWrapperStyle={{flex: 1}}
      data={data}
      contentContainerStyle={{justifyContent: 'space-between'}}
      ListHeaderComponent={header}
      renderItem={({index}) => {
        return (
          <View
            style={[
              styles.mediaItem,
              {marginRight: (index + 1) % 3 == 0 ? 0 : 6},
            ]}
          />
        );
      }}
      horizontal={false}
      keyExtractor={(_, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab: {
    height: 42,
    width: (SCREEN_WIDTH - 50) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray100,
  },

  mediaItem: {
    width: (SCREEN_WIDTH - 60) / 3,
    height: (SCREEN_WIDTH - 60) / 3,
    backgroundColor: colors.gray300,
    marginTop: 6,
  },
});
