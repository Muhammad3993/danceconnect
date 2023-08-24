import React, {useState} from 'react';
import * as RN from 'react-native';
import CategorySelector from '../../components/catregorySelector';
import {Button} from '../../components/Button';
import {useProfile} from '../../hooks/useProfile';
import colors from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import {statusBarHeight} from '../../utils/constants';

const DanceStylesProfile = () => {
  const {individualStyles, onChangeDanceStyles} = useProfile();
  const [addedStyles, setAddedStyles] = useState<string[]>(
    individualStyles ?? [],
  );
  const navigation = useNavigation();

  const onChooseDanceStyles = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const isAvailable = addedStyles?.includes(value);
    if (isAvailable) {
      onPressDeleteItem(value);
    } else {
      setAddedStyles([...addedStyles, value]);
    }
  };

  const header = () => {
    return (
      <RN.View style={styles.headerWrapper}>
        <RN.TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() => navigation.goBack()}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const onPressDeleteItem = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const filter = addedStyles.filter(item => item !== value);
    setAddedStyles(filter);
  };
  const onPressFinish = () => {
    onChangeDanceStyles(addedStyles);
    // navigation.goBack();
  };
  return (
    <>
      {header()}
      <RN.ScrollView style={styles.container}>
        <RN.Text style={[styles.title, {paddingBottom: 20}]}>
          What dance style do you prefer?
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
                      style={{
                        height: 14,
                        width: 14,
                        tintColor: colors.orange,
                      }}
                      source={{uri: 'close'}}
                    />
                  </RN.View>
                </RN.TouchableOpacity>
              );
            })}
          </RN.View>
        )}
        <CategorySelector
          addedStyles={addedStyles}
          onChoosheDanceStyle={onChooseDanceStyles}
        />
        <RN.View style={[styles.finishBtn, {marginTop: -24}]}>
          <Button
            title="Save"
            onPress={onPressFinish}
            disabled={addedStyles?.length > 0}
          />
        </RN.View>
        <RN.View style={{marginBottom: 60}} />
      </RN.ScrollView>
    </>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: statusBarHeight,
    backgroundColor: colors.white,
  },
  backIcon: {
    height: 24,
    width: 28,
  },
  headerWrapper: {
    paddingTop: statusBarHeight,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38.4,
    paddingHorizontal: 24,
    paddingTop: 18,
    fontFamily: 'Mulish',
  },
  finishBtn: {
    paddingVertical: 28,
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
    paddingBottom: 14,
  },
});
export default DanceStylesProfile;
