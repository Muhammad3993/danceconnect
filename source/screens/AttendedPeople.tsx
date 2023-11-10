import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import {statusBarHeight} from '../utils/constants';
import {Input} from '../components/input';
import {apiUrl} from '../api/serverRequests';
import FastImage from 'react-native-fast-image';

const AttendedPeople = () => {
  const navigation = useNavigation();
  const routeProps = useRoute();
  const {usersArray, header}: any = routeProps?.params;
  const [serachValue, setSearchValue] = useState('');
  const [users, setUsers] = useState(usersArray);

  console.log(users);
  const onPressBack = () => navigation.goBack();
  const onSearch = (v: string) => {
    setSearchValue(v);
    const search = usersArray.filter((item: any) => {
      const itemData = `${item.userName?.toLowerCase()}`;
      const textData = v?.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setUsers(search);
    if (!v?.length) {
      setUsers(usersArray);
    }
  };
  const renderHeader = () => {
    return (
      <RN.TouchableOpacity onPress={onPressBack} style={styles.headerContainer}>
        <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        <RN.Text style={styles.backTitle}>{header}</RN.Text>
      </RN.TouchableOpacity>
    );
  };
  return (
    <>
      {renderHeader()}
      <RN.View style={styles.inputContainer}>
        <Input
          value={serachValue.toLowerCase()}
          onChange={onSearch}
          placeholder="User Name"
        />
      </RN.View>
      <RN.ScrollView style={[styles.container, {paddingTop: 14}]}>
        {Object.values(users)?.length > 0 &&
          users.map(i => {
            return (
              <RN.View style={styles.memberContainer} key={i?._id}>
                <RN.View style={{flexDirection: 'row'}}>
                  <RN.View style={styles.memberImgContainer}>
                    {i?.userImage !== null ? (
                      <FastImage
                        source={{
                          uri: apiUrl + i?.userImage,
                          cache: FastImage.cacheControl.immutable,
                          priority: FastImage.priority.high,
                        }}
                        defaultSource={require('../assets/images/defaultuser.png')}
                        style={styles.memberImg}
                      />
                    ) : (
                      <RN.Image
                        source={require('../assets/images/defaultuser.png')}
                        style={styles.memberImg}
                      />
                    )}
                    {/* <FastImage
                      source={{
                        uri: apiUrl + i?.userImage,
                        cache: FastImage.cacheControl.immutable,
                        priority: FastImage.priority.high,
                      }}
                      defaultSource={require('../assets/images/defaultuser.png')}
                      style={styles.memberImg}
                    /> */}
                  </RN.View>
                  <RN.View style={{justifyContent: 'center', paddingLeft: 8}}>
                    <RN.Text style={{color: colors.textPrimary}}>
                      {i?.userName ? i?.userName : 'User Name'}
                    </RN.Text>
                  </RN.View>
                </RN.View>
              </RN.View>
            );
          })}
        <RN.View style={{paddingBottom: 40}} />
      </RN.ScrollView>
    </>
  );
};

const styles = RN.StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
    padding: 14,
    paddingHorizontal: 24,
    paddingTop: statusBarHeight + 14,
    backgroundColor: colors.white,
  },
  backIcon: {
    height: 20,
    width: 24,
  },
  backTitle: {
    fontSize: 22,
    color: colors.textPrimary,
    lineHeight: 24.4,
    fontWeight: '600',
    paddingLeft: 24,
    fontFamily: 'Mulish-Regular',
  },
  inputContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    paddingVertical: 14,
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
  },
  memberImgContainer: {
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  memberImg: {
    height: 34,
    width: 34,
    borderRadius: 100,
  },
  memberImgNone: {
    height: 10,
    width: 10,
    tintColor: colors.textPrimary,
    padding: 16,
  },
});

export default AttendedPeople;
