import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {Input} from '../../components/input';
import {Button} from '../../components/Button';
import {useCommunityById} from '../../hooks/useCommunityById';
import {launchImageLibrary} from 'react-native-image-picker';
import CategorySelector from '../../components/catregorySelector';
import {
  dataDanceCategory,
  isAndroid,
  statusBarHeight,
} from '../../utils/constants';
import {useCommunities} from '../../hooks/useCommunitites';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FindCity from '../../components/findCity';

interface city {
  structured_formatting: {
    main_text: '';
  };
  terms: [{offset: 0; value: ''}, {offset: 1; value: ''}];
}
const EditCommunity = () => {
  const routeParams = useRoute();
  const navigation = useNavigation();
  const {loadingWithChangeInformation, changeInformation} = useCommunityById(
    routeParams?.params?.id,
  );
  const {name, description, categories, location, id, images, followers} =
    routeParams?.params;
  const {isSaveChanges} = useCommunities();
  // console.log('route', images);
  const [title, setTitle] = useState(name);
  const [desc, setDesc] = useState(description);
  const [imgs, setImgs] = useState(images);
  const [openLocation, setOpenLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<city>(location);

  const [countNameSymbols, setCountNameSymbols] = useState({
    current: name?.length,
    maxSymbols: 100,
  });
  const [countDescSymbols, setCountDescSymbols] = useState({
    current: description?.length,
    maxSymbols: 350,
  });
  const [addedStyles, setAddedStyles] = useState<string[]>(categories);
  const [visibleFooter, setVisibleFooter] = useState(true);
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
  useEffect(() => {
    if (isSaveChanges) {
      goBack();
    }
  }, [isSaveChanges]);
  const goBack = () => navigation.goBack();
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
    let options = {
      mediaType: 'image',
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        if (imgs?.length > 0) {
          setImgs([...imgs, response?.assets[0]]);
        } else {
          setImgs([response?.assets[0]]);
        }
      } else {
        console.log('cancel');
      }
    });
  };
  const onChangeValueDescription = (value: string) => {
    setDesc(value);
    setCountDescSymbols({
      current: value.length,
      maxSymbols: 350,
    });
  };

  const onPressSaveChanges = () => {
    const locationEdt =
      selectedLocation?.structured_formatting?.main_text?.length > 0
        ? selectedLocation?.structured_formatting?.main_text +
          ', ' +
          (selectedLocation?.structured_formatting?.main_text?.length > 0
            ? selectedLocation?.terms[1].value
            : '')
        : selectedLocation;
    changeInformation({
      name: title,
      description: desc,
      // country: countryEdit,
      location: locationEdt,
      categories: addedStyles,
      followers: followers,
      images: imgs,
    });
    // goBack();
  };

  const renderHeader = () => {
    return (
      <RN.View style={styles.headerWrapper}>
        <RN.TouchableOpacity onPress={goBack}>
          <RN.Image source={{uri: 'backicon'}} style={styles.iconHeader} />
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const renderFooter = () => {
    return (
      <RN.View style={styles.footerWrapper}>
        <Button
          title="Save changes"
          disabled
          buttonStyle={styles.createBtn}
          onPress={onPressSaveChanges}
          isLoading={loadingWithChangeInformation}
        />
      </RN.View>
    );
  };
  const renderNameCommunity = () => {
    return (
      <>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Change name</RN.Text>
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
          placeholder="Name"
          maxLength={countNameSymbols.maxSymbols}
        />
      </>
    );
  };
  const renderDescription = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Change Description</RN.Text>
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
          placeholder="Description"
          maxLength={countDescSymbols.maxSymbols}
        />
      </RN.View>
    );
  };
  const renderChooseImage = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Upload Cover Image</RN.Text>
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
                  <RN.Image
                    key={index}
                    style={{height: 160, width: 160, marginRight: 8}}
                    source={{uri: 'data:image/png;base64,' + img?.base64}}
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
            <RN.TouchableOpacity
              style={styles.uploadPictureBtn}
              onPress={onChooseImage}>
              <RN.Image style={styles.uploadImg} source={{uri: 'upload'}} />
              <RN.Text style={styles.uploadImgText}>Upload picture</RN.Text>
            </RN.TouchableOpacity>
          </RN.ScrollView>
        ) : (
          <RN.TouchableOpacity
            style={styles.uploadImgContainer}
            onPress={onChooseImage}>
            <RN.Image style={styles.uploadImg} source={{uri: 'upload'}} />
            <RN.Text style={styles.uploadImgText}>Upload picture</RN.Text>
          </RN.TouchableOpacity>
        )}
      </RN.View>
    );
  };
  const renderChooseCategory = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>
            Choose Category
            <RN.Text style={styles.countMaxSymbols}> can select few</RN.Text>
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
      {renderHeader()}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={isAndroid ? 0 : 90}
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: colors.white}}
        // contentContainerStyle={styles.content}
      >
        <RN.SafeAreaView style={styles.container}>
          <RN.ScrollView>
            {renderNameCommunity()}
            {renderDescription()}
            {renderChooseCategory()}
            {renderChooseImage()}
            <RN.Text style={styles.placeholderTitle}>City</RN.Text>
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
                  : location}
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
        </RN.SafeAreaView>
      </KeyboardAwareScrollView>
      {openLocation && (
        <FindCity
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onClosed={() => setOpenLocation(false)}
        />
      )}
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
  footerWrapper: {
    paddingHorizontal: 14,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    backgroundColor: colors.lightGray,
    paddingBottom: 8,
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
