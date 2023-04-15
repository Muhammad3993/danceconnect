/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {Input} from '../../components/input';
import {Button} from '../../components/Button';
import useRegistration from '../../hooks/useRegistration';
import {useNavigation} from '@react-navigation/native';

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
    id: 1,
    title: 'I’m Dancer',
  },
  {
    id: 2,
    title: 'I’m Teacher',
  },
  {
    id: 3,
    title: 'I’m Organizer',
  },
];
const Board = () => {
  const {userName, isRegistrationsSuccess, setUserData} = useRegistration();
  const [name, setName] = useState(userName);
  const [gender, setGender] = useState(genders[0]);
  const [country, setCountry] = useState('Indonesia');
  const [currentLocation, setLocation] = useState('Bali');
  const [role, setRole] = useState(roles[0]);
  const navigation = useNavigation();

  // console.log('userName', userName)
  useEffect(() => {
    if (isRegistrationsSuccess) {
      navigation.navigate('HOME');
    }
  }, [isRegistrationsSuccess, navigation]);

  const onPressFinish = () => {
    setUserData(name, gender.title, country, currentLocation, role.title);
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
          placeholder="Your name"
          keyboardType="default"
        />
      </RN.View>
      <RN.Text style={[styles.placeholderTitle, {marginTop: -24}]}>
        Gender
      </RN.Text>
      <RN.View style={styles.choiseWrapper}>
        {genders.map(item => {
          return (
            <RN.TouchableOpacity
              onPress={() => setGender(item)}
              style={[
                styles.choiseItemContainer,
                {
                  borderColor:
                    item.id === gender.id ? colors.orange : colors.gray,
                },
              ]}>
              <RN.Text
                style={[
                  styles.choiseItemText,
                  {
                    color:
                      item.id === gender.id ? colors.orange : colors.darkGray,
                  },
                ]}>
                {item?.title}
              </RN.Text>
            </RN.TouchableOpacity>
          );
        })}
      </RN.View>

      <RN.Text style={styles.placeholderTitle}>Current country</RN.Text>
      <RN.View style={styles.inputWrapper}>
        <Input
          value={country}
          onChange={setCountry}
          placeholder="Your name"
          keyboardType="default"
        />
      </RN.View>
      <RN.Text style={[styles.placeholderTitle, {marginTop: -24}]}>
        location
      </RN.Text>
      <RN.View style={styles.inputWrapper}>
        <Input
          value={currentLocation}
          onChange={setLocation}
          placeholder="Your name"
          keyboardType="default"
        />
      </RN.View>
      <RN.Text style={[styles.placeholderTitle, {marginTop: -24}]}>
        Define yourself can select few
      </RN.Text>
      <RN.View style={styles.choiseWrapper}>
        {roles.map(item => {
          return (
            <RN.TouchableOpacity
              onPress={() => setRole(item)}
              style={[
                styles.choiseItemContainer,
                {
                  borderColor:
                    item.id === role.id ? colors.orange : colors.gray,
                },
              ]}>
              <RN.Text
                style={[
                  styles.choiseItemText,
                  {
                    color:
                      item.id === role.id ? colors.orange : colors.darkGray,
                  },
                ]}>
                {item?.title}
              </RN.Text>
            </RN.TouchableOpacity>
          );
        })}
      </RN.View>
      <RN.View style={{paddingTop: 28, marginHorizontal: 24}}>
        <Button title="Let’s Start" onPress={onPressFinish} disabled={true} />
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
    marginHorizontal: 24,
    paddingTop: 8,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    paddingTop: 28,
    paddingHorizontal: 24,
  },
  choiseWrapper: {
    flexDirection: 'row',
    paddingTop: 12,
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
});

export default Board;
