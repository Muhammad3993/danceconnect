import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../utils/colors';
import {SCREEN_WIDTH} from '../../utils/constants';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {FileRepository, PostContentType, PostRepository} from '@amityco/ts-sdk';
import {
  setNoticeMessage,
  setNoticeVisible,
} from '../../store/actions/appStateActions';
import useRegistration from '../../hooks/useRegistration';
import {useDispatch} from 'react-redux';
// import Video from 'react-native-video';

export function CreatePostScreen({navigation, route}) {
  const {postId, postText, postImage, postVideo} = route.params ?? {};
  const dispatch = useDispatch();
  const {currentUser} = useRegistration();
  const [image, setImage] = useState<Asset | null>(null);
  const [initialImage, setinitalImage] = useState<string | undefined>(
    postImage,
  );
  // const [video, setVideo] = useState<Asset | null>(null);
  // const [initialVideo, setInitialVideo] = useState<string | undefined>(
  //   postVideo,
  // );
  const [text, setText] = useState(postText ?? '');
  const [creatingPost, setCreatingPost] = useState(false);
  const isCreating = postId === undefined;

  const uploadImage = async () => {
    let options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 1,
    };
    const images = await launchImageLibrary(options);

    if (images.assets) {
      // setVideo(null);
      // setInitialVideo(undefined);
      setinitalImage(undefined);
      setImage(images.assets[0]);
    }
  };

  // const uploadVideo = async () => {
  //   let options: ImageLibraryOptions = {
  //     mediaType: 'video',
  //     selectionLimit: 1,
  //     quality: 1,
  //     videoQuality: 'medium',
  //   };
  //   const images = await launchImageLibrary(options);

  //   if (images.assets) {
  //     setImage(null);
  //     setInitialVideo(undefined);
  //     setinitalImage(undefined);
  //     setVideo(images.assets[0]);
  //   }
  // };

  const uploadCameraImage = async () => {
    try {
      let options: CameraOptions = {
        mediaType: 'photo',
        quality: 1,
      };
      const images = await launchCamera(options);

      if (images.assets) {
        // setVideo(null);
        // setInitialVideo(undefined);
        setinitalImage(undefined);
        setImage(images.assets[0]);
      }
    } catch (er) {
      console.log(er);
    }
  };

  const createPost = async () => {
    try {
      setCreatingPost(true);
      const attachments = [];

      if (image !== null) {
        const formData = new FormData();

        const imageUri = image.uri ?? '';

        formData.append('files', {
          type: image.type,
          name: image.fileName,
          uri:
            Platform.OS === 'android'
              ? imageUri
              : imageUri.replace('file://', ''),
        });

        const {data} = await FileRepository.uploadImage(formData);
        // console.log(data);

        attachments.push({type: PostContentType.IMAGE, fileId: data[0].fileId});
      }

      // if (video !== null) {
      //   const formData = new FormData();

      //   const uri = video.uri ?? '';

      //   formData.append('files', {
      //     type: video.type,
      //     name: video.fileName,
      //     uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      //   });

      //   const {data} = await FileRepository.uploadVideo(formData);
      //   // console.log(data);

      //   attachments.push({type: PostContentType.VIDEO, fileId: data[0].fileId});
      // }

      const newPost = {
        tags: ['post'],
        data: {text},
        attachments: attachments.length === 0 ? undefined : attachments,
        targetType: 'user',
        targetId: currentUser.id,
      };

      if (isCreating) {
        await PostRepository.createPost(newPost);
      } else {
        await PostRepository.editPost(postId, newPost);
      }
      navigation.goBack();
    } catch (err) {
      dispatch(setNoticeMessage({errorMessage: err?.message}));
      dispatch(setNoticeVisible({isVisible: true}));
      console.log(err);
    }
  };

  const canCreate = image !== null || text.trim() !== '';
  // const canCreate = image !== null || text.trim() !== '' || video !== null;

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.contianer}>
        <View style={styles.header}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <TouchableOpacity onPress={navigation.goBack}>
              <Image source={{uri: 'close'}} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>

          <View style={{flex: 2, alignItems: 'center'}}>
            <Text style={styles.headerTitleText}>
              {isCreating ? 'Add' : 'Edit'} Post
            </Text>
          </View>

          <View style={{flex: 1, alignItems: 'flex-end'}}>
            {creatingPost ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text
                style={[styles.headerRight, {opacity: canCreate ? 1 : 0.6}]}
                disabled={!canCreate}
                onPress={createPost}>
                Post
              </Text>
            )}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="What’s going on..."
            multiline
            autoFocus
          />

          {(image !== null || initialImage !== undefined) && (
            <View style={styles.mediaContent}>
              <Image
                style={{flex: 1}}
                source={{uri: image?.uri ?? initialImage + '?size=medium'}}
              />
            </View>
          )}

          {/* {(video !== null || initialVideo !== undefined) && (
            <View style={styles.mediaContent}>
              <Video
                resizeMode="cover"
                source={{uri: video?.uri ?? initialVideo}}
                style={{flex: 1}}
              />
            </View>
          )} */}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerItem}
            onPress={uploadCameraImage}>
            <Image source={{uri: 'photo'}} style={{width: 24, height: 24}} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={uploadImage}>
            <Image source={{uri: 'image'}} style={{width: 24, height: 24}} />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.footerItem} onPress={uploadVideo}>
            <Image
              source={{uri: 'playcircle'}}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  headerTitleText: {
    fontWeight: '600',
    fontFamily: 'Mulish-Regular',
    fontSize: 18,
  },
  headerRight: {
    fontFamily: 'Mulish-Regular',
    fontSize: 15,
    color: colors.textHighlighted,
    letterSpacing: -0.2,
  },
  scroll: {
    flex: 1,
    paddingBottom: 50,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  mediaContent: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH - 32,
    borderRadius: 8,
    marginVertical: 12,
    overflow: 'hidden',
  },
  footer: {
    height: 48,
    width: SCREEN_WIDTH,
    backgroundColor: colors.white,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
    elevation: 3,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerItem: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.baseShade,
    marginRight: 45,
  },
});
