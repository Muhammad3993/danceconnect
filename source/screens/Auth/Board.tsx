/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {Input} from '../../components/input';
import {Button} from '../../components/Button';
import useRegistration from '../../hooks/useRegistration';
import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationParamList} from '../../navigation/types';
import LocationSelection from '../../components/locationSelection';
import {locationData} from '../../utils/constants';

/**
 *
 * setRegistrationData(name, gender, country, location, role) = action
 * finish => main screen;
 *
 */
const genders = [
  {
    id: 1,
    title: 'Male',
  },
  {
    id: 2,
    title: 'Female',
  },
  {
    id: 3,
    title: 'Nonbinary',
  },
];
const roles = [
  {
    id: 0,
    title: 'I’m Dancer',
  },
  {
    id: 1,
    title: 'I’m Teacher',
  },
  {
    id: 2,
    title: 'I’m Organizer',
  },
];
const Board = () => {
  const {userName, isRegistrationsSuccess, setUserData} = useRegistration();
  const [name, setName] = useState(userName);
  const [gender, setGender] = useState();
  const [country, setCountry] = useState('');
  const [currentCity, setCity] = useState('');
  const [role, setRole] = useState<string[]>(new Array(0).fill(''));
  const navigation = useNavigation<AuthStackNavigationParamList>();

  const onPressRole = (item: any) => {
    const filter = role.filter(itm => itm !== item);
    if (role?.includes(item)) {
      setRole(filter);
    } else {
      setRole([...role, item]);
    }
  };
  useEffect(() => {
    if (isRegistrationsSuccess) {
      navigation.navigate('HOME');
    }
  }, [isRegistrationsSuccess, navigation]);

  const onPressFinish = () => {
    setUserData(name, gender?.title, currentCity, country, role);
  };
  return (
    <RN.ScrollView style={styles.container}>
      <RN.Text style={styles.title}>Tell us a bit more about yourself</RN.Text>
      <RN.Text style={styles.description}>
        So we can offer you better communities and events near you
      </RN.Text>
      <RN.Text style={styles.placeholderTitle}>Name</RN.Text>
      <RN.View style={styles.inputWrapper}>
        <Input
          value={name}
          onChange={setName}
          placeholder="ex. Eric"
          keyboardType="default"
        />
      </RN.View>
      <RN.Text style={[styles.placeholderTitle, {marginTop: -24}]}>
        Gender
      </RN.Text>
      <RN.ScrollView
        style={styles.choiseWrapper}
        showsHorizontalScrollIndicator={false}
        horizontal>
        {genders.map(item => {
          return (
            <RN.TouchableOpacity
              onPress={() => setGender(item)}
              style={[
                styles.choiseItemContainer,
                {
                  borderColor:
                    item.id === gender?.id ? colors.orange : colors.gray,
                },
              ]}>
              <RN.Text
                style={[
                  styles.choiseItemText,
                  {
                    color:
                      item.id === gender?.id ? colors.orange : colors.darkGray,
                  },
                ]}>
                {item?.title}
              </RN.Text>
            </RN.TouchableOpacity>
          );
        })}
      </RN.ScrollView>

      <LocationSelection
        data={locationData}
        onChooseCountry={setCountry}
        selectedCountry={country}
        onChooseCity={setCity}
        selectedCity={currentCity}
      />

      <RN.Text style={[styles.placeholderTitle, {marginTop: -4}]}>
        Define yourself can select few
      </RN.Text>
      <RN.ScrollView
        style={styles.choiseWrapper}
        showsHorizontalScrollIndicator={false}
        horizontal>
        {roles.map(item => {
          const crntIdx =
            role.find((idx: any) => idx?.id === item.id)?.id === item.id;

          return (
            <RN.TouchableOpacity
              onPress={() => onPressRole(item)}
              style={[
                styles.choiseItemContainer,
                {
                  borderColor: crntIdx ? colors.orange : colors.gray,
                },
              ]}>
              <RN.Text
                style={[
                  styles.choiseItemText,
                  {
                    color: crntIdx ? colors.orange : colors.darkGray,
                  },
                ]}>
                {item?.title}
              </RN.Text>
            </RN.TouchableOpacity>
          );
        })}
        <RN.View style={{paddingHorizontal: 14}} />
      </RN.ScrollView>
      <RN.View style={styles.finishBtn}>
        <Button title="Next" onPress={onPressFinish} disabled={true} />
      </RN.View>
    </RN.ScrollView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.purple,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 38.4,
    paddingHorizontal: 24,
    paddingTop: 48,
    // fontFamily: 'Mulish',
  },
  description: {
    fontSize: 18,
    color: colors.textPrimary,
    paddingHorizontal: 24,
    fontWeight: '500',
    lineHeight: 25.2,
    letterSpacing: 0.2,
    paddingTop: 12,
    fontFamily: 'Mulish',
  },
  inputWrapper: {
    marginHorizontal: 10,
    paddingTop: 8,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    paddingTop: 28,
    paddingHorizontal: 24,
    color: colors.textPrimary,
  },
  choiseWrapper: {
    // flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 24,
  },
  choiseItemContainer: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 4,
  },
  choiseItemText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  finishBtn: {
    paddingVertical: 28,
  },
});

export default Board;
