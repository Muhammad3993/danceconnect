import { theming } from 'common/constants/theming';
import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const viewabilityConfig = {
  waitForInteraction: true,
  viewAreaCoveragePercentThreshold: 40,
};

interface Props<T> {
  onEndReached?: () => void;
  isLoading?: boolean;
  loadingMore?: boolean;
  emptyTitle: string;
  data: T[];
  renderItem: ListRenderItem<T>;
  headerComponent: ReactNode;
  onViewableItemsChanged: FlatListProps<T>['onViewableItemsChanged'];
}

export function PrifleView<T extends { id: string }>({
  onEndReached,
  isLoading,
  emptyTitle,
  loadingMore,
  data,
  renderItem,
  headerComponent,
  onViewableItemsChanged,
}: Props<T>) {
  return (
    <FlatList
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      data={data}
      ListHeaderComponent={
        <View style={styles.infoHeader}>{headerComponent}</View>
      }
      renderItem={renderItem}
      ListEmptyComponent={
        <View style={{ marginTop: 90 }}>
          {isLoading ? (
            <ActivityIndicator size={'large'} />
          ) : (
            <Text style={styles.emptyText}>{emptyTitle}</Text>
          )}
        </View>
      }
      ListFooterComponent={
        loadingMore ? <ActivityIndicator size={'large'} /> : undefined
      }
      keyExtractor={(item, index) => item?.id ?? index.toString()}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      scrollEventThrottle={400}
    />
  );
}

const styles = StyleSheet.create({
  infoHeader: {
    backgroundColor: theming.colors.white,
    paddingHorizontal: theming.spacing.MD,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: theming.fonts.latoRegular,
    fontSize: 16,
    color: theming.colors.gray500,
  },
});
