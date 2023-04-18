import React, {useEffect} from 'react';
import * as RN from 'react-native';
import useRegistration from '../hooks/useRegistration';
import {Button} from '../components/Button';
import {useProfile} from '../hooks/useProfile';
import colors from '../utils/colors';

const ProfileScreen = () => {
  const {logout} = useRegistration();
  const {userName, userImgUrl} = useProfile();

  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return (
    <RN.View style={styles.container}>
      <RN.View style={styles.nameContainer}>
        {userImgUrl && (
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: userImgUrl}}
              style={{height: 56, width: 56, borderRadius: 50}}
            />
          </RN.View>
        )}
        <RN.Text style={styles.name}>{`Hello, ${userName} 👋 `}</RN.Text>
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
  },
});

export default ProfileScreen;
