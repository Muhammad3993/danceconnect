import React, {useEffect} from 'react';
import * as RN from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import usePeople from '../../hooks/usePeople';
import colors from '../../utils/colors';
import FastImage from 'react-native-fast-image';
import {apiUrl} from '../../api/serverRequests';
import {Button} from '../../components/Button';
import {userRole} from '../../utils/helpers';
import {Chat, useMinChat} from '@minchat/reactnative';

const User = ({route, navigation}) => {
  const {getDifferentUser, differentUser} = usePeople();
  const minchat = useMinChat();

  useEffect(() => {
    getDifferentUser(route.params.id);
  }, []);

  const writeMessage = async () => {
    try {
      const avatar = differentUser?.userImage;
      if (differentUser) {
        let chat: Chat | null | undefined;
        try {
          const otherUser = await minchat?.fetchUser(differentUser.id);

          if (otherUser) {
            if (avatar) {
              await minchat?.updateUserById(otherUser.id, {avatar});
            }
            chat = await minchat?.chat(otherUser?.username);
          }
        } catch (err) {
          const otherUser = await minchat?.createUser({
            name: differentUser.userName,
            username: differentUser.id,
            avatar: avatar,
          });
          if (otherUser?.username) {
            chat = await minchat?.chat(otherUser?.username);
          }
        }

        if (chat) {
          navigation.push('Chat', {chat});
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderHeader = () => {
    return (
      <RN.TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.View>
        {/* <RN.Text style={styles.headerText}>{differentUser.userName}</RN.Text> */}
      </RN.TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <RN.ScrollView>
        <RN.View style={styles.userContainer}>
          <FastImage
            source={{
              uri: `${apiUrl}${differentUser.userImage}`,
              cache: FastImage.cacheControl.immutable,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
            defaultSource={require('../../assets/images/defaultuser.png')}
            style={styles.userImage}
          />
          <RN.View style={{paddingHorizontal: 20, justifyContent: 'center'}}>
            <RN.Text style={styles.userName}>{differentUser?.userName}</RN.Text>
            <RN.View style={{paddingTop: 6, flexDirection: 'row'}}>
              {differentUser?.userRole?.map(
                (tag: {id: number; title: string}, idx: number) => {
                  return (
                    <RN.View style={styles.tagItemRole} key={idx}>
                      <RN.Text
                        style={{color: colors.textPrimary, fontSize: 14}}>
                        {userRole(tag.title)}
                      </RN.Text>
                    </RN.View>
                  );
                },
              )}
            </RN.View>
          </RN.View>
        </RN.View>
        <RN.View style={styles.userDescribeWrapper}>
          <RN.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{paddingBottom: 14}}
            scrollEnabled={differentUser?.individualStyles?.length > 3}>
            {differentUser?.individualStyles?.map(
              (tag: string, idx: number) => {
                return (
                  <RN.View style={styles.tagItem} key={idx}>
                    <RN.Text style={{color: colors.white, fontSize: 12}}>
                      {tag}
                    </RN.Text>
                  </RN.View>
                );
              },
            )}
            <RN.View style={{paddingRight: 44}} />
          </RN.ScrollView>
          <RN.Text style={styles.userDescribeItem}>
            {differentUser.userGender}
          </RN.Text>
          <RN.Text style={styles.userDescribeItem}>
            {differentUser.userCountry}
          </RN.Text>
          <Button
            disabled={true}
            title="Message"
            onPress={writeMessage}
            buttonStyle={styles.btnMessage}
          />
        </RN.View>
      </RN.ScrollView>
    </SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Mulish-Regular',
    paddingLeft: 16,
    fontWeight: '600',
  },
  backIcon: {
    height: 16,
    width: 19,
  },
  userDescribeWrapper: {
    padding: 24,
  },
  btnMessage: {
    marginVertical: 20,
    marginHorizontal: 0,
  },
  tagItem: {
    backgroundColor: colors.purple,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
  },
  tagItemRole: {
    // backgroundColor: colors.orange,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
    marginRight: 4,
    borderWidth: 0.5,
    borderColor: colors.orange,
  },
  userDescribeItem: {
    fontSize: 16,
    lineHeight: 22.4,
    color: colors.gray700,
    fontWeight: '400',
    // paddingVertical: 4,
  },
  userContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  userName: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.textPrimary,
    fontWeight: '700',
    // paddingHorizontal: 20,
  },
});
export default User;
