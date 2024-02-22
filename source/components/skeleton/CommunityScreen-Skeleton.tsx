import React from 'react';
import * as RN from 'react-native';

import {SkeletonContainer, Skeleton} from 'react-native-skeleton-component';
import {getAdaptiveWidth} from '../../utils/constants';

const SkeletonCommunityScreen = () => {
  return (
    <SkeletonContainer
      highlightColor="#e8e8e8"
      backgroundColor="#c3c3c3"
      speed={850}
      animation="wave">
      <Skeleton style={styles.img} />
      <Skeleton style={styles.title} />
      <Skeleton style={styles.desc} />
      <RN.View style={styles.rowContainer}>
        <RN.View style={{flexDirection: 'row'}}>
          <Skeleton style={styles.circle} />
          <RN.View style={{justifyContent: 'center', paddingLeft: 8}}>
            <Skeleton style={styles.text} />
          </RN.View>
        </RN.View>
        <RN.View style={{justifyContent: 'center'}}>
          <Skeleton style={{height: 25, width: 60, borderRadius: 8}} />
        </RN.View>
      </RN.View>
      <RN.View style={styles.rowContainer}>
        <RN.View style={{flexDirection: 'row'}}>
          <Skeleton style={styles.circle} />
          <RN.View style={{justifyContent: 'center', paddingLeft: 8}}>
            <Skeleton style={[styles.text, {width: 150}]} />
            <Skeleton
              style={{height: 10, width: 100, borderRadius: 4, marginTop: 4}}
            />
          </RN.View>
        </RN.View>
        <RN.View style={{justifyContent: 'center'}}>
          <Skeleton style={{height: 45, width: 100, borderRadius: 100}} />
        </RN.View>
      </RN.View>
      <Skeleton style={styles.btn} />
      <RN.View style={styles.rowContainer}>
        <Skeleton style={styles.tab} />
        <Skeleton style={styles.tab} />
      </RN.View>
    </SkeletonContainer>
  );
};
const styles = RN.StyleSheet.create({
  tab: {
    height: 25,
    width: 150,
    marginTop: 14,
    borderRadius: 8,
  },
  btn: {
    height: 50,
    marginTop: 24,
    marginHorizontal: 24,
    borderRadius: 100,
  },
  circle: {
    height: 44,
    width: 44,
    borderRadius: 100,
  },
  text: {
    width: 205,
    height: 25,
    borderRadius: 8,
  },
  img: {
    height: getAdaptiveWidth(480),
  },
  title: {
    height: 30,
    marginTop: 15,
    // width: SCREEN_WIDTH / 1.2,
    borderRadius: 8,
    marginHorizontal: 24,
  },
  desc: {
    marginHorizontal: 24,
    height: 110,
    borderRadius: 8,
    marginTop: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 14,
  },
});
export default SkeletonCommunityScreen;
