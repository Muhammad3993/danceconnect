import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import usePeople from '../../hooks/usePeople';
import FindCity from '../../components/findCity copy';
import {Portal} from 'react-native-portalize';
import useAppStateHook from '../../hooks/useAppState';
import {isAndroid} from '../../utils/constants';
import Search from '../../components/search';
import {useTranslation} from 'react-i18next';
import colors from '../../utils/colors';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import FiltersBottom from '../../components/bottomFilters';
import FastImage from 'react-native-fast-image';
import {apiUrl} from '../../api/serverRequests';
import {useNavigation} from '@react-navigation/native';
import {defaultProfile} from '../../utils/images';
import Filters from '../../components/filters';
import SkeletonUserCard from '../../components/skeleton/userCard-Skeleton';
type user = {
  item: {
    userName: string;
    userImage: string | undefined | null;
    userCountry: string;
    id: string;
    individualStyles: string[];
  };
};
const People = () => {
  const {t} = useTranslation();
  const {users, getUsers, isLoadingUsers} = usePeople();
  const {currentCity, onChoosedCity} = useAppStateHook();
  const navigation = useNavigation();

  const lengthEmptyUsers = new Array(10).fill('');
  const [usersList, setUsersList] = useState<user[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [openingFilters, setOpeningFilters] = useState(false);
  const [addedStyles, setAddedStyles] = useState<string[]>([]);
  useEffect(() => {
    getUsers();
  }, [currentCity]);
  useEffect(() => {
    setUsersList(users);
  }, [users, users.length]);

  const onPressUser = (id: string) => navigation.navigate('User', {id: id});
  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);
    if (value?.length === 0) {
      setUsersList(users);
    }
    const searchData = users.filter((user: {userName: string}) => {
      return user.userName?.toLowerCase().includes(value?.toLowerCase());
    });
    setUsersList(searchData);
  };

  const onFilter = () => {
    if (addedStyles?.length > 0) {
      const data = usersList.filter((item: {individualStyles: string[]}) =>
        item?.individualStyles?.some((ai: any) => addedStyles.includes(ai)),
      );
      setUsersList(data);
    } else {
      setUsersList(users);
    }
  };
  const renderFilters = () => {
    return (
      <Filters
        onPressFilters={() => setOpeningFilters(true)}
        title={t('people_found', {count: usersList.length ?? 0})}
        filtersBorderColor={
          addedStyles?.length > 0 ? colors.orange : colors.gray
        }
      />
    );
  };
  const renderHeader = () => {
    return (
      <>
        <RN.View
          style={{
            paddingHorizontal: isAndroid ? 0 : 16,
            marginTop: isAndroid ? 14 : 0,
          }}>
          <RN.TouchableOpacity
            style={styles.userLocationWrapper}
            onPress={() => setOpenModal(true)}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'locate'}}
                style={{height: 16, width: 16}}
              />
            </RN.View>
            <RN.Text style={styles.userLocationText}>{currentCity}</RN.Text>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'downlight'}}
                style={{height: 16, width: 16, marginLeft: 6}}
              />
            </RN.View>
          </RN.TouchableOpacity>
          <Search
            onSearch={onChangeTextSearch}
            searchValue={searchValue}
            placeholder={t('input_search_users')}
            visibleAddBtn={false}
          />
        </RN.View>
      </>
    );
  };
  const renderItem = ({item}: user) => {
    return (
      <TouchableOpacity
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
            scrollEnabled={item.individualStyles.length > 3}>
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
  const renderEmpty = () => {
    if (isLoadingUsers) {
      return (
        <>
          {lengthEmptyUsers.map(() => {
            return <SkeletonUserCard />;
          })}
        </>
      );
    }
  };
  const refreshControl = () => {
    return (
      <RN.RefreshControl
        onRefresh={() => {
          setAddedStyles([]);
          setSearchValue('');
          getUsers();
        }}
        refreshing={isLoadingUsers}
      />
    );
  };
  return (
    <RN.SafeAreaView style={styles.container}>
      {renderHeader()}
      <RN.View style={{marginTop: -16, paddingHorizontal: 6}}>
        {renderFilters()}
      </RN.View>
      <FlatList
        data={usersList}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        refreshControl={refreshControl()}
      />
      {renderEmpty()}
      {openModal && (
        <Portal>
          <FindCity
            selectedLocation={currentCity}
            setSelectedLocation={onChoosedCity}
            isTabScreen
            onClosed={() => setOpenModal(false)}
            setCurrentCountry={() => console.log('setCurrentCountry')}
            communityScreen
          />
        </Portal>
      )}
      <FiltersBottom
        onOpening={openingFilters}
        onClose={() => setOpeningFilters(false)}
        selectedStyles={addedStyles}
        setSelectedStyles={setAddedStyles}
        onClear={() => {
          setAddedStyles([]);
          setUsersList(users);
        }}
        onFilter={onFilter}
      />
    </RN.SafeAreaView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    zIndex: 1,
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
    // paddingVertical: 2.5,
    // paddingHorizontal: 5,
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
export default People;
