import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {Button} from '../../components/Button';
import {Input} from '../../components/input';
import CategorySelector from '../../components/catregorySelector';
import {
  dataDanceCategory,
  isAndroid,
  statusBarHeight,
} from '../../utils/constants';
import {launchImageLibrary} from 'react-native-image-picker';
import {useCommunities} from '../../hooks/useCommunitites';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useProfile} from '../../hooks/useProfile';
import FindCity from '../../components/findCity';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';

const CreateCommunity = ({navigation}) => {
  const {t} = useTranslation();
  const {create, isLoading} = useCommunities();
  const goBackBtn = () => {
    // navigation.navigate('CommunitiesMain');
    navigation.goBack();
  };
  const {userCountry, individualStyles} = useProfile();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibleFooter, setVisibleFooter] = useState(true);
  const [isErrorName, setIsErrorName] = useState(false);
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);

  const [loadImg, setLoadImg] = useState(false);

  const [countNameSymbols, setCountNameSymbols] = useState({
    current: name?.length,
    maxSymbols: 100,
  });
  const [countDescSymbols, setCountDescSymbols] = useState({
    current: description?.length,
    maxSymbols: 1000,
  });
  const [addedStyles, setAddedStyles] = useState<string[]>(individualStyles);
  const [images, setImages] = useState(new Array(0).fill(''));
  const [openLocation, setOpenLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(userCountry);

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

  const onPressDeleteImg = (img: any) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const filter = images.filter(item => item !== img);
    setImages(filter);
  };

  useEffect(() => {
    RN.DeviceEventEmitter.addListener('upload_finished', (data: any) => {
      navigation.navigate('TABS', {
        screen: 'Communities',
        params: {
          screen: 'CommunityScreen',
          params: {data},
        },
      });
    });
    // RN.DeviceEventEmitter.addListener('upload_progress', (percent: number) => {
    //   if (percent >= 99) {

    //   }
    // });
  }, []);
  useEffect(() => {
    onClear();
  }, []);
  // city and state required
  const onPressCreate = () => {
    const location =
      selectedLocation?.structured_formatting?.main_text?.length > 0
        ? selectedLocation?.structured_formatting?.main_text +
          ', ' +
          (selectedLocation?.structured_formatting?.main_text?.length > 0
            ? selectedLocation?.terms[1].value
            : '')
        : selectedLocation;
    if (name?.length <= 0) {
      setIsErrorName(true);
    } else if (description?.length <= 0) {
      setIsDescriptionError(true);
    } else if (!addedStyles.length) {
      setCategoriesError(true);
    } else {
      create({
        name: name,
        description: description,
        // country: country,
        location: location,
        categories: addedStyles,
        images: images,
      });
    }
  };

  const onClear = () => {
    setName('');
    setDescription('');
    setImages(new Array(0).fill(''));
    setCountNameSymbols({
      current: 0,
      maxSymbols: 100,
    });
    setCountDescSymbols({
      current: 0,
      maxSymbols: 1000,
    });
  };

  const onChooseImage = async () => {
    setLoadImg(true);
    let options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        setImages([...images, response?.assets[0]]);
      } else {
        console.log('cancel');
        setLoadImg(false);
      }
    });
  };
  useEffect(() => {
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
    setName(value);
    setCountNameSymbols({
      current: value.length,
      maxSymbols: 100,
    });
  };
  const onChangeValueDescription = (value: string) => {
    setDescription(value);
    setCountDescSymbols({
      current: value.length,
      maxSymbols: 1000,
    });
  };
  const renderHeader = () => {
    //
    return (
      <RN.View style={styles.headerWrapper}>
        <RN.TouchableOpacity onPress={goBackBtn}>
          <RN.Image source={{uri: 'backicon'}} style={styles.iconHeader} />
        </RN.TouchableOpacity>
        {/* <RN.TouchableOpacity onPress={goBackBtn}>
          <RN.Image source={{uri: 'close'}} style={styles.iconHeader} />
        </RN.TouchableOpacity> */}
      </RN.View>
    );
  };
  const renderFooter = () => {
    return (
      <RN.View style={styles.footerWrapper}>
        {/* <Button
          title="Clear All"
          disabled
          buttonStyle={styles.clearBtn}
          onPress={onClear}
        /> */}
        <Button
          title={t('create_community')}
          disabled
          buttonStyle={styles.createBtn}
          onPress={onPressCreate}
          isLoading={isLoading}
        />
      </RN.View>
    );
  };
  const renderCreateHeader = () => {
    return (
      <RN.View style={styles.createWrapper}>
        <RN.View
          style={{
            backgroundColor: 'rgba(92, 51, 215, 0.15)',
            borderRadius: 40,
            padding: 10,
          }}>
          <RN.View style={{backgroundColor: colors.purple, borderRadius: 40}}>
            <RN.Image
              style={{
                height: 28,
                width: 28,
                tintColor: colors.white,
                margin: 10,
              }}
              source={{uri: 'comfull'}}
            />
          </RN.View>
        </RN.View>
        <RN.Text style={styles.createTitle}>
          {t('create_community_card_title')}
        </RN.Text>
        <RN.Text style={styles.createDescription}>
          {t('create_community_card_desc')}
        </RN.Text>
      </RN.View>
    );
  };

  const renderNameCommunity = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>{t('create_name')}</RN.Text>
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
          value={name}
          onChange={onChangeValueName}
          placeholder={t('create_name')}
          maxLength={countNameSymbols.maxSymbols}
          isErrorBorder={isErrorName}
          onFocusInput={() => setIsErrorName(false)}
        />
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
        {/* <RN.Text
          style={[
            styles.definition,
            {
              marginBottom: addedStyles?.length > 0 ? 0 : 12,
            },
          ]}>
          Create and share events, discuss them with your group members
        </RN.Text> */}
        {addedStyles?.length > 0 && (
          <RN.View style={styles.danceStyleContainer}>
            {addedStyles?.map(item => {
              return (
                <RN.TouchableOpacity
                  style={[
                    styles.addedDanceStyleItem,
                    {
                      borderColor: addedStyles?.includes(item)
                        ? colors.orange
                        : colors.gray,
                    },
                  ]}
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

  const renderDescription = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>{t('description_title')}</RN.Text>
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
        <RN.Text style={[styles.definition, {paddingBottom: 16}]}>
          {t('description_desc')}
        </RN.Text>
        <Input
          multiLine
          value={description}
          onChange={onChangeValueDescription}
          placeholder={t('description')}
          maxLength={countDescSymbols.maxSymbols}
          isErrorBorder={isDescriptionError}
          onFocusInput={() => setIsDescriptionError(false)}
        />
      </RN.View>
    );
  };
  const renderChooseImage = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>
            {t('upload_img_title')}
            <RN.Text style={styles.countMaxSymbols}> {t('optional')}</RN.Text>
          </RN.Text>
        </RN.View>
        <RN.Text style={[styles.definition, {paddingBottom: 16}]}>
          {t('upload_img_desc')}
        </RN.Text>
        {images?.length > 0 ? (
          <RN.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              // flex: 1,
              paddingHorizontal: 20,
              marginVertical: 12,
            }}>
            {images?.map((img, index) => {
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
                    source={{uri: img?.uri}}
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
                style={{height: 160, width: 160, justifyContent: 'center'}}>
                <RN.ActivityIndicator animating={loadImg} size={'small'} />
              </RN.View>
            )}
            <RN.TouchableOpacity
              style={{
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
              }}
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
                style={{height: 160, width: 160, justifyContent: 'center'}}>
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
  return (
    <>
      {renderHeader()}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        style={{backgroundColor: colors.white}}
        extraScrollHeight={isAndroid ? 0 : 90}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={styles.content}
      >
        <RN.SafeAreaView style={styles.container}>
          <RN.ScrollView>
            {renderCreateHeader()}
            {renderNameCommunity()}
            {renderChooseCategory()}
            {renderDescription()}
            {renderChooseImage()}
            <RN.Text style={styles.placeholderTitle}>{t('location')}</RN.Text>
            <RN.TouchableOpacity
              onPress={() => setOpenLocation(true)}
              style={styles.selectLocationBtn}>
              <RN.Text style={styles.locationText}>
                {selectedLocation?.structured_formatting?.main_text?.length > 0
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
            {/* <RN.View style={{paddingBottom: 40}} /> */}
          </RN.ScrollView>
        </RN.SafeAreaView>
      </KeyboardAwareScrollView>
      {openLocation && (
        <FindCity
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onClosed={() => setOpenLocation(false)}
          setCurrentCountry={() => console.log('setCurrentCountry')}
        />
      )}
      {visibleFooter && renderFooter()}
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.white,
    paddingTop: 24,
  },
  iconHeader: {
    height: 20,
    width: 24,
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
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: statusBarHeight,
    paddingBottom: 12,
    backgroundColor: colors.white,
  },
  createWrapper: {
    backgroundColor: colors.lightPurple,
    marginVertical: 30,
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  createTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
    lineHeight: 24,
    color: '#000000',
    paddingVertical: 8,
  },
  createDescription: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Mulish-Regular',
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  clearBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.purple,
    color: colors.purple,
    paddingHorizontal: 24,
    marginVertical: 14,
    width: '40%',
  },
  createBtn: {
    marginVertical: 14,
    // paddingHorizontal: 24,
  },
  footerWrapper: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    paddingHorizontal: 14,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    backgroundColor: colors.white,
    paddingBottom: isAndroid ? 0 : 8,
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
    paddingBottom: 8,
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
  addedDanceStyleItem: {
    borderWidth: 1,
    // borderColor: colors.orange,
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
export default CreateCommunity;
