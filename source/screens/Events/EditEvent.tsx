import {useNavigation, useRoute} from '@react-navigation/native';
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
import BottomCalendar from '../../components/bottomCalendar';
import moment from 'moment';
import useEvents from '../../hooks/useEvents';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FindCity from '../../components/findCity';
import FindPlace from '../../components/findPlace';
import useAppStateHook from '../../hooks/useAppState';
interface city {
  structured_formatting: {
    main_text: '';
  };
  terms: [{offset: 0; value: ''}, {offset: 1; value: ''}];
}
const EditEvent = () => {
  const navigation = useNavigation();
  const routeParams = useRoute();
  const {changeInformation, loadingWithChangeInformation, isSaveChanges} =
    useEvents();
  const goBackBtn = () => {
    navigation.goBack();
  };
  const {
    name,
    description,
    categories,
    images,
    eventUid,
    eventDate,
    country,
    location,
    place,
    typeEvent,
  } = routeParams?.params;
  useEffect(() => {
    if (isSaveChanges) {
      goBackBtn();
    }
  }, [isSaveChanges]);

  const [title, setName] = useState(name);
  const [desc, setDescription] = useState(description);
  const [visibleFooter, setVisibleFooter] = useState(true);
  const [isErrorName, setIsErrorName] = useState(false);
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [time, setTime] = useState(eventDate?.time);
  const [startDate, setStartDate] = useState(eventDate?.startDate);
  const [endDate, setEndDate] = useState(eventDate?.endDate);
  const {eventTypes} = useAppStateHook();

  const [openPlace, setOpenPlace] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<string>(place ?? '');
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
  const [imgs, setImages] = useState(images);
  const [typeEventEdit, setTypeEvent] = useState(typeEvent);

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
    const filter = imgs.filter(item => item !== img);
    setImages(filter);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDescriptionError(false);
      setIsErrorName(false);
    }, 3000);
    return clearTimeout(timer);
  }, [isErrorName, isDescriptionError]);
  // console.log(selectedLocation)
  const onPressSaveChanges = () => {
    const eventDateEd = {
      time: time,
      startDate: startDate ?? moment(new Date()).format('YYYY-MM-DD'),
      endDate: endDate ?? null,
    };
    const locationEdt =
      selectedLocation?.structured_formatting?.main_text?.length > 0
        ? selectedLocation?.structured_formatting?.main_text +
          ', ' +
          (selectedLocation?.structured_formatting?.main_text?.length > 0
            ? selectedLocation?.terms[1].value
            : '')
        : selectedLocation;
    if (title?.length <= 0) {
      setIsErrorName(true);
    } else if (description?.length <= 0) {
      setIsDescriptionError(true);
    } else {
      changeInformation({
        name: title,
        description: description,
        // country: countryEdit,
        location: locationEdt,
        categories: addedStyles,
        images: imgs,
        eventDate: eventDateEd,
        place: selectedPlace,
        eventUid: eventUid,
        typeEvent: typeEventEdit,
      });
      setTimeout(() => {
        goBackBtn();
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
    setTime(new Date().getTime());
    setStartDate(Date.now());
    setEndDate(null);
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
        if (imgs?.length > 0) {
          setImages([...imgs, response?.assets[0]]);
        } else {
          setImages([response.assets[0]]);
        }
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
      <RN.View style={{paddingVertical: 12}}>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Change Name</RN.Text>
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
        <RN.Text style={[styles.definition, {paddingBottom: 16}]}>
          Describe your community and add the necessary contact information
        </RN.Text>
        <Input
          multiLine
          value={desc}
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
        {imgs?.length > 0 ? (
          <RN.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              flex: 1,
              paddingHorizontal: 20,
              marginVertical: 12,
            }}>
            {imgs?.map((img, index) => {
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
  console.log('endDate', endDate);
  const renderEventDates = () => {
    return (
      <RN.View>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Change Event Dates</RN.Text>
        </RN.View>
        <RN.Text style={[styles.definition, {paddingBottom: 16}]}>
          Select event date and time
        </RN.Text>
        <RN.TouchableOpacity
          style={styles.dateEventContainer}
          onPress={() => setOpenCalendar(true)}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image
              source={{uri: 'calendar'}}
              style={{height: 24, width: 24}}
            />
            <RN.View style={{flexDirection: 'row'}}>
              <RN.Text style={styles.dateEventText}>
                {`${
                  startDate === null
                    ? moment(Date.now()).format('MMMM Do')
                    : moment(startDate).format('MMMM Do')
                }${endDate ? ' - ' + moment(endDate).format('MMMM Do') : ''}`}
              </RN.Text>
              <RN.Text style={styles.dateEventText}>
                {moment(time).format('HH:mm')}
              </RN.Text>
            </RN.View>
          </RN.View>
          <RN.Image
            source={{uri: 'downlight'}}
            style={{height: 24, width: 24}}
          />
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const onSelectType = (value: string) => {
    setTypeEvent(value);
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  };
  const renderTypeEvent = () => {
    return (
      <RN.View style={{paddingVertical: 14, paddingTop: 6}}>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Choose Event Type</RN.Text>
        </RN.View>
        <RN.View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: 10,
          }}>
          {eventTypes.map((type: string, idx: number) => {
            return (
              <RN.TouchableOpacity
                key={idx}
                onPress={() => onSelectType(type)}
                style={[
                  styles.openedTypeEventContainer,
                  {
                    borderColor:
                      type === typeEventEdit ? colors.orange : colors.gray,
                  },
                ]}>
                <RN.Text
                  style={[
                    styles.openedTypeText,
                    {
                      color:
                        type === typeEventEdit
                          ? colors.orange
                          : colors.darkGray,
                    },
                  ]}>
                  {type}
                </RN.Text>
              </RN.TouchableOpacity>
            );
          })}
        </RN.View>
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
            {renderNameCommunity()}
            {renderTypeEvent()}
            {renderChooseCategory()}
            {renderDescription()}
            {renderEventDates()}
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

            <RN.Text style={styles.placeholderTitle}>Place</RN.Text>
            <RN.TouchableOpacity
              onPress={() => setOpenPlace(true)}
              style={styles.selectLocationBtn}>
              <RN.Text style={styles.locationText}>
                {selectedPlace?.length > 0
                  ? `${selectedPlace}`
                  : 'Choose place'}
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
      {openCalendar && (
        <BottomCalendar
          onClose={() => setOpenCalendar(false)}
          end={endDate}
          start={startDate}
          time={time}
          setTime={setTime}
          setStart={setStartDate}
          setEnd={setEndDate}
        />
      )}
      {openLocation && (
        <FindCity
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onClosed={() => setOpenLocation(false)}
        />
      )}
      {openPlace && (
        <FindPlace
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          onClosed={() => setOpenPlace(false)}
          crntCity={selectedLocation}
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
    paddingTop: 24,
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
    height: 20,
    width: 24,
  },
  openedTypeEventContainer: {
    // backgroundColor: colors.lightGray,
    // marginHorizontal: 20,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 100,
    marginTop: 8,
    marginLeft: 8,
  },
  typeEventContainer: {
    backgroundColor: colors.lightGray,
    marginHorizontal: 20,
    // marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  openedTypeText: {
    // color: colors.textPrimary,
    lineHeight: 22.4,
    fontSize: 16,
    paddingVertical: 4,
  },
  typeEventText: {
    color: colors.textPrimary,
    lineHeight: 22.4,
    fontSize: 16,
    paddingVertical: 17,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: statusBarHeight,
    paddingBottom: 8,
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
    paddingHorizontal: 14,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    backgroundColor: colors.white,
    paddingBottom: 8,
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
  dateEventContainer: {
    marginHorizontal: 18,
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: colors.darkGray,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateEventText: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22.4,
    paddingLeft: 12,
  },
});
export default EditEvent;