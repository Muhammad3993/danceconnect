import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {Button} from '../../components/Button';
import {Input} from '../../components/input';
import CategorySelector from '../../components/catregorySelector';
import {dataDanceCategory, locationData} from '../../utils/constants';
import {launchImageLibrary} from 'react-native-image-picker';
import {useCommunities} from '../../hooks/useCommunitites';
import LocationSelection from '../../components/locationSelection';

const CreateCommunity = () => {
  const navigation = useNavigation();
  const {create, isLoading} = useCommunities();
  const goBackBtn = () => {
    navigation.navigate('CommunitiesMain');
  };
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibleFooter, setVisibleFooter] = useState(true);
  const [isErrorName, setIsErrorName] = useState(false);
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [country, selectedCountry] = useState('');
  const [city, selectedCity] = useState('');
  const [countNameSymbols, setCountNameSymbols] = useState({
    current: name?.length,
    maxSymbols: 100,
  });
  const [countDescSymbols, setCountDescSymbols] = useState({
    current: description?.length,
    maxSymbols: 350,
  });
  const [addedStyles, setAddedStyles] = useState<string[]>(
    new Array(0).fill(''),
  );
  const [images, setImages] = useState(new Array(0).fill(''));
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

  const onPressDeleteImg = (img: any) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const filter = images.filter(item => item !== img);
    setImages(filter);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDescriptionError(false);
      setIsErrorName(false);
    }, 3000);
    return clearTimeout(timer);
  }, [isErrorName, isDescriptionError]);

  const onPressCreate = () => {
    if (name?.length <= 0) {
      setIsErrorName(true);
    } else if (description?.length <= 0) {
      setIsDescriptionError(true);
    } else {
      create({
        name: name,
        description: description,
        country: country,
        location: city,
        categories: addedStyles,
        images: images,
      });
      setTimeout(() => {
        onClear();
      }, 2000);
    }
  };

  const onClear = () => {
    setName('');
    setDescription('');
    setImages(new Array(0).fill(''));
    setAddedStyles(new Array(0).fill(''));
    setCountNameSymbols({
      current: 0,
      maxSymbols: 100,
    });
    setCountDescSymbols({
      current: 0,
      maxSymbols: 350,
    });
  };

  const onChooseImage = async () => {
    let options = {
      mediaType: 'image',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        setImages([...images, response?.assets[0]]);
      } else {
        console.log('cancel');
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
      maxSymbols: 350,
    });
  };
  const renderHeader = () => {
    return (
      <RN.View style={styles.headerWrapper}>
        <RN.TouchableOpacity onPress={goBackBtn}>
          <RN.Image source={{uri: 'backicon'}} style={styles.iconHeader} />
        </RN.TouchableOpacity>
        <RN.TouchableOpacity onPress={goBackBtn}>
          <RN.Image source={{uri: 'close'}} style={{height: 28, width: 28}} />
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const renderFooter = () => {
    return (
      <RN.View style={styles.footerWrapper}>
        <Button
          title="Clear All"
          disabled
          buttonStyle={styles.clearBtn}
          onPress={onClear}
        />
        <Button
          title="Create Community"
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
        <RN.Text style={styles.createTitle}>Create Your Community</RN.Text>
        <RN.Text style={styles.createDescription}>
          Create and share events, discuss them with your group members
        </RN.Text>
      </RN.View>
    );
  };

  const renderNameCommunity = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Create Name</RN.Text>
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
          placeholder="Name"
          maxLength={countNameSymbols.maxSymbols}
          isErrorBorder={isErrorName}
        />
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
        <RN.Text style={styles.definition}>
          Create and share events, discuss them with your group members
        </RN.Text>
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
  const renderDescription = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Add Description</RN.Text>
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
          Describe your community and add the necessary contact information
        </RN.Text>
        <Input
          multiLine
          value={description}
          onChange={onChangeValueDescription}
          placeholder="Description"
          maxLength={countDescSymbols.maxSymbols}
          isErrorBorder={isDescriptionError}
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
        <RN.Text style={[styles.definition, {paddingBottom: 16}]}>
          What picture is better to put here?
        </RN.Text>
        {images?.length > 0 ? (
          <RN.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              flex: 1,
              paddingHorizontal: 20,
              marginVertical: 12,
            }}>
            {images?.map((img, index) => {
              return (
                <>
                  <RN.Image
                    key={index}
                    style={{height: 160, width: 160, marginRight: 8}}
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
  return (
    <RN.KeyboardAvoidingView behavior="padding" style={styles.container}>
      <RN.SafeAreaView style={styles.container}>
        {renderHeader()}
        <RN.ScrollView>
          {renderCreateHeader()}
          {renderNameCommunity()}
          {renderChooseCategory()}
          {renderDescription()}
          {renderChooseImage()}
          <LocationSelection
            data={locationData}
            onChooseCountry={selectedCountry}
            onChooseCity={selectedCity}
            selectedCity={city}
            selectedCountry={country}
          />

          <RN.View style={{paddingBottom: 40}} />
        </RN.ScrollView>
        {visibleFooter && renderFooter()}
      </RN.SafeAreaView>
    </RN.KeyboardAvoidingView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 24,
  },
  iconHeader: {
    height: 20,
    width: 24,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
    lineHeight: 24,
    color: colors.textPrimary,
    paddingVertical: 8,
  },
  createDescription: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Mulish-Regular',
    lineHeight: 16.7,
    color: colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: 32,
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
    paddingHorizontal: 24,
  },
  footerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 14,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    backgroundColor: colors.lightGray,
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
