import React from 'react';
import * as RN from 'react-native';

import {SkeletonContainer, Skeleton} from 'react-native-skeleton-component';

const SkeletonEventScreen = () => {
  return (
    <SkeletonContainer
      highlightColor="#e8e8e8"
      backgroundColor="#c3c3c3"
      speed={850}
      animation="wave">
      <Skeleton style={styles.img} />
      <Skeleton style={styles.title} />
      <RN.View style={styles.rowContainer}>
        <RN.View style={{flexDirection: 'row'}}>
          <Skeleton style={styles.circle} />
          <RN.View style={{justifyContent: 'center', paddingLeft: 8}}>
            <Skeleton style={[styles.text, {width: 220}]} />
            <Skeleton
              style={{height: 10, width: 100, borderRadius: 4, marginTop: 4}}
            />
          </RN.View>
        </RN.View>
      </RN.View>

      <RN.View style={styles.rowContainer}>
        <RN.View style={{flexDirection: 'row'}}>
          <Skeleton style={styles.circle} />
          <RN.View style={{justifyContent: 'center', paddingLeft: 8}}>
            <Skeleton style={styles.text} />
            <Skeleton
              style={{height: 10, width: 100, borderRadius: 4, marginTop: 4}}
            />
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
            <Skeleton style={styles.text} />
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
      <Skeleton style={styles.desc} />
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
    width: 150,
    height: 25,
    borderRadius: 8,
  },
  img: {
    height: 350,
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
    height: 80,
    borderRadius: 8,
    marginTop: 28,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 14,
  },
});
export default SkeletonEventScreen;
