import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import {statusBarHeight} from '../utils/constants';
import {Input} from '../components/input';
import {apiUrl} from '../api/serverRequests';
import FastImage from 'react-native-fast-image';
import {defaultProfile} from '../utils/images';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
type user = {
  item: {
    userName: string;
    userImage: string | undefined | null;
    userCountry: string;
    id: string;
    individualStyles: string[];
  };
};
const AttendedPeople = () => {
  const navigation = useNavigation();
  const routeProps = useRoute();
  const {usersArray, header}: any = routeProps?.params;
  const [serachValue, setSearchValue] = useState('');
  const [users, setUsers] = useState(usersArray);

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
  const onPressUser = (id: string) => navigation.navigate('User', {id: id});

  const renderHeader = () => {
    return (
      <RN.TouchableOpacity onPress={onPressBack} style={styles.headerContainer}>
        <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        <RN.Text style={styles.backTitle}>{header}</RN.Text>
      </RN.TouchableOpacity>
    );
  };
  const renderItem = ({item}: user) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.userContainer}
        onPress={() => onPressUser(item.id)}
        activeOpacity={0.7}>
        <FastImage
          source={{
            uri: `${apiUrl}${item.userImage}`,
            cache: FastImage.cacheControl.immutable,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
          defaultSource={defaultProfile}
          style={styles.userImage}
        />
        <RN.View style={styles.userWrapper}>
          <RN.Text style={styles.userName}>{item.userName}</RN.Text>
          <RN.Text style={styles.userCountry}>{item.userCountry}</RN.Text>
          <RN.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{paddingTop: 8, zIndex: 2}}
            scrollEnabled={item.individualStyles?.length > 3}>
            {item.individualStyles?.map((tag: string, idx: number) => {
              return (
                <RN.View style={styles.tagItem} key={idx}>
                  <RN.Text style={styles.tagItemText}>{tag}</RN.Text>
                </RN.View>
              );
            })}
            <RN.View style={{paddingRight: 44}} />
          </RN.ScrollView>
        </RN.View>
      </TouchableOpacity>
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
      <FlatList
        data={Object.values(users)}
        renderItem={renderItem}
        style={styles.container}
        // ListEmptyComponent={renderEmpty}
        // refreshControl={refreshControl()}
      />
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
    paddingTop: 16,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  userContainer: {
    marginHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    zIndex: 1,
  },
  userWrapper: {
    marginHorizontal: 12,
    paddingBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  userImage: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  userCountry: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 19.6,
    letterSpacing: 0.2,
    color: colors.darkGray,
  },
  tagItemText: {
    fontSize: 12,
    lineHeight: 14.4,
    color: colors.purple,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  tagItem: {
    borderRadius: 4,
    marginRight: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(224, 224, 224, 1)',
  },
  userLocationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    backgroundColor: '#FBFBFB',
    padding: 8,
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#CDCDCD',
  },
  userLocationText: {
    paddingLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default AttendedPeople;
