import React, {useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import usePeople from '../../hooks/usePeople';
import FindCity from '../../components/findCity copy';
import {Portal} from 'react-native-portalize';
import useAppStateHook from '../../hooks/useAppState';
import {SCREEN_WIDTH, isAndroid} from '../../utils/constants';
import Search from '../../components/search';
import {useTranslation} from 'react-i18next';
import colors from '../../utils/colors';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import FiltersBottom from '../../components/bottomFilters';
import FastImage from 'react-native-fast-image';
import {apiUrl} from '../../api/serverRequests';
import {useNavigation} from '@react-navigation/native';
import SkeletonUserCard from '../../components/skeleton/userCard-Skeleton';
import {defaultProfile} from '../../utils/images';
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
      <RN.View style={styles.filterWrapper}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={styles.usersLength}>
            {t('people_found', {count: usersList.length ?? 0})}
          </RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          style={[
            styles.filterBtn,
            {
              borderColor:
                addedStyles?.length > 0 ? colors.orange : colors.gray,
            },
          ]}
          onPress={() => setOpeningFilters(true)}>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: 'filter'}}
              style={{height: 14, width: 14, marginRight: 8}}
            />
          </RN.View>
          <RN.Text style={styles.filterText}>{t('filters')}</RN.Text>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: 'downlight'}}
              style={{height: 14, width: 14, marginLeft: 4, marginTop: 2}}
            />
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const renderHeader = () => {
    return (
      <>
        <RN.View
          style={{
            paddingHorizontal: isAndroid ? 0 : 20,
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
          {renderFilters()}
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
            style={{paddingTop: 2, zIndex: 2}}
            scrollEnabled={item.individualStyles.length > 3}>
            {item.individualStyles?.map((tag: string, idx: number) => {
              return (
                <RN.View style={styles.tagItem} key={idx}>
                  <RN.Text style={{color: colors.white, fontSize: 12}}>
                    {tag}
                  </RN.Text>
                </RN.View>
              );
            })}
            <RN.View style={{paddingRight: 44}} />
          </RN.ScrollView>
          <RN.View style={styles.bottomLine} />
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
    return null;
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
    paddingHorizontal: 12,
    zIndex: 1,
  },
  userContainer: {
    marginHorizontal: 22,
    paddingVertical: 6,
    flexDirection: 'row',
    zIndex: 1,
  },
  userWrapper: {
    marginHorizontal: 16,
    paddingBottom: 6,
  },
  bottomLine: {
    borderBottomColor: colors.darkGray,
    borderBottomWidth: 0.5,
    width: SCREEN_WIDTH - 120,
    paddingTop: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
    color: colors.textPrimary,
  },
  userImage: {
    height: 56,
    width: 56,
    borderRadius: 100,
  },
  userCountry: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18.4,
    color: colors.darkGray,
  },
  tagItem: {
    backgroundColor: colors.purple,
    paddingVertical: 2.5,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginRight: 4,
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
  filterWrapper: {
    paddingVertical: 14,
    paddingTop: 0,
    paddingHorizontal: isAndroid ? 4 : 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -14,
  },
  usersLength: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22.4,
    fontWeight: '600',
  },
  filterBtn: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 100,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    lineHeight: 22.4,
    color: colors.darkGray,
    fontWeight: '500',
  },
});
export default People;
