/* eslint-disable react-native/no-inline-styles */
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState, useTransition} from 'react';
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
import {apiUrl} from '../../api/serverRequests';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {isValidUrl} from '../../utils/helpers';

const EditEventScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const SCREENS = [
    {idx: 0, title: t('change_basic_info')},
    {idx: 1, title: t('change_detail')},
    {idx: 2, title: t('change_set_tickets')},
  ];
  const TICKET_TYPES = [
    {
      idx: 0,
      type: 'free',
      title: t('tt_free_title'),
      description: t('tt_free_desc'),
    },
    {
      idx: 1,
      type: 'paid',
      title: t('tt_paid_title'),
      description: t('tt_paid_desc'),
    },
  ];
  const routeParams = useRoute();
  const {changeInformation, loadingWithChangeInformation, isSaveChanges} =
    useEvents();
  const {
    description,
    categories,
    images,
    id,
    // eventUid,
    eventDate,
    country,
    location,
    place,
    typeEvent,
    price,
    isEditTicket,
    inAppTickets,
    link,
  } = routeParams?.params;
  const {removeTicket, ticketsList, getTickets} = useTickets();

  const {eventTypes, countries, getTicketPricePercent, priceFix, pricePercent} =
    useAppStateHook();
  const [title, setName] = useState(routeParams?.params?.title ?? '');
  const [desc, setDescription] = useState(description);
  const [typeEventEdit, setTypeEvent] = useState(typeEvent);

  const [addedStyles, setAddedStyles] = useState<string[]>(categories);
  // const [price, setPrice] = useState(0);
  const [time, setTime] = useState(eventDate?.time);
  const [startDate, setStartDate] = useState(eventDate?.startDate);
  const [endDate, setEndDate] = useState(eventDate?.endDate);

  const [imgs, setImages] = useState(images);
  const [selectedPlace, setSelectedPlace] = useState<string>(place ?? '');
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [currentCountry, setCurrentCountry] = useState();

  const [tickets, setTickets] = useState(ticketsList);
  const [ticketType, setTicketType] = useState(
    tickets?.length > 0 ? TICKET_TYPES[1] : TICKET_TYPES[0],
  );
  // const [ticketType, setTicketType] = useState(TICKET_TYPES[0]);
  const [isErrorName, setIsErrorName] = useState(false);
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(isEditTicket ? 2 : 0);
  const [visibleFooter, setVisibleFooter] = useState(true);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openPlace, setOpenPlace] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [isErrorPlace, setIsErrorPlace] = useState(false);
  const [paidTicketsErrors, setPaidTicketsErrors] = useState(false);
  const [loadImg, setLoadImg] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);

  const [inAppTicketsEdit, setInAppTickets] = useState(inAppTickets);
  const [externalLink, setExternalLink] = useState(link);
  const [validUrl, setValidUrl] = useState(false);

  const basicInfo = currentScreen === 0;
  const details = currentScreen === 1;
  const ticketsInfo = currentScreen === 2;
  const [countNameSymbols, setCountNameSymbols] = useState({
    current: title?.length,
    maxSymbols: 100,
  });
  const [countDescSymbols, setCountDescSymbols] = useState({
    current: description?.length,
    maxSymbols: 1000,
  });
  const isAlreadyTicketsSold = ticketsList?.some(
    ticket => ticket?.items?.length > 0,
  );

  useEffect(() => {
    getTicketPricePercent();
  }, []);

  useEffect(() => {
    if (endDate === null) {
      setEndDate(startDate);
    }
  }, [endDate, startDate]);
  useEffect(() => {
    const c = countries.find(
      (c: {country: string}) => c.country === selectedLocation?.split(', ')[0],
    );
    if (c !== undefined) {
      setCurrentCountry(c);
    } else {
      const c1 = countries.find(
        (c: {country: string}) =>
          c.country === selectedLocation?.split(', ')[1],
      );
      if (c1 !== undefined) {
        setCurrentCountry(c1);
      } else {
        const cCode = countries.find(
          (c: {country: string}) =>
            c.country === currentCountry?.split(', ')[2],
        ).countryCode;
        setCurrentCountry({
          city: selectedLocation,
          countryCode: cCode,
        });
      }
    }
  }, [selectedLocation]);
  useEffect(() => {
    getTickets(id);
  }, [id]);
  useMemo(() => {
    setTickets(ticketsList);
  }, [ticketsList]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTickets(ticketsList);
      getTickets(id);
    });
    return unsubscribe;
  }, [navigation, id, ticketsList]);

  // useEffect(() => {
  //   // if (ticketsList) {
  //   //   setTickets(ticketsList);
  //   // }
  //   getTickets(id).then(ticketsList => {
  //     setTickets(ticketsList);
  //     setTicketType(
  //       ticketsList?.length > 0 ? TICKET_TYPES[1] : TICKET_TYPES[0],
  //     );
  //   });
  // }, [id]);
  const onPressDeleteTicket = (item: any) => {
    // console.log('item', item);
    // const filter = tickets.filter(itemTicket => itemTicket !== item);
    removeTicket(item);
    // getTickets(id).then(ticketsList => {
    //   setTickets(ticketsList);
    // });
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
    if (currentScreen === 0) {
      if (!title.length) {
        setIsErrorName(true);
      } else if (!description.length) {
        setIsDescriptionError(true);
      } else if (!addedStyles.length) {
        setCategoriesError(true);
      } else {
        setCurrentScreen(v => v + 1);
      }
    } else if (currentScreen > 1) {
      if (ticketType.type === 'paid' && !tickets.length) {
        setPaidTicketsErrors(true);
      } else if (ticketType.type === 'free') {
        if (ticketsList?.length) {
          tickets.map(ticket => {
            removeTicket(ticket);
          });
        }
        onPressSaveChange();
      } else {
        onPressSaveChange();
      }
    } else {
      if (!selectedPlace.length) {
        setIsErrorPlace(true);
      } else {
        setCurrentScreen(v => v + 1);
      }
    }
  };
  const onPressSaveChange = () => {
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
    } else if (!inAppTicketsEdit && !isValidUrl(externalLink)) {
      setValidUrl(true);
    } else {
      changeInformation({
        name: title,
        description: desc,
        // country: countryEdit,
        location: locationEdt,
        categories: addedStyles,
        images: imgs,
        eventDate: eventDateEd,
        place: selectedPlace,
        eventUid: routeParams?.params?._id,
        typeEvent: typeEventEdit,
        price: price,
        inAppTickets: inAppTicketsEdit,
        externalLink: !inAppTicketsEdit ? externalLink : '',
      });
    }
  };

  useEffect(() => {
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
      maxSymbols: 1000,
    });
    setIsDescriptionError(false);
  };

  const onSelectType = (value: string) => {
    setTypeEvent(value);
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
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
  const onPressDeleteImg = (img: any) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const filter = imgs.filter(item => item !== img);
    setImages(filter);
  };
  const onChooseImage = async () => {
    let options = {
      mediaType: 'photo',
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
  const onPressTicketType = (type: {
    idx: number;
    type: string;
    title: string;
    description: string;
  }) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    if (!isAlreadyTicketsSold) {
      setTicketType(type);
    }
    setPaidTicketsErrors(false);
  };
  const onPressAddTicket = () => {
    navigation.push('CreateTicket', {event: routeParams?.params});
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
          <RN.Text style={styles.headerTitle}>{t('change_event')}</RN.Text>
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
          title={currentScreen > 1 ? t('save_changes') : t('next')}
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
          <RN.Text style={styles.title}>{t('change_event_name')}</RN.Text>
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
            value={title}
            onChange={onChangeValueName}
            placeholder={t('event_name')}
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
          <RN.Text style={styles.title}>{t('choose_ev_type')}</RN.Text>
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
  const renderChooseCategory = () => {
    return (
      <RN.View style={{paddingVertical: 14, paddingBottom: 0}}>
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
        <RN.Text
          style={[
            styles.definition,
            {
              marginBottom: addedStyles?.length > 0 ? 0 : 12,
            },
          ]}>
          {t('ds_desc_event')}
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
          {t('event_desc_last')}
        </RN.Text>
        <RN.View style={{marginHorizontal: 4}}>
          <Input
            multiLine
            value={desc}
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
          <RN.Text style={styles.title}>{t('change_event_date')}</RN.Text>
        </RN.View>
        <RN.Text style={[styles.definition, {paddingBottom: 16}]}>
          {t('select_event_date')}
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
                    ? endDate === startDate
                      ? ''
                      : ' - ' + moment(endDate).format('MMM Do')
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
            {t('upload_img_title')}
            <RN.Text style={styles.countMaxSymbols}> {t('optional')}</RN.Text>
          </RN.Text>
        </RN.View>
        <RN.Text style={[styles.definition, {paddingBottom: 16}]}>
          {t('upload_img_desc')}
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
                      uri: img?.base64?.length > 0 ? img?.uri : apiUrl + img,
                    }}
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
  const renderChooseLocation = () => {
    return (
      <>
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

        <RN.Text style={styles.placeholderTitle}>{t('place')}</RN.Text>
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
            {selectedPlace?.length > 0 ? `${selectedPlace}` : t('choose_place')}
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
        <RN.View style={styles.toggle}>
          <RN.Switch
            trackColor={{false: colors.gray, true: colors.orange}}
            thumbColor={inAppTicketsEdit ? colors.white : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setInAppTickets}
            value={inAppTicketsEdit}
            disabled={isAlreadyTicketsSold}
            style={{transform: [{scaleX: 0.5}, {scaleY: 0.5}]}}
          />
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Text>{'In-App tickets'}</RN.Text>
          </RN.View>
        </RN.View>
        {!inAppTicketsEdit && (
          <>
            <RN.View style={[styles.nameTitle, {paddingVertical: 16}]}>
              <RN.Text style={styles.title}>Put a link</RN.Text>
            </RN.View>
            <RN.View style={{marginHorizontal: 4}}>
              <Input
                value={externalLink}
                onChange={setExternalLink}
                placeholder={'Put the link here'}
                isErrorBorder={validUrl}
              />
            </RN.View>
          </>
        )}
        {inAppTicketsEdit && (
          <>
            <RN.View style={[styles.nameTitle, {paddingVertical: 16}]}>
              <RN.Text style={styles.title}>{t('ticket_type')}</RN.Text>
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
                    disabled={
                      isAlreadyTicketsSold && type.type === TICKET_TYPES[0].type
                    }
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
                        : [
                            styles.ticketTypeInActive,
                            {
                              opacity:
                                isAlreadyTicketsSold &&
                                type.type === TICKET_TYPES[0].type
                                  ? 0.5
                                  : 1,
                            },
                          ]
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
                title={
                  tickets?.length > 0 ? `+ ${t('add_ticket')}` : t('add_ticket')
                }
                onPress={onPressAddTicket}
                disabled
                buttonStyle={styles.addTicketBtn}
              />
            )}
          </>
        )}
      </RN.View>
    );
  };
  const renderTicket = (ticket: {
    name: string;
    description: string;
    items: string[];
    startDate: Date;
    endDate: Date;
    quantity: number;
    enabled: boolean;
    price: number;
    initialPrice: number;
    isFinalPrice?: boolean;
  }) => {
    return (
      <RN.View style={styles.ticketContainer}>
        <RN.View style={{flexDirection: 'row'}}>
          <RN.View style={{justifyContent: 'flex-start'}}>
            <RN.Image
              source={{uri: 'ticketfull'}}
              style={{height: 18.19, width: 18.19}}
            />
          </RN.View>
          <RN.View style={{justifyContent: 'center', marginTop: -2}}>
            <RN.Text numberOfLines={2} style={styles.ticketTitle}>
              {ticket.name}
            </RN.Text>
          </RN.View>
        </RN.View>
        {ticket?.description?.length > 0 && (
          <RN.Text
            style={{
              fontSize: 14,
              lineHeight: 18.9,
              color: colors.darkGray,
              paddingTop: 12,
            }}>
            {ticket?.description}
          </RN.Text>
        )}
        <RN.Text
          style={{
            fontSize: 13,
            color: colors.textPrimary,
            lineHeight: 18.9,
            paddingTop: 4,
            maxWidth: SCREEN_WIDTH - 100,
          }}>
          {t('starts')}
          <RN.Text style={{fontWeight: '600'}}>{` ${moment(
            ticket.startDate,
          ).format('MMM Do, YYYY')} / `}</RN.Text>
          {t('ends')}
          <RN.Text style={{fontWeight: '600'}}>{` ${moment(
            ticket.endDate,
          ).format('MMM Do, YYYY')}`}</RN.Text>
        </RN.Text>
        <RN.Text
          style={{
            fontSize: 13,
            color: colors.textPrimary,
            lineHeight: 18.9,
            paddingTop: 4,
            maxWidth: SCREEN_WIDTH - 100,
          }}>
          {t('limit')}{' '}
          <RN.Text style={{fontWeight: '600'}}>{ticket.quantity}</RN.Text>
          {' / '}
          {t('sold')}{' '}
          <RN.Text style={{fontWeight: '600'}}>{ticket.items.length}</RN.Text>
        </RN.Text>
        {ticket.initialPrice > 0 && (
          <RN.Text
            style={{
              fontSize: 13,
              color: colors.textPrimary,
              lineHeight: 18.9,
              paddingTop: 4,
              maxWidth: SCREEN_WIDTH - 100,
            }}>
            {t('price')}{' '}
            <RN.Text style={{fontWeight: '600'}}>
              {ticket?.isFinalPrice
                ? ticket.initialPrice -
                  (
                    (ticket.initialPrice * pricePercent * 100) / 100 +
                    priceFix
                  ).toFixed(2) +
                  ' USD '
                : ticket.initialPrice + ' USD '}
            </RN.Text>
            <RN.Text style={{color: colors.darkGray}}>
              +{' '}
              {`${(
                (ticket.initialPrice * pricePercent * 100) / 100 +
                priceFix
              ).toFixed(2)} USD Fee`}
            </RN.Text>
          </RN.Text>
        )}
        <RN.View
          style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Text
              style={{
                fontWeight: '700',
                fontSize: 18,
                lineHeight: 22.4,
                color: colors.textPrimary,
                paddingVertical: 10,
              }}>
              {ticket.price.toFixed(2) + ' USD'}
            </RN.Text>
          </RN.View>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.TouchableOpacity
              style={{justifyContent: 'center'}}
              onPress={() => navigation.push('EditTicket', ticket)}>
              <RN.Image
                source={{uri: 'edit'}}
                style={{
                  height: 24,
                  width: 24,
                  tintColor: colors.darkGray,
                }}
              />
            </RN.TouchableOpacity>
            {ticket?.items?.length <= 0 && (
              <RN.TouchableOpacity
                style={{justifyContent: 'center'}}
                onPress={() => onPressDeleteTicket(ticket)}>
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
            )}
          </RN.View>
        </RN.View>
      </RN.View>
    );
  };
  const renderTickets = () => {
    return (
      <RN.View style={{marginHorizontal: 20}}>
        {tickets.map((tick, idx) => {
          return renderTicket(tick);
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
          selectedLocation={selectedLocation}
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
  toggle: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingBottom: 4,
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
    // marginBottom: 6,
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
    paddingRight: 18,
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
    maxWidth: SCREEN_WIDTH - 100,
    color: colors.textPrimary,
  },
});
export default EditEventScreen;
