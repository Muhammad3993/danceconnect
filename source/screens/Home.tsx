import React, {useEffect} from 'react';
import * as RN from 'react-native';
import {useProfile} from '../hooks/useProfile';
import colors from '../utils/colors';
import CreateCommunityButton from '../components/createCommunityBtn';

const HomeScreen = () => {
  const {userName, userImgUrl} = useProfile();

  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  const renderHeader = () => {
    return (
      <>
        <RN.View style={styles.headerContainder}>
          <RN.Image
            source={require('../assets/images/logoauth.png')}
            style={styles.logoImg}
          />
          <RN.TouchableOpacity
            style={styles.searchIconWrapper}
            activeOpacity={0.7}>
            <RN.Image source={{uri: 'search'}} style={styles.seachIcon} />
          </RN.TouchableOpacity>
        </RN.View>
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
      </>
    );
  };
  return (
    <RN.View style={styles.container}>
      {renderHeader()}
      <CreateCommunityButton />
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
  headerContainder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchIconWrapper: {
    backgroundColor: colors.gray,
    borderRadius: 20,
    padding: 4,
  },
  seachIcon: {
    height: 28,
    width: 28,
  },
  logoImg: {
    height: 34,
    width: 122,
  },
});

export default HomeScreen;
