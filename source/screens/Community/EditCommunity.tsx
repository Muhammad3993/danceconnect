import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {Input} from '../../components/input';
import {Button} from '../../components/Button';
import {useCommunityById} from '../../hooks/useCommunityById';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import CategorySelector from '../../components/catregorySelector';
import {
  SCREEN_WIDTH,
  dataDanceCategory,
  isAndroid,
  statusBarHeight,
} from '../../utils/constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FindCity from '../../components/findCity';
import {apiUrl} from '../../api/serverRequests';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import ImageCropPicker, {Image} from 'react-native-image-crop-picker';
import useAppStateHook from '../../hooks/useAppState';

interface city {
  structured_formatting: {
    main_text: '';
  };
  terms: [{offset: 0; value: ''}, {offset: 1; value: ''}];
}
const EditCommunity = ({navigation}) => {
  const routeParams = useRoute();
  const {typeCommunity} = useAppStateHook();
  const parseCommunityType = typeCommunity;
  const {t} = useTranslation();
  const {loadingWithChangeInformation, changeInformation} = useCommunityById(
    routeParams?.params?.id,
  );
  const {
    description,
    categories,
    location,
    id,
    images,
    followers,
    type,
    channelId,
  } = routeParams?.params;

  const SCREENS = [
    {idx: 0, title: t('community_type')},
    {idx: 1, title: t('basic_info')},
  ];
  const COMMUNITY_TYPES = [
    {
      idx: 0,
      type: 'free',
      title: t('ct_free.title'),
      description: t('ct_free.description'),
    },
    {
      idx: 1,
      type: 'paid',
      title: t('ct_paid.title'),
      description: t('ct_paid.description'),
    },
  ];
  // const [communityType, setCommunityType] = useState(
  //   COMMUNITY_TYPES.find((ctype: {type: string}) => ctype.type === type),
  // );
  const [currentScreen, setCurrentScreen] = useState(
    parseCommunityType !== 'community' ? 0 : 1,
  );
  const [communityType, setCommunityType] = useState(
    parseCommunityType !== 'community'
      ? COMMUNITY_TYPES[0]
      : COMMUNITY_TYPES[1],
  );

  const community_type = currentScreen === 0;
  const basicInfo = currentScreen === 1;

  const [title, setTitle] = useState(routeParams?.params?.title);
  const [desc, setDesc] = useState(description);
  const [imgs, setImgs] = useState<(Image | string)[]>(images);
  const [openLocation, setOpenLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<city>(location);
  const [loadImg, setLoadImg] = useState(false);

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);

  const [countNameSymbols, setCountNameSymbols] = useState({
    current: title?.length,
    maxSymbols: 100,
  });
  const [countDescSymbols, setCountDescSymbols] = useState({
    current: description?.length,
    maxSymbols: 1000,
  });
  const [addedStyles, setAddedStyles] = useState<string[]>(categories);
  const [visibleFooter, setVisibleFooter] = useState(true);
  const closeBtn = () => {
    navigation.goBack();
  };
  const backBtn = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    if (parseCommunityType === 'community') {
      closeBtn();
    }
    if (currentScreen !== 0) {
      setCurrentScreen(v => v - 1);
    }
  };
  useEffect(() => {
    if (!type) {
      setCommunityType(COMMUNITY_TYPES[0]);
    }
    const subscribeShow = RN.Keyboard.addListener('keyboardDidShow', () =>
      setVisibleFooter(false),
    );
    const subscribeHide = RN.Keyboard.addListener('keyboardDidHide', () =>
      setVisibleFooter(true),
    );
    return () => {
      subscribeShow.remove();
      subscribeHide.remove();
    };
  }, []);

  const onChangeValueName = (value: string) => {
    setTitle(value);
    setCountNameSymbols({
      current: value.length,
      maxSymbols: 100,
    });
  };
  const onPressDeleteImg = (img: any) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const filter = imgs.filter(item => item !== img);
    setImgs(filter);
  };
  const onChoosheDanceStyle = (value: string) => {
    setCategoriesError(false);
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const isAvailable = addedStyles?.includes(value);
    if (isAvailable) {
      onPressDeleteItem(value);
    } else {
      setAddedStyles([...addedStyles, value]);
    }
  };
  const onPressDeleteItem = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const filter = addedStyles.filter(item => item !== value);
    setAddedStyles(filter);
  };

  const onChooseImage = async () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      width: 375,
      height: 480,
      cropping: true,
      includeBase64: true,
      compressImageQuality: 1,
    })
      .then(res => {
        setImgs([...imgs, res]);
      })
      .catch(() => {
        console.log('cancel');
        setLoadImg(false);
      });
  };
  const onChangeValueDescription = (value: string) => {
    setDesc(value);
    setCountDescSymbols({
      current: value.length,
      maxSymbols: 1000,
    });
  };
  const onPressCommuntyType = (type: {
    idx: number;
    type: string;
    title: string;
    description: string;
  }) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setCommunityType(type);
  };
  const onPressNextBtn = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    if (parseCommunityType === 'community') {
      const locationEdt =
        selectedLocation?.structured_formatting?.main_text?.length > 0
          ? selectedLocation?.structured_formatting?.main_text +
            ', ' +
            (selectedLocation?.structured_formatting?.main_text?.length > 0
              ? selectedLocation?.terms[1].value
              : '')
          : selectedLocation;
      if (title?.length <= 0) {
        setTitleError(true);
      } else if (desc?.length <= 0) {
        setDescriptionError(true);
      } else if (!addedStyles.length) {
        setCategoriesError(true);
      } else {
        changeInformation({
          name: title,
          description: desc,
          channelId,
          // country: countryEdit,
          location: locationEdt,
          categories: addedStyles,
          followers: followers?.map(user => {
            return {
              ...user,
              userUid: user?.id,
            };
          }),
          images: imgs.map(el =>
            typeof el === 'object'
              ? {
                  base64: el?.data,
                  uri: el.path,
                }
              : el,
          ) as (Asset | string)[],
          type: communityType.type,
        });
      }
    } else {
      switch (currentScreen) {
        case 0:
          setCurrentScreen(v => v + 1);
          break;
        case 1:
          const locationEdt =
            selectedLocation?.structured_formatting?.main_text?.length > 0
              ? selectedLocation?.structured_formatting?.main_text +
                ', ' +
                (selectedLocation?.structured_formatting?.main_text?.length > 0
                  ? selectedLocation?.terms[1].value
                  : '')
              : selectedLocation;
          if (title?.length <= 0) {
            setTitleError(true);
          } else if (desc?.length <= 0) {
            setDescriptionError(true);
          } else if (!addedStyles.length) {
            setCategoriesError(true);
          } else {
            changeInformation({
              name: title,
              description: desc,
              channelId,
              // country: countryEdit,
              location: locationEdt,
              categories: addedStyles,
              followers: followers?.map(user => {
                return {
                  ...user,
                  userUid: user?.id,
                };
              }),
              images: imgs.map(el =>
                typeof el === 'object'
                  ? {
                      base64: el?.data,
                      uri: el.path,
                    }
                  : el,
              ) as (Asset | string)[],
              type: communityType.type,
            });
          }
        default:
          break;
      }
    }
  };

  const renderTabs = () => {
    return (
      <RN.View style={styles.screensContainer}>
        {SCREENS.map((val: {idx: number; title: string}) => {
          return (
            <RN.View key={val.idx}>
              <RN.View
                style={[
                  styles.lineScreen,
                  {
                    backgroundColor:
                      currentScreen === val.idx
                        ? colors.purple
                        : currentScreen > val.idx
                        ? colors.green
                        : colors.gray,
                  },
                ]}
              />
              <RN.Text
                style={[
                  styles.screenName,
                  {
                    fontWeight: currentScreen === val.idx ? '700' : '400',
                  },
                ]}>
                {val.title}
              </RN.Text>
            </RN.View>
          );
        })}
      </RN.View>
    );
  };
  const renderHeader = () => {
    return (
      <>
        <RN.View
          style={[
            styles.headerContainer,
            {
              marginVertical: parseCommunityType !== 'community' ? 4 : 14,
            },
          ]}>
          <RN.TouchableOpacity
            onPress={backBtn}
            style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: 'backicon'}}
              style={[
                styles.backIcon,
                {
                  tintColor:
                    currentScreen !== 0 ? colors.textPrimary : colors.white,
                },
              ]}
            />
          </RN.TouchableOpacity>
          <RN.Text style={styles.headerTitle}>
            {t('change_community_title')}
          </RN.Text>
          <RN.TouchableOpacity
            onPress={closeBtn}
            style={{justifyContent: 'center'}}>
            <RN.Image source={{uri: 'close'}} style={styles.closeIcon} />
          </RN.TouchableOpacity>
        </RN.View>
        {parseCommunityType !== 'community' && renderTabs()}
      </>
    );
  };
  const renderTypeCommunity = () => {
    return (
      <RN.View style={{paddingTop: 30}}>
        {COMMUNITY_TYPES.map(
          (type: {
            idx: number;
            type: string;
            title: string;
            description: string;
          }) => {
            return (
              <RN.TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onPressCommuntyType(type)}
                key={type.idx}
                style={
                  communityType && communityType?.idx === type.idx
                    ? styles.communityTypeActive
                    : styles.communityTypeInActive
                }>
                <RN.View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <RN.View style={{justifyContent: 'center'}}>
                    <RN.Text style={styles.communityTypeTitle}>
                      {type.title}
                    </RN.Text>
                  </RN.View>
                  <RN.Image
                    source={{
                      uri:
                        communityType && communityType.idx === type.idx
                          ? 'checkactive'
                          : 'checkinactive',
                    }}
                    style={{height: 20, width: 20}}
                  />
                </RN.View>
                <RN.Text style={styles.communityTypeDescription}>
                  {type.description}
                </RN.Text>
              </RN.TouchableOpacity>
            );
          },
        )}
      </RN.View>
    );
  };
  const renderFooter = () => {
    return (
      <RN.View style={styles.footerWrapper}>
        <Button
          title={
            parseCommunityType === 'community'
              ? t('save_changes')
              : currentScreen === 0
              ? t('next')
              : t('save_changes')
          }
          disabled
          buttonStyle={styles.createBtn}
          isLoading={loadingWithChangeInformation}
          onPress={() => {
            if (parseCommunityType === 'community') {
              setVisibleFooter(false);
            }
            onPressNextBtn();
          }}
        />
      </RN.View>
    );
  };
  const renderNameCommunity = () => {
    return (
      <>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>{t('change_name')}</RN.Text>
          <RN.Text style={styles.countMaxSymbols}>
            <RN.Text
              style={[
                styles.countCurrentSymbols,
                {
                  color:
                    countNameSymbols.current > 0
                      ? colors.textPrimary
                      : colors.darkGray,
                },
              ]}>
              {countNameSymbols.current}
            </RN.Text>
            {'/' + countNameSymbols.maxSymbols}
          </RN.Text>
        </RN.View>
        <Input
          value={title}
          onChange={onChangeValueName}
          placeholder={t('create_name')}
          maxLength={countNameSymbols.maxSymbols}
          isErrorBorder={titleError}
          onFocusInput={() => setTitleError(false)}
        />
      </>
    );
  };
  const renderDescription = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>{t('change_description')}</RN.Text>
          <RN.Text style={styles.countMaxSymbols}>
            <RN.Text
              style={[
                styles.countCurrentSymbols,
                {
                  color:
                    countDescSymbols.current > 0
                      ? colors.textPrimary
                      : colors.darkGray,
                },
              ]}>
              {countDescSymbols.current}
            </RN.Text>
            {'/' + countDescSymbols.maxSymbols}
          </RN.Text>
        </RN.View>
        <Input
          multiLine
          value={desc}
          onChange={onChangeValueDescription}
          placeholder={t('description')}
          maxLength={countDescSymbols.maxSymbols}
          isErrorBorder={descriptionError}
          onFocusInput={() => setDescriptionError(false)}
        />
      </RN.View>
    );
  };
  const renderChooseImage = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>{t('upload_img_title')}</RN.Text>
        </RN.View>
        {imgs?.length > 0 ? (
          <RN.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              // flex: 1,
              paddingHorizontal: 20,
              marginVertical: 12,
            }}>
            {imgs?.map((img, index) => {
              return (
                <>
                  <FastImage
                    key={index}
                    style={{
                      height: 160,
                      width: 160,
                      marginRight: 8,
                      borderRadius: 8,
                    }}
                    onLoadStart={() => setLoadImg(true)}
                    onLoadEnd={() => setLoadImg(false)}
                    source={{
                      uri: typeof img === 'object' ? img?.path : apiUrl + img,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <RN.TouchableOpacity
                    onPress={() => onPressDeleteImg(img)}
                    style={styles.basketContainer}>
                    <RN.Image
                      source={{uri: 'basket'}}
                      style={{height: 28, width: 28, tintColor: colors.white}}
                    />
                  </RN.TouchableOpacity>
                </>
              );
            })}
            {loadImg && (
              <RN.View
                style={{
                  height: 160,
                  width: 160,
                  justifyContent: 'center',
                }}>
                <RN.ActivityIndicator animating={loadImg} size={'small'} />
              </RN.View>
            )}
            <RN.TouchableOpacity
              style={styles.uploadPictureBtn}
              onPress={onChooseImage}>
              <RN.Image style={styles.uploadImg} source={{uri: 'upload'}} />
              <RN.Text style={styles.uploadImgText}>
                {t('upload_img_small')}
              </RN.Text>
            </RN.TouchableOpacity>
          </RN.ScrollView>
        ) : (
          <>
            {loadImg && (
              <RN.View
                style={{
                  height: 160,
                  width: 160,
                  justifyContent: 'center',
                }}>
                <RN.ActivityIndicator animating={loadImg} size={'small'} />
              </RN.View>
            )}
            <RN.TouchableOpacity
              style={styles.uploadImgContainer}
              onPress={onChooseImage}>
              <RN.Image style={styles.uploadImg} source={{uri: 'upload'}} />
              <RN.Text style={styles.uploadImgText}>
                {t('upload_img_small')}
              </RN.Text>
            </RN.TouchableOpacity>
          </>
        )}
      </RN.View>
    );
  };
  const renderChooseCategory = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text
            style={[
              styles.title,
              {
                color: categoriesError ? colors.redError : colors.textPrimary,
              },
            ]}>
            {t('choose_category_title')}
            <RN.Text style={styles.countMaxSymbols}> {t('few')}</RN.Text>
          </RN.Text>
        </RN.View>
        {addedStyles?.length > 0 && (
          <RN.View style={styles.danceStyleContainer}>
            {addedStyles?.map(item => {
              return (
                <RN.TouchableOpacity
                  style={styles.addedDanceStyleItem}
                  activeOpacity={0.7}
                  onPress={() => onPressDeleteItem(item)}>
                  <RN.Text style={styles.addedDanceStyleText}>{item}</RN.Text>
                  <RN.View style={{justifyContent: 'center', marginTop: 2}}>
                    <RN.Image
                      style={{height: 14, width: 14, tintColor: colors.orange}}
                      source={{uri: 'close'}}
                    />
                  </RN.View>
                </RN.TouchableOpacity>
              );
            })}
          </RN.View>
        )}
        <CategorySelector
          data={dataDanceCategory}
          onChoosheDanceStyle={onChoosheDanceStyle}
          addedStyles={addedStyles}
        />
      </RN.View>
    );
  };
  return (
    <>
      <RN.SafeAreaView style={styles.container}>
        {renderHeader()}
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={isAndroid ? 0 : 90}
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: colors.white}}
          // contentContainerStyle={styles.content}
        >
          {basicInfo && (
            <RN.ScrollView>
              {renderNameCommunity()}
              {renderDescription()}
              {renderChooseCategory()}
              {renderChooseImage()}
              <RN.Text style={styles.placeholderTitle}>{t('location')}</RN.Text>
              <RN.TouchableOpacity
                onPress={() => setOpenLocation(true)}
                style={styles.selectLocationBtn}>
                <RN.Text style={styles.locationText}>
                  {selectedLocation?.structured_formatting?.main_text?.length >
                  0
                    ? `${
                        selectedLocation?.structured_formatting?.main_text +
                        ', ' +
                        selectedLocation?.terms[1]?.value
                      }`
                    : selectedLocation}
                </RN.Text>

                <RN.View
                  style={{
                    justifyContent: 'center',
                  }}>
                  <RN.Image
                    source={{uri: 'arrowdown'}}
                    style={{height: 20, width: 20}}
                  />
                </RN.View>
              </RN.TouchableOpacity>
            </RN.ScrollView>
          )}
          {parseCommunityType !== 'community' &&
            community_type &&
            renderTypeCommunity()}
        </KeyboardAwareScrollView>
        {openLocation && (
          <FindCity
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onClosed={() => setOpenLocation(false)}
            setCurrentCountry={() => console.log('setCurrentCountry')}
          />
        )}
      </RN.SafeAreaView>
      {visibleFooter && renderFooter()}
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  selectLocationBtn: {
    marginHorizontal: 20,
    marginVertical: 14,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.grayTransparent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  locationText: {
    paddingVertical: 16,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    paddingHorizontal: 24,
    color: colors.textPrimary,
  },
  iconHeader: {
    height: 18,
    width: 24,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: statusBarHeight,
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: colors.white,
  },
  uploadPictureBtn: {
    alignSelf: 'center',
    height: 80,
    width: 160,
    borderWidth: 1,
    borderColor: colors.purple,
    borderStyle: 'dotted',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 40,
  },
  title: {
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  nameTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  countMaxSymbols: {
    fontSize: 14,
    lineHeight: 19.6,
    fontWeight: '400',
    color: colors.darkGray,
  },
  countCurrentSymbols: {
    fontSize: 14,
    lineHeight: 19.6,
    fontWeight: '400',
  },
  definition: {
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '400',
    color: colors.darkGray,
    paddingHorizontal: 20,
  },
  createBtn: {
    marginVertical: 14,
  },
  backIcon: {
    height: 20,
    width: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginVertical: 4,
    paddingTop: RN.Platform.OS === 'android' ? 15 : 0,
  },
  headerTitle: {
    fontSize: SCREEN_WIDTH <= 375 ? 18 : 20,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'Lato-Regular',
  },
  closeIcon: {
    height: 20,
    width: 20,
  },
  screensContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 14,
    marginTop: 32,
    marginBottom: 6,
  },
  screenName: {
    fontSize: 12,
    lineHeight: 16.8,
    fontWeight: '400',
    marginTop: 4,
    textAlign: 'left',
  },
  lineScreen: {
    height: 4,
    marginRight: 26,
    minWidth: SCREEN_WIDTH / 2.5,
    maxWidth: SCREEN_WIDTH / 2.6,
    borderRadius: 100,
  },
  communityTypeActive: {
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.purple,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 12,
  },
  communityTypeInActive: {
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 12,
  },
  communityTypeTitle: {
    fontSize: 16,
    lineHeight: 21.6,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingRight: 18,
  },
  communityTypeDescription: {
    fontSize: 14,
    lineHeight: 22.4,
    fontWeight: '400',
    color: colors.darkGray,
    letterSpacing: 0.2,
    maxWidth: SCREEN_WIDTH - 100,
    paddingTop: 6,
  },
  footerWrapper: {
    paddingHorizontal: 14,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    backgroundColor: colors.lightGray,
    paddingBottom: isAndroid ? 0 : 8,
  },
  addedDanceStyleItem: {
    borderWidth: 1,
    borderColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    marginRight: 4,
    marginBottom: 8,
  },
  addedDanceStyleText: {
    color: colors.orange,
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 19.6,
    marginRight: 6,
    fontWeight: '600',
  },
  danceStyleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingTop: 4,
  },
  uploadImgContainer: {
    borderWidth: 1,
    borderColor: colors.purple,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 8,
    borderStyle: 'dashed',
    marginBottom: 32,
  },
  uploadImg: {
    height: 20,
    width: 20,
    marginRight: 14,
  },
  uploadImgText: {
    color: colors.purple,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  basketContainer: {
    position: 'relative',
    top: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginRight: -30,
    right: 60,
    padding: 8,
    maxHeight: 45,
    borderRadius: 40,
  },
});
export default EditCommunity;
