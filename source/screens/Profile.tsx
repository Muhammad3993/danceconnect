import React, {useEffect} from 'react';
import * as RN from 'react-native';
import useRegistration from '../hooks/useRegistration';
import {Button} from '../components/Button';
import {useProfile} from '../hooks/useProfile';
import colors from '../utils/colors';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadImgProfile} from '../api/functions';
import {SCREEN_WIDTH} from '../utils/constants';

const ProfileScreen = () => {
  const {logout} = useRegistration();
  const {userName, userImgUrl, getCurrentUser} = useProfile();
  const {userUid} = useRegistration();

  const onChooseImage = async () => {
    let options = {
      mediaType: 'image',
      maxWidth: 1300,
      maxHeight: 1550,
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        console.log(response.assets);
        uploadImgProfile(userUid, response.assets[0]);
        // setImages([...images, response?.assets[0]]);
      } else {
        console.log('cancel');
      }
    });
    getCurrentUser();
  };

  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return (
    <RN.View style={styles.container}>
      <RN.View style={styles.nameContainer}>
        <RN.TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={onChooseImage}>
          <RN.Image
            source={
              userImgUrl
                ? {uri: 'data:image/png;base64,' + userImgUrl?.base64}
                : require('../assets/images/defaultuser.png')
            }
            style={{height: 56, width: 56, borderRadius: 50}}
            defaultSource={require('../assets/images/defaultuser.png')}
          />
        </RN.TouchableOpacity>
        <RN.Text
          numberOfLines={2}
          style={styles.name}>{`Hello, ${userName} 👋 `}</RN.Text>
      </RN.View>
      <RN.View style={{justifyContent: 'flex-end', paddingBottom: 30}}>
        <Button title="Logout" onPress={logout} disabled={true} />
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 40,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  nameContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  name: {
    fontSize: 24,
    lineHeight: 28.8,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
    color: colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    maxWidth: SCREEN_WIDTH - 100,
  },
});

export default ProfileScreen;
