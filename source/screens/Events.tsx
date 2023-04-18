import React, {useEffect} from 'react';
import * as RN from 'react-native';
import {useProfile} from '../hooks/useProfile';
import colors from '../utils/colors';

const EventsScreen = () => {
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
      <RN.Text style={styles.name}>It's a events screen</RN.Text>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  nameContainer: {
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

export default EventsScreen;
