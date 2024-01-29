import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../../utils/colors';
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Button} from '../../../components/Button';
import {Input} from '../../../components/input';
import {FileRepository, PostContentType, PostRepository} from '@amityco/ts-sdk';
import useRegistration from '../../../hooks/useRegistration';
import {useDispatch} from 'react-redux';
import {
  setNoticeMessage,
  setNoticeVisible,
} from '../../../store/actions/appStateActions';

interface Props {
  endCreatingPost: () => void;
}

export function CreatePostModal({endCreatingPost}: Props) {
  const dispatch = useDispatch();
  const {currentUser} = useRegistration();
  const [image, setImage] = useState<Asset | null>(null);
  const [text, setText] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);

  const uploadImage = async () => {
    let options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 1,
    };
    const images = await launchImageLibrary(options);

    if (images.assets) {
      setImage(images.assets[0]);
    }
  };

  const createPost = async () => {
    try {
      setCreatingPost(true);
      const attachments = [];

      if (image !== null) {
        const formData = new FormData();

        const imageUri = image!.uri ?? '';

        formData.append('files', {
          type: image!.type,
          name: image!.fileName,
          uri:
            Platform.OS === 'android'
              ? imageUri
              : imageUri.replace('file://', ''),
        });

        const {data} = await FileRepository.uploadImage(formData);
        // console.log(data);

        attachments.push({type: PostContentType.IMAGE, fileId: data[0].fileId});
      }

      const newPost = {
        tags: ['post'],
        data: {text},
        attachments,
        targetType: 'user',
        targetId: currentUser.id,
      };

      // const {data: post} =
      await PostRepository.createPost(newPost);
      // console.log(post);
      endCreatingPost();
    } catch (err) {
      dispatch(setNoticeMessage({errorMessage: err?.message}));
      dispatch(setNoticeVisible({isVisible: true}));
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={uploadImage} style={styles.imageView}>
        {image == null ? (
          <Text>upload Image</Text>
        ) : (
          <Image
            style={{width: '100%', height: 200}}
            source={{uri: image.uri}}
          />
        )}
      </TouchableOpacity>

      <Input
        onChange={setText}
        value={text}
        placeholder="Post text"
        multiLine
        containerStyle={{marginHorizontal: 0, maxHeight: 200}}
      />

      <Button
        isLoading={creatingPost}
        disabled={image !== null || text.trim() !== ''}
        title="Upload"
        onPress={createPost}
        buttonStyle={{marginHorizontal: 0}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  imageView: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
});
