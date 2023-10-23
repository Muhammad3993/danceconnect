import React, {useCallback, memo, useRef, useState} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Image,
  LayoutAnimation,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import colors from '../utils/colors';
import {SCREEN_WIDTH} from '../utils/constants';
import {apiUrl} from '../api/serverRequests';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

type itemProp = {
  data: any;
  key: number;
};
type paginationProp = {
  index: number;
  data: string[];
};
const Slide = memo(function Slide(data: itemProp) {
  return (
    <View style={styles.slide}>
      <FastImage
        source={{
          uri: apiUrl + data?.data?.item,
          cache: FastImage.cacheControl.immutable,
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
        defaultSource={require('../assets/images/default.jpeg')}
        style={styles.slideImage}
      />
    </View>
  );
});
const Pagination = ({index, data}: paginationProp) => {
  return (
    <View style={styles.pagination}>
      {data.map((_, i) => {
        return (
          <View
            key={i}
            style={[
              {width: SCREEN_WIDTH / 2 / data.length},
              styles.paginationDot,
              data?.length > 1
                ? index === i
                  ? styles.paginationDotActive
                  : styles.paginationDotInactive
                : null,
            ]}
          />
        );
      })}
    </View>
  );
};

const Carousel = ({items}: any) => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  indexRef.current = index;
  const onScroll = useCallback((event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);
    const isNoMansLand = distance > 0.4;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIndex(roundIndex);
    }
  }, []);

  const flatListOptimizationProps = {
    initialNumToRender: 0,
    maxToRenderPerBatch: 1,
    removeClippedSubviews: true,
    scrollEventThrottle: 16,
    windowSize: 2,
    keyExtractor: useCallback((s: {id: number}) => String(s.id), []),
    getItemLayout: useCallback(
      (_: any, index: number) => ({
        index,
        length: SCREEN_WIDTH,
        offset: index * SCREEN_WIDTH,
      }),
      [],
    ),
  };

  const renderItem = useCallback(function renderItem(item: any) {
    return (
      // <TouchableOpacity
      //   activeOpacity={0.9}
      //   onPress={idx =>
      //     navigation.navigate('ImageView', {
      //       idx,
      //       images: items,
      //     })
      //   }>
        <Slide data={item} key={items.indexOf(item)} />
      // </TouchableOpacity>
    );
  }, []);

  if (!items?.length) {
    return (
      <View style={styles.slide}>
        <Image
          source={require('../assets/images/default.jpeg')}
          style={styles.slideImage}
        />
      </View>
    );
  }
  return (
    <>
      <FlatList
        data={items}
        style={styles.carousel}
        renderItem={item => renderItem(item)}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces
        onScroll={onScroll}
        {...flatListOptimizationProps}
      />
      <View style={styles.paginationWrapper}>
        <Pagination index={index} data={items} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  slide: {
    height: 340,
    // width: SCREEN_WIDTH,
  },
  slideImage: {
    width: SCREEN_WIDTH,
    height: 340,
  },
  pagination: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: -40,
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 18,
    zIndex: 2,
  },
  paginationDot: {
    height: 6,
    width: 14,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  paginationDotActive: {backgroundColor: colors.orange, width: 40},
  paginationDotInactive: {backgroundColor: colors.gray},
  carousel: {flex: 1, zIndex: 1},
});

export default Carousel;
