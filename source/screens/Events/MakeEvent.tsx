/* eslint-disable react-native/no-inline-styles */
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import {useProfile} from '../../hooks/useProfile';
import colors from '../../utils/colors';
import {SCREEN_WIDTH, isAndroid} from '../../utils/constants';
import {Button} from '../../components/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Input} from '../../components/input';
import useAppStateHook from '../../hooks/useAppState';
import CategorySelector from '../../components/catregorySelector';
import moment from 'moment';
import BottomCalendar from '../../components/bottomCalendar';
import {launchImageLibrary} from 'react-native-image-picker';
import FindCity from '../../components/findCity';
import FindPlace from '../../components/findPlace';
import useEvents from '../../hooks/useEvents';
import useTickets from '../../hooks/useTickets';
import FastImage from 'react-native-fast-image';

const SCREENS = [
  {idx: 0, title: 'Set Basic Info'},
  {idx: 1, title: 'Add Details'},
  {idx: 2, title: 'Set Tickets'},
];
const TICKET_TYPES = [
  {
    idx: 0,
    type: 'free',
    title: 'Free Event. No tickets needed',
    description:
      'Guests don`t need tickets and the number of visitors is not limited.',
  },
  {
    idx: 1,
    type: 'paid',
    title: 'Tickets needed',
    description:
      'Entrance is paid and there are one or more types of tickets or Entrance is free, but the number of visitors is limited.',
  },
];
const MakeEvent = () => {
  const navigation = useNavigation();
  const routeParams = useRoute();
  const {createEvent, preCreatedEvent, isCreatedEvent, changeCreatedValue} =
    useEvents();
  const communityData = routeParams.params?.communityData;
  const {individualStyles} = useProfile();
  const {ticketsList, removeTicket, getTickets} = useTickets();

  const {eventTypes, currentCity} = useAppStateHook();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [typeEvent, setTypeEvent] = useState(eventTypes[0]);
  const [addedStyles, setAddedStyles] = useState<string[]>(individualStyles);
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [images, setImages] = useState(new Array(0).fill(''));
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState(
    communityData?.location ?? currentCity,
  );
  const [currentCountry, setCurrentCountry] = useState();
  const [ticketType, setTicketType] = useState(TICKET_TYPES[0]);
  const [tickets, setTickets] = useState(new Array(0).fill(''));

  const [isErrorName, setIsErrorName] = useState(false);
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [visibleFooter, setVisibleFooter] = useState(true);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openPlace, setOpenPlace] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [isErrorPlace, setIsErrorPlace] = useState(false);
  const [paidTicketsErrors, setPaidTicketsErrors] = useState(false);

  const basicInfo = currentScreen === 0;
  const details = currentScreen === 1;
  const ticketsInfo = currentScreen === 2;
  const [countNameSymbols, setCountNameSymbols] = useState({
    current: name?.length,
    maxSymbols: 100,
  });
  const [countDescSymbols, setCountDescSymbols] = useState({
    current: description?.length,
    maxSymbols: 350,
  });
  const [loadImg, setLoadImg] = useState(false);

  useEffect(() => {
    getTickets(preCreatedEvent?.id);
  }, [preCreatedEvent?.id]);
  useMemo(() => {
    setTickets(ticketsList);
  }, [ticketsList]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTickets(ticketsList);
      getTickets(preCreatedEvent?.id);
    });
    return unsubscribe;
  }, [navigation, preCreatedEvent?.id, ticketsList]);
  const onPressDeleteTicket = item => {
    // const filter = tickets.filter(itemTicket => itemTicket !== item);
    removeTicket(item);
    // setTickets(ticketsList);
  };
  const closeBtn = () => {
    navigation.goBack();
  };
  const backBtn = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    if (currentScreen !== 0) {
      setCurrentScreen(v => v - 1);
    }
  };

  const onPressNextBtn = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    switch (currentScreen) {
      case 0:
        if (!name.length) {
          setIsErrorName(true);
        } else if (!description.length) {
          setIsDescriptionError(true);
        } else {
          setCurrentScreen(v => v + 1);
        }
        break;
      case 1:
        if (!selectedPlace.length) {
          setIsErrorPlace(true);
        } else {
          setCurrentScreen(v => v + 1);
          if (!isCreatedEvent) {
            onPressCreate();
          } else {
            return null;
          }
        }
        break;
      case 2:
        if (ticketType.type === 'paid' && !tickets.length) {
          setPaidTicketsErrors(true);
        } else {
          navigation.navigate('EventScreen', {
            data: preCreatedEvent,
            createEvent: true,
          });
        }
        break;
      default:
        break;
    }
  };

  const onPressCreate = () => {
    const eventDate = {
      time: time ?? new Date().getTime(),
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
        : selectedLocation ?? communityData?.location ?? currentCity;
    const priceTicket = tickets?.length > 0 ? tickets[0].price : 0;
    createEvent({
      name: name,
      description: description,
      // country: country,
      location: locationEdt,
      categories: addedStyles,
      images: images,
      // place: 'selectedPlace',
      place: selectedPlace,
      communityUid: communityData ? communityData?._id : '',
      eventDate: eventDate,
      typeEvent: typeEvent,
      price: priceTicket,
      type: 'paid',
    });
  };

  useEffect(() => {
    changeCreatedValue();
    const subscribeShow = RN.Keyboard.addListener('keyboardDidShow', () => {
      RN.LayoutAnimation.configureNext(
        RN.LayoutAnimation.Presets.easeInEaseOut,
      );
      setVisibleFooter(false);
    });
    const subscribeHide = RN.Keyboard.addListener('keyboardDidHide', () => {
      RN.LayoutAnimation.configureNext(
        RN.LayoutAnimation.Presets.easeInEaseOut,
      );
      setVisibleFooter(true);
    });
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
    setIsErrorName(false);
  };
  const onChangeValueDescription = (value: string) => {
    setDescription(value);
    setCountDescSymbols({
      current: value.length,
      maxSymbols: 350,
    });
    setIsDescriptionError(false);
  };

  const onSelectType = (value: string) => {
    setTypeEvent(value);
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
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
  const onPressDeleteImg = (img: any) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const filter = images.filter(item => item !== img);
    setImages(filter);
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
  const onPressTicketType = (type: {
    idx: number;
    type: string;
    title: string;
    description: string;
  }) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setTicketType(type);
    setPaidTicketsErrors(false);
  };
  const onPressAddTicket = () => {
    navigation.navigate('CreateTicket', {event: preCreatedEvent});
    setPaidTicketsErrors(false);
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
        <RN.View style={styles.headerContainer}>
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
          <RN.Text style={styles.headerTitle}>Create Your Event</RN.Text>
          <RN.TouchableOpacity onPress={closeBtn}>
            <RN.Image source={{uri: 'close'}} style={styles.closeIcon} />
          </RN.TouchableOpacity>
        </RN.View>
        {renderTabs()}
      </>
    );
  };
  const renderFooter = () => {
    return (
      <RN.View style={styles.footerWrapper}>
        <Button
          title={currentScreen > 1 ? 'Create Event' : 'Next'}
          disabled
          onPress={onPressNextBtn}
        />
      </RN.View>
    );
  };
  const renderNameEvent = () => {
    return (
      <RN.View style={{marginTop: 30}}>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Create Event Name</RN.Text>
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
        <RN.View style={{marginHorizontal: 4}}>
          <Input
            value={name}
            onChange={onChangeValueName}
            placeholder="Name"
            maxLength={countNameSymbols.maxSymbols}
            isErrorBorder={isErrorName}
            onFocusInput={() => setIsErrorName(false)}
          />
        </RN.View>
      </RN.View>
    );
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
                      type === typeEvent ? colors.orange : colors.gray,
                  },
                ]}>
                <RN.Text
                  style={[
                    styles.openedTypeText,
                    {
                      color:
                        type === typeEvent ? colors.orange : colors.darkGray,
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
  const renderChooseCategory = () => {
    return (
      <RN.View style={{paddingVertical: 14, paddingBottom: 0}}>
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
          Describe your event and add the necessary contact information
        </RN.Text>
        <RN.View style={{marginHorizontal: 4}}>
          <Input
            multiLine
            value={description}
            onChange={onChangeValueDescription}
            placeholder="Description"
            maxLength={countDescSymbols.maxSymbols}
            isErrorBorder={isDescriptionError}
            onFocusInput={() => setIsDescriptionError(false)}
          />
        </RN.View>
      </RN.View>
    );
  };
  const renderEventDates = () => {
    return (
      <RN.View style={{marginTop: 30}}>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Add Event Dates</RN.Text>
        </RN.View>
        <RN.Text style={[styles.definition, {paddingBottom: 16}]}>
          Select event date and time
        </RN.Text>
        <RN.TouchableOpacity
          style={styles.dateEventContainer}
          onPress={() => setOpenCalendar(true)}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image
              source={{uri: 'calendaroutline'}}
              style={{height: 24, width: 24}}
            />
            <RN.View style={{flexDirection: 'row'}}>
              <RN.Text style={styles.dateEventText}>
                {`${
                  startDate === null
                    ? moment(Date.now()).format('MMM Do')
                    : moment(startDate).format('MMM Do')
                }${
                  endDate !== null
                    ? ' - ' + moment(endDate).format('MMM Do')
                    : ''
                }`}
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
  const renderChooseImage = () => {
    return (
      <RN.View style={{marginTop: 16}}>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>
            Upload Cover Image
            <RN.Text style={styles.countMaxSymbols}> (Optional)</RN.Text>
          </RN.Text>
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
                style={{
                  height: 160,
                  width: 160,
                  justifyContent: 'center',
                }}>
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
              <RN.Text style={styles.uploadImgText}>Upload picture</RN.Text>
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
              <RN.Text style={styles.uploadImgText}>Upload picture</RN.Text>
            </RN.TouchableOpacity>
          </>
        )}
      </RN.View>
    );
  };
  const renderChooseLocation = () => {
    return (
      <>
        <RN.Text style={styles.placeholderTitle}>Location</RN.Text>
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

        <RN.Text style={styles.placeholderTitle}>Place</RN.Text>
        <RN.TouchableOpacity
          onPress={() => {
            setIsErrorPlace(false);
            setOpenPlace(true);
          }}
          style={[
            styles.selectLocationBtn,
            {
              borderColor: isErrorPlace ? colors.redError : 'transparent',
              borderWidth: isErrorPlace ? 1 : 0,
            },
          ]}>
          <RN.Text style={styles.locationText}>
            {selectedPlace?.length > 0 ? `${selectedPlace}` : 'Choose place'}
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
      </>
    );
  };
  const renderChooseTypeEvent = () => {
    return (
      <RN.View style={{marginTop: 30}}>
        <RN.View style={[styles.nameTitle, {paddingBottom: 16}]}>
          <RN.Text style={styles.title}>Choose ticket type</RN.Text>
        </RN.View>
        {TICKET_TYPES.map(
          (type: {
            idx: number;
            type: string;
            title: string;
            description: string;
          }) => {
            return (
              <RN.TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onPressTicketType(type)}
                key={type.idx}
                style={
                  ticketType.idx === type.idx
                    ? [
                        styles.ticketTypeActive,
                        {
                          borderColor: paidTicketsErrors
                            ? colors.redError
                            : colors.purple,
                        },
                      ]
                    : styles.ticketTypeInActive
                }>
                <RN.View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <RN.View style={{justifyContent: 'center'}}>
                    <RN.Text style={styles.ticketTypeTitle}>
                      {type.title}
                    </RN.Text>
                  </RN.View>
                  <RN.Image
                    source={{
                      uri:
                        ticketType.idx === type.idx
                          ? 'checkactive'
                          : 'checkinactive',
                    }}
                    style={{height: 20, width: 20}}
                  />
                </RN.View>
                <RN.Text style={styles.ticketTypeDescription}>
                  {type.description}
                </RN.Text>
              </RN.TouchableOpacity>
            );
          },
        )}
        {ticketType.type !== 'free' &&
          ticketsInfo &&
          tickets?.length > 0 &&
          renderTickets()}
        {ticketType.type === 'paid' && (
          <Button
            title={tickets?.length > 0 ? '+ Add ticket' : 'Add ticket'}
            onPress={onPressAddTicket}
            disabled
            buttonStyle={styles.addTicketBtn}
          />
        )}
      </RN.View>
    );
  };
  const renderTickets = () => {
    return (
      <RN.View style={{marginHorizontal: 20}}>
        {tickets.map((tick, idx) => {
          return (
            <RN.View key={idx} style={styles.ticketContainer}>
              <RN.View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <RN.View style={{flexDirection: 'row'}}>
                  <RN.View style={{justifyContent: 'center'}}>
                    <RN.Image
                      source={{uri: 'ticketfull'}}
                      style={{height: 18.19, width: 18.19}}
                    />
                  </RN.View>
                  <RN.Text style={styles.ticketTitle}>{tick.name}</RN.Text>
                </RN.View>
                <RN.View style={{flexDirection: 'row'}}>
                  <RN.TouchableOpacity
                    onPress={() => navigation.navigate('EditTicket', tick)}>
                    <RN.Image
                      source={{uri: 'edit'}}
                      style={{
                        height: 24,
                        width: 24,
                        tintColor: colors.darkGray,
                      }}
                    />
                  </RN.TouchableOpacity>

                  <RN.TouchableOpacity
                    onPress={() => onPressDeleteTicket(tick)}>
                    <RN.Image
                      source={{uri: 'basket'}}
                      style={{
                        height: 24,
                        width: 24,
                        tintColor: colors.darkGray,
                        marginLeft: 8,
                      }}
                    />
                  </RN.TouchableOpacity>
                </RN.View>
              </RN.View>
              <RN.Text
                style={{
                  fontSize: 14,
                  color: colors.textPrimary,
                  lineHeight: 18.9,
                  paddingTop: 4,
                }}>
                {`Starts ${moment(tick.startDate).format('MMM Do, YYYY')} `}
              </RN.Text>
              <RN.Text
                style={{
                  fontSize: 14,
                  color: colors.textPrimary,
                  lineHeight: 18.9,
                  paddingTop: 4,
                }}>
                {`Ends ${moment(tick.endDate).format('MMM Do, YYYY')}`}
              </RN.Text>
              <RN.Text
                style={{
                  fontSize: 14,
                  color: colors.textPrimary,
                  lineHeight: 18.9,
                  paddingTop: 4,
                }}>
                {`Limit ${tick?.quantity}`}
              </RN.Text>
              <RN.View
                style={{
                  paddingTop: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <RN.Text>On Hold</RN.Text>
                <RN.Text
                  style={{
                    fontWeight: '700',
                    fontSize: 16,
                    lineHeight: 22.4,
                    letterSpacing: 0.2,
                    color: colors.textPrimary,
                  }}>
                  {tick?.price ? `$${Number(tick?.price).toFixed(2)}` : '$0'}
                </RN.Text>
              </RN.View>
            </RN.View>
          );
        })}
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
          style={{backgroundColor: colors.white}}
          extraScrollHeight={isAndroid ? 0 : 90}
          showsVerticalScrollIndicator={false}>
          {basicInfo && renderNameEvent()}
          {basicInfo && renderTypeEvent()}
          {basicInfo && renderChooseCategory()}
          {basicInfo && renderDescription()}
          {details && renderEventDates()}
          {details && renderChooseImage()}
          {details && renderChooseLocation()}
          {ticketsInfo && renderChooseTypeEvent()}
        </KeyboardAwareScrollView>
      </RN.SafeAreaView>
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
          // selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onClosed={() => setOpenLocation(false)}
          setCurrentCountry={setCurrentCountry}
        />
      )}
      {openPlace && (
        <FindPlace
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          onClosed={() => setOpenPlace(false)}
          crntCity={selectedLocation}
          currentCountry={currentCountry}
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
    paddingTop: isAndroid ? 14 : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginVertical: 4,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'Mulish-Regular',
  },
  backIcon: {
    height: 20,
    width: 24,
  },
  closeIcon: {
    height: 28,
    width: 28,
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
  },
  lineScreen: {
    height: 4,
    marginRight: 16,
    minWidth: SCREEN_WIDTH / 3.7,
    maxWidth: SCREEN_WIDTH / 3.9,
    borderRadius: 100,
  },
  createBtn: {
    marginVertical: 14,
  },
  footerWrapper: {
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingBottom: isAndroid ? 14 : 24,
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
  openedTypeEventContainer: {
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 100,
    marginTop: 8,
    marginLeft: 8,
  },
  openedTypeText: {
    lineHeight: 22.4,
    fontSize: 16,
    paddingVertical: 8,
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
  ticketTypeActive: {
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.purple,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 12,
  },
  ticketTypeInActive: {
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 12,
  },
  ticketTypeTitle: {
    fontSize: 16,
    lineHeight: 21.6,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ticketTypeDescription: {
    fontSize: 14,
    lineHeight: 22.4,
    fontWeight: '400',
    color: colors.darkGray,
    letterSpacing: 0.2,
    maxWidth: SCREEN_WIDTH - 100,
    paddingTop: 6,
  },
  addTicketBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.purple,
    color: colors.purple,
    marginVertical: 14,
    marginHorizontal: 20,
  },
  ticketContainer: {
    backgroundColor: colors.tranparentOrange,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    letterSpacing: 0.2,
    paddingLeft: 4,
    color: colors.textPrimary,
    maxWidth: SCREEN_WIDTH - 150,
  },
});
export default MakeEvent;
