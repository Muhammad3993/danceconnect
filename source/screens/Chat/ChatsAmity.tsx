import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../utils/colors';
import {Header} from './ui/Header';
import {LoadingView} from '../../components/loadingView';
import {ChannelRepository} from '@amityco/ts-sdk';
import {ChatItem} from './ui/ChatItemAmity';
import useRegistration from '../../hooks/useRegistration';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export function ChatsScreen({navigation}: NativeStackScreenProps<any>) {
  const {currentUser} = useRegistration();
  const [channels, setChannels] = useState<Amity.Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onNextPage = useRef<() => void>();

  // const {nextPage, error} = options ?? {};

  useEffect(() => {
    const queryData: Amity.ChannelLiveCollection = {
      sortBy: 'lastActivity',
      types: ['community', 'conversation'],
      membership: 'member',
      limit: 30,
    };

    const sub = ChannelRepository.getChannels(
      queryData,
      ({data, ...metadata}) => {
        if (!metadata.loading) {
          setLoading(false);

          setChannels(data);
        }
        setLoadingMore(metadata.loading);
        setHasNextPage(metadata.hasNextPage ?? false);

        onNextPage.current = metadata.onNextPage;

        if (metadata.error) {
          setError(metadata.error?.message ?? metadata.error);
        }
      },
    );

    return () => {
      sub();
    };
  }, []);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const filtered = useMemo(() => {
    return channels.filter(el => {
      return Boolean(el?.messagePreview);
    });
  }, [channels]);

  if (error) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Header
          title="Messages"
          onBackPress={goBack}
          rightIcon={
            <TouchableOpacity style={{marginLeft: 'auto'}} onPress={() => {}}>
              <Image
                source={{uri: 'more'}}
                style={{width: 28, height: 28, tintColor: colors.black}}
              />
            </TouchableOpacity>
          }
        />

        {loading ? (
          <LoadingView />
        ) : (
          <FlatList
            style={{padding: 24}}
            showsVerticalScrollIndicator={false}
            data={filtered}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (
                channels.length % 20 === 0 &&
                !loadingMore &&
                hasNextPage &&
                onNextPage.current
              ) {
                onNextPage.current();
              }
            }}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.push('Chat', {channel: item})}>
                  <ChatItem channel={item} currentUser={currentUser} />
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 20,
    marginLeft: 16,
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center'},
  backIcon: {
    height: 20,
    width: 24,
  },
});
