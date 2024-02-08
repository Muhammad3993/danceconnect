import {
  ContentFeedType,
  FileRepository,
  PostContentType,
  PostRepository,
} from '@amityco/ts-sdk';
import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import ScalableImage from '../../components/ScalabelImage';
import useRegistration from '../../hooks/useRegistration';
import {
  setNoticeMessage,
  setNoticeVisible,
} from '../../store/actions/appStateActions';
import colors from '../../utils/colors';
import {SCREEN_WIDTH} from '../../utils/constants';
import {useUploadImage} from './hooks/useUploadImage';
import {useUploadVideo} from './hooks/useUploadVideo';
import {VideoView} from '../../components/VideoView';
import useAppStateHook from '../../hooks/useAppState';

export function CreatePostScreen({navigation, route}) {
  const {postId, postText, postImage, postVideo} = route.params ?? {};
  const dispatch = useDispatch();

  const {currentUser} = useRegistration();
  const {setMessageNotice, setVisibleNotice} = useAppStateHook();

  const isCreating = postId === undefined;

  const [touched, setTouched] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>(
    postImage ? 'photo' : 'video',
  );

  const onUploadVideo = useCallback(() => {
    setTouched(true);
    setMediaType('video');
  }, []);

  const onUploadImage = useCallback(() => {
    setTouched(true);
    setMediaType('photo');
  }, []);

  const {selectVideo, viedoUrl} = useUploadVideo(onUploadVideo);
  const [videSavePercent, setVideSavePercent] = useState<number | null>(null);
  const [videFileId, setVideFileId] = useState<string | null>(null);

  const {uploadCameraImage, uploadImage, image} = useUploadImage(onUploadImage);

  const [text, setText] = useState(postText ?? '');
  const [creatingPost, setCreatingPost] = useState(false);

  const saveVideo = useCallback(async () => {
    try {
      if (viedoUrl !== null) {
        const formData = new FormData();

        formData.append('files', {
          type: viedoUrl.includes('MOV') ? 'video/mov' : 'video/mp4',
          name: viedoUrl,
          uri:
            Platform.OS === 'android'
              ? viedoUrl
              : viedoUrl.replace('file://', ''),
        });
        const {data} = await FileRepository.uploadVideo(
          formData,
          ContentFeedType.POST,
          percent => {
            setVideSavePercent(percent);
          },
        );

        setVideFileId(data[0].fileId);
      }
    } catch (err) {
      setMessageNotice(err?.message);
      setVisibleNotice(true);
    }
  }, [viedoUrl]);

  useLayoutEffect(() => {
    saveVideo();
  }, [saveVideo]);

  const createPost = async () => {
    try {
      setCreatingPost(true);
      const attachments = [];

      if (mediaType === 'photo' && image !== null) {
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

        attachments.push({type: PostContentType.IMAGE, fileId: data[0].fileId});
      }

      if (mediaType === 'video' && videFileId !== null) {
        attachments.push({type: PostContentType.VIDEO, fileId: videFileId});
      }

      const newPost = {
        tags: ['post'],
        data: {text},
        attachments: attachments.length === 0 ? undefined : attachments,
        targetType: 'user',
        targetId: currentUser.id,
      };
      console.log(newPost);

      if (isCreating) {
        await PostRepository.createPost(newPost);
      } else {
        await PostRepository.editPost(postId, newPost);
      }
      navigation.goBack();
    } catch (err) {
      dispatch(setNoticeMessage({errorMessage: err?.message}));
      dispatch(setNoticeVisible({isVisible: true}));
      setCreatingPost(false);
      console.log(err);
    }
  };

  const canCreate = image !== null || text.trim() !== '' || viedoUrl !== null;

  const initalImage = postImage ? postImage + '?size=medium' : null;

  const currImage = touched ? image?.uri : initalImage;
  const currVideo = touched ? viedoUrl : postVideo;

  const uploadingVideo =
    mediaType === 'video' &&
    Boolean(videSavePercent && videSavePercent > 0 && videSavePercent < 99);

  return (
    <SafeAreaView style={styles.contianer}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.contianer}>
          <View style={styles.header}>
            <View style={{flex: 1, alignItems: 'flex-start'}}>
              <TouchableOpacity onPress={navigation.goBack}>
                <Image
                  source={{uri: 'close'}}
                  style={{width: 20, height: 20}}
                />
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
                  style={[
                    styles.headerRight,
                    {opacity: canCreate && !uploadingVideo ? 1 : 0.6},
                  ]}
                  disabled={!canCreate || uploadingVideo}
                  onPress={createPost}>
                  Post
                </Text>
              )}
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{paddingBottom: 70}}
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            style={styles.scroll}>
            <TextInput
              style={{marginBottom: 12}}
              value={text}
              onChangeText={setText}
              placeholder="What’s going on..."
              multiline
              autoFocus
            />

            {mediaType === 'photo' && currImage && (
              <View style={styles.mediaContent}>
                <ScalableImage
                  originalWidth={SCREEN_WIDTH - 32}
                  uri={currImage}
                />
              </View>
            )}

            {mediaType === 'video' && currVideo && (
              <VideoView
                isCreating
                videoUrl={currVideo}
                width={SCREEN_WIDTH - 32}
                uploadPercent={videSavePercent}
              />
            )}
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

            <TouchableOpacity style={styles.footerItem} onPress={selectVideo}>
              <Image
                source={{uri: 'playcircle'}}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    fontFamily: 'Lato-Regular',
    fontSize: 18,
  },
  headerRight: {
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    color: colors.textHighlighted,
    letterSpacing: -0.2,
  },
  scroll: {
    flex: 1,

    paddingTop: 20,
    paddingHorizontal: 16,
  },
  mediaContent: {
    borderRadius: 8,
    marginVertical: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray100,
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
      width: 1,
      height: -2.7,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
