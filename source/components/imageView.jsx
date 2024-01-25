import React from 'react';
import * as RN from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import colors from '../utils/colors';
import { apiUrl } from '../api/serverRequests';
import { SCREEN_HEIGHT, SCREEN_WIDTH, statusBarHeight } from '../utils/constants';
import FastImage from 'react-native-fast-image';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

const ImageView = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { idx, images } = route.params;
  // console.log('images', images);
  // console.log(
  //   'imtes',
  //   images.map(item => {
  //     return {
  //       url: `${apiUrl + item}`,
  //     };
  //   }),
  // );
  const items = images.map(item => {
    return {
      url: `${apiUrl + item}`,
    };
  });
  const onBack = () => navigation.goBack();

  //   const item = i => {
  //     console.log(i.item);
  //     return (
  //       <RN.View style={{backgroundColor: 'red'}}>
  //         <FastImage
  //           source={{
  //             uri: i.url,
  //             cache: FastImage.cacheControl.immutable,
  //             priority: FastImage.priority.high,
  //           }}
  //           resizeMode={FastImage.resizeMode.cover}
  //           defaultSource={require('../assets/images/default.jpeg')}
  //           style={styles.slideImage}
  //         />
  //       </RN.View>
  //     );
  //   };
  return (
    <RN.View style={styles.container}>
      <RN.View style={styles.content}>
        <RN.TouchableOpacity style={styles.closeIconContainer} onPress={onBack}>
          <RN.Image style={styles.closeIcon} source={{ uri: 'close' }} />
        </RN.TouchableOpacity>
        {/* <FlatList horizontal renderItem={item} data={items} /> */}
        <ScrollView horizontal>
          {items.map(i => {
            // console.log(i)
            return (
              <FastImage
                source={{
                  uri: i.url,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
                defaultSource={require('../assets/images/default.jpeg')}
                style={styles.slideImage}
              />
            )
          })}
        </ScrollView>

        {/* <ImageViewer
          backgroundColor="#FFFFFF"
          style={styles.imageStyle}
          imageUrls={items}
          saveToLocalByLongPress={false}
        /> */}
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageStyle: {
    backgroundColor: colors.redError,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  closeIconContainer: {
    // alignItems: 'flex-end',
    zIndex: 2,
    position: 'absolute',
  },
  closeIcon: {
    marginTop: 40,
    margin: 20,
    height: 24,
    tintColor: colors.black,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

export default ImageView;
