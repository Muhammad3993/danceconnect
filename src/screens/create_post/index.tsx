import { FileRepository, PostRepository } from '@amityco/ts-sdk-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SCREEN_WIDTH } from 'common/constants';
import { theming } from 'common/constants/theming';
import { ScalableImage } from 'components/shared/scallable_image';
import { VideoView } from 'components/shared/scallable_video';
import { StackScreenProps } from 'screens/interfaces';
import { usePickVideoFile, VideoData } from 'common/hooks/usePickVideoFile';
import { ImageData, usePickImage } from 'common/hooks/usePickImage';
import { showErrorToast } from 'common/libs/toast';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { useUploadAmityFile } from 'common/libs/amity/hooks/useUploadAmityFile';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { CameraIcon } from 'components/icons/camera';
import { ImageIcon } from 'components/icons/image';
import { PlayCircle } from 'components/icons/play_circle';
import { TrashIcon } from 'components/icons/trash';

export function CreatePostScreen({
  navigation,
  route,
}: StackScreenProps<'createPost'>) {
  const { targetId, targetType, postId, postText = '', file } = route.params;

  const isCreating = postId === undefined;
  const deletedFiles = useRef<string[]>([]);
  const [touched, setTouched] = useState(false);
  const [crating, setCreating] = useState(false);
  const [text, setText] = useState(postText ?? '');
  const [attachment, setAttachment] = useState<
    undefined | Amity.File<'image' | 'video'>
  >(file);

  const { uploadProgress, upload } = useUploadAmityFile();

  const onUploadVideo = useCallback(async (data: VideoData) => {
    try {
      setTouched(true);

      const result = await upload({
        fileMediaType: 'video',
        fileName: data.filename ?? data.path,
        fileType: data.path.includes('MOV') ? 'video/mov' : 'video/mp4',
        fileUrl: data.path,
      });

      if (result.length > 0) {
        setAttachment(result[0]);
      }
    } catch (err) {
      console.log(err);

      const error = err as Error;
      showErrorToast(error.message);
    }
  }, []);

  const onUploadImage = useCallback(async (data: ImageData) => {
    try {
      setTouched(true);

      const result = await upload({
        fileMediaType: 'image',
        fileName: postId + 'photo',
        fileType: data.mime ?? 'image/jpg',
        fileUrl:
          Platform.OS === 'android'
            ? data.path
            : data.path.replace('file://', ''),
      });

      if (result.length > 0) {
        setAttachment(result[0]);
      }
    } catch (err) {
      console.log(err);

      const error = err as Error;
      showErrorToast(error.message);
    }
  }, []);

  const selectVideo = usePickVideoFile(onUploadVideo);
  const selectImage = usePickImage(onUploadImage);

  const createPost = async () => {
    try {
      setCreating(true);
      const newPost = {
        data: { text },
        attachments: attachment ? [attachment] : [],
        targetType,
        targetId,
      };

      deletedFiles.current.forEach(id => {
        FileRepository.deleteFile(id);
      });

      if (isCreating) {
        await PostRepository.createPost(newPost);
      } else {
        await PostRepository.editPost(postId, newPost);
      }
      navigation.goBack();
    } catch (err) {
      const error = err as Error;
      showErrorToast(error.message);
    } finally {
      setCreating(false);
    }
  };

  const onDeleteMedia = () => {
    if (attachment) {
      setTouched(true);
      deletedFiles.current.push(attachment.fileId);
      setAttachment(undefined);
    }
  };

  const canCreate = touched && (text !== '' || attachment !== null);

  return (
    <SafeAreaView style={styles.contianer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.contianer}>
          <View style={styles.header}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <TouchableOpacity onPress={navigation.goBack}>
                <ArrowLeftIcon />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 2, alignItems: 'center' }}>
              <Text style={styles.headerTitleText}>
                {isCreating ? 'Add' : 'Edit'} Post
              </Text>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              {crating ? (
                <ActivityIndicator size={'small'} />
              ) : (
                <Text
                  style={[styles.headerRight, { opacity: canCreate ? 1 : 0.6 }]}
                  disabled={!canCreate}
                  onPress={createPost}>
                  Post
                </Text>
              )}
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 70 }}
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            style={styles.scroll}>
            <TextInput
              style={{ marginBottom: 12 }}
              value={text}
              onChangeText={val => {
                setText(val);
                setTouched(true);
              }}
              placeholder="What’s going on..."
              multiline
              autoFocus
            />

            <MediaContainer
              fileUploadProgress={uploadProgress}
              attachment={attachment}
              onDeleteMedia={onDeleteMedia}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerItem}
              onPress={() => selectImage('camera')}>
              <CameraIcon />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerItem}
              onPress={() => selectImage('gallery')}>
              <ImageIcon />
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerItem} onPress={selectVideo}>
              <PlayCircle />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface MediaContainerProps {
  fileUploadProgress: number;
  attachment?: Amity.File<'image' | 'video'>;
  onDeleteMedia: () => void;
}
const MediaContainer = ({
  fileUploadProgress,
  onDeleteMedia,
  attachment,
}: MediaContainerProps) => {
  if (fileUploadProgress > 0 && fileUploadProgress < 99) {
    return (
      <View style={styles.uploadOverlay}>
        <ActivityIndicator />
        <Text style={{ fontSize: 25, color: theming.colors.textPrimary }}>
          {12}
        </Text>
        <Text style={{ fontSize: 25, color: theming.colors.textPrimary }}>
          {fileUploadProgress}
        </Text>
      </View>
    );
  }

  if (attachment) {
    return (
      <View style={styles.mediaContent}>
        <Pressable
          onPress={onDeleteMedia}
          style={{
            position: 'absolute',
            right: 15,
            top: 10,
            zIndex: 1,
            padding: 5,
            backgroundColor: '#fff',
            borderRadius: 50,
          }}>
          <TrashIcon />
        </Pressable>
        {attachment.type == 'image' ? (
          <ScalableImage
            originalWidth={SCREEN_WIDTH - 32}
            uri={attachment.fileUrl + '?size=medium'}
          />
        ) : (
          <VideoView videoUrl={attachment.fileUrl} width={SCREEN_WIDTH - 32} />
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  uploadOverlay: {
    width: WINDOW_WIDTH - 32,
    height: WINDOW_WIDTH - 32,
    backgroundColor: theming.colors.baseShade,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    flexDirection: 'column',
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
    color: theming.colors.textHighlighted,
    letterSpacing: -0.2,
  },
  scroll: {
    flex: 1,

    paddingTop: 20,
    paddingHorizontal: 16,
  },
  mediaContent: {
    marginVertical: 12,
    position: 'relative',
  },
  footer: {
    height: 48,
    width: SCREEN_WIDTH,
    backgroundColor: theming.colors.white,
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
    backgroundColor: theming.colors.baseShade,
    marginRight: 45,
  },
});
