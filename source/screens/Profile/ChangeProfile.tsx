import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import * as RN from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {genders, statusBarHeight} from '../../utils/constants';
import colors from '../../utils/colors';
import {useProfile} from '../../hooks/useProfile';
import {Input} from '../../components/input';
import {Button} from '../../components/Button';

const ChangeProfile = () => {
  const navigation = useNavigation();
  const {userImgUrl, userName, user, onChange} = useProfile();
  const [userImg, setUserImg] = useState(userImgUrl ?? '');
  const [changeName, setChangeName] = useState(userName);
  const [openGenders, setOpenGenders] = useState(false);
  const [choosedGender, setGender] = useState(user?.gender);

  const onBack = () => {
    navigation.goBack();
  };
  const onChooseImage = async () => {
    let options = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        setUserImg(response.assets[0]);
      } else {
        console.log('cancel');
      }
    });
  };
  const onChooseGender = (genderName: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setGender(genderName);
    setOpenGenders(false);
  };
  const onPressGender = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setOpenGenders(v => !v);
  };
  const onPressSave = () => {
    onChange(changeName, choosedGender, userImg);
  };

  const header = () => {
    return (
      <RN.TouchableOpacity style={styles.headerWrapper} onPress={onBack}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.View>
        <RN.Text style={styles.headerText}>Edit profile</RN.Text>
      </RN.TouchableOpacity>
    );
  };
  const renderImage = () => {
    return (
      <RN.TouchableOpacity
        onPress={onChooseImage}
        style={styles.userImageWrapper}
        activeOpacity={0.7}>
        <RN.Image
          source={
            userImg?.base64?.length > 0
              ? {
                  uri: 'data:image/png;base64,' + userImg?.base64,
                }
              : require('../../assets/images/defaultuser.png')
          }
          style={styles.userImage}
        />
        <RN.Image source={{uri: 'editicon'}} style={styles.editiconImg} />
      </RN.TouchableOpacity>
    );
  };
  const renderGenderSelect = () => {
    return (
      <>
        <RN.TouchableOpacity
          style={[
            styles.selectGenderWrapper,
            {
              borderBottomLeftRadius: openGenders ? 0 : 8,
              borderBottomRightRadius: openGenders ? 0 : 8,
            },
          ]}
          activeOpacity={0.7}
          onPress={onPressGender}>
          <RN.Text style={styles.selectedText}>{choosedGender}</RN.Text>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: 'arrowdown'}}
              style={{
                height: 20,
                width: 20,
                transform: [{rotate: openGenders ? '180deg' : '360deg'}],
              }}
            />
          </RN.View>
        </RN.TouchableOpacity>
        {openGenders &&
          genders.map((gender: {id: number; title: string}) => {
            const isLast = genders[genders.length - 1].id;
            return (
              <RN.TouchableOpacity
                style={[
                  styles.selectGenderWrapper,
                  {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: isLast === gender.id ? 8 : 0,
                    borderBottomRightRadius: isLast === gender.id ? 8 : 0,
                  },
                ]}
                onPress={() => onChooseGender(gender.title)}>
                <RN.Text style={styles.selectedText}>{gender.title}</RN.Text>
              </RN.TouchableOpacity>
            );
          })}
      </>
    );
  };
  const renderEmailContainer = () => {
    return (
      <RN.View style={styles.emailWrapper}>
        <RN.Text style={styles.selectedText}>{user?.auth_data?.email}</RN.Text>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Image
            source={{uri: 'message'}}
            style={{
              height: 20,
              width: 20,
            }}
          />
        </RN.View>
      </RN.View>
    );
  };
  return (
    <RN.View style={styles.container}>
      {header()}
      <RN.ScrollView>
        {renderImage()}
        <RN.View style={styles.inputContainer}>
          <Input
            value={changeName}
            onChange={setChangeName}
            placeholder="Your name"
            isErrorBorder={changeName?.length <= 0}
          />
        </RN.View>
        {renderGenderSelect()}
        {/* <RN.View style={styles.inputContainer}>
          {renderEmailContainer()}
        </RN.View> */}
      </RN.ScrollView>
      <RN.View style={styles.footerWrapper}>
        <Button onPress={onPressSave} title="Save" disabled />
      </RN.View>
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backIcon: {
    height: 24,
    width: 28,
  },
  headerWrapper: {
    marginTop: statusBarHeight,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: 24,
    lineHeight: 28.8,
    fontFamily: 'Mulish-Regular',
    paddingLeft: 16,
    fontWeight: '600',
  },
  userImage: {
    height: 140,
    width: 140,
    borderRadius: 100,
  },
  userImageWrapper: {
    paddingTop: 24,
    alignSelf: 'center',
  },
  inputContainer: {
    paddingHorizontal: 6,
    paddingTop: 24,
  },
  selectGenderWrapper: {
    marginHorizontal: 20,
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  selectedText: {
    paddingVertical: 16,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  editiconImg: {
    height: 35,
    width: 35,
    marginTop: -34,
    alignSelf: 'flex-end',
  },
  emailWrapper: {
    marginHorizontal: 14,
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  footerWrapper: {
    paddingVertical: 34,
  },
});
export default ChangeProfile;