import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../utils/colors';
import {Header} from './ui/Header';
import {LoadingView} from '../../components/loadingView';
import {ChannelRepository} from '@amityco/ts-sdk';
import {ChatItem} from './ui/ChatItemAmity';
import useRegistration from '../../hooks/useRegistration';

export function ChatsScreen({navigation}: any) {
  const {currentUser} = useRegistration();
  const [channels, setChannels] = useState<Amity.Channel[]>([]);
  const [loading, setLoading] = useState(true);

  // const [options, setOptions] =
  //   useState<Amity.RunQueryOptions<typeof queryOptions>>();

  // const {nextPage, error} = options ?? {};

  useEffect(() => {
    const queryData: Amity.ChannelLiveCollection = {
      sortBy: 'lastActivity',
      membership: 'member',
      limit: 15,
    };

    const sub = ChannelRepository.getChannels(queryData, data => {
      if (!data.loading) {
        setLoading(false);
        setChannels(data.data);
      }
    });

    return () => {
      sub();
    };
  }, []);

  // if (error) {
  //   return (
  //     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
  //       <Text>{error}</Text>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Header
          title="Messages"
          navigation={navigation}
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
            data={channels}
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              // if ((chats?.length ?? 0) >= 25 && !paginateLoading) {
              //   paginate();
              // }
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
    fontFamily: 'Mulish-Bold',
    fontSize: 20,
    marginLeft: 16,
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center'},
  backIcon: {
    height: 20,
    width: 24,
  },
});
