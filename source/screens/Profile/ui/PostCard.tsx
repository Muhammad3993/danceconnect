import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {FileRepository, PostRepository} from '@amityco/ts-sdk';
import FastImage from 'react-native-fast-image';

interface Props {
  post: Amity.Post<'image'>;
}

const getPostImageInfo = async (postChildrenId: string) => {
  const postChildren = await new Promise<Amity.Post<'image'>>(resolve => {
    const unsub = PostRepository.getPost(postChildrenId, ({data, loading}) => {
      if (!loading) {
        resolve(data as Amity.Post<'image'>);
      }

      unsub();
    });
  });

  return postChildren;
};

const getPostFile = async <T extends Amity.FileType>(fileId?: string) => {
  if (!fileId) {
    return null;
  }
  const {data: file} = await FileRepository.getFile(fileId);

  return file as Amity.File<T>;
};

export function PostCard({post}: Props) {
  const [postImageUrl, setPostImageUrl] = useState<string | undefined>(
    undefined,
  );
  const [postChildren, setPostChildren] = useState<Amity.Post<'image'>>();

  const getData = useCallback(async () => {
    const postCh = await getPostImageInfo(post.children[0]);
    const postImage = await getPostFile<'image'>(postCh.data?.fileId);

    setPostChildren(postChildren);
    setPostImageUrl(postImage?.fileUrl);
  }, [post]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <View style={{width: 100, height: 200}}>
      {postImageUrl && (
        <FastImage
          style={{width: 100, height: 100}}
          source={{uri: postImageUrl}}
        />
      )}
      <Text>{post.data.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
