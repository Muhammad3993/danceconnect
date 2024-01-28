import React from 'react';
import * as RN from 'react-native';

import {SkeletonContainer, Skeleton} from 'react-native-skeleton-component';
import {SCREEN_WIDTH} from '../../utils/constants';
const SkeletonUserCard = () => {
  return (
    <SkeletonContainer
      highlightColor="#e8e8e8"
      backgroundColor="#dcdcdc"
      speed={850}
      animation="wave">
      <RN.View style={styles.container}>
        <RN.View style={styles.wrapper}>
          <Skeleton style={styles.userImg} />
          <RN.View>
            <Skeleton style={styles.desc} />
            <Skeleton style={styles.location} />
            <RN.View style={{flexDirection: 'row'}}>
              <Skeleton style={styles.tag} />
              <Skeleton style={styles.tag} />
              <Skeleton style={styles.tag} />
              <Skeleton style={styles.tag} />
              <Skeleton style={styles.tag} />
            </RN.View>
            <RN.View style={styles.bottomLine} />
          </RN.View>
        </RN.View>
      </RN.View>
    </SkeletonContainer>
  );
};

const styles = RN.StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomLine: {
    // borderBottomWidth: 0.5,
    width: SCREEN_WIDTH - 120,
    // paddingTop: 6,
  },
  container: {
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 2,
  },
  userImg: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  tag: {
    width: 40,
    height: 20,
    borderRadius: 4,
    marginRight: 4,
  },
  desc: {
    height: 18,
    width: 150,
    borderRadius: 4,
  },
  location: {
    height: 18,
    width: 100,
    borderRadius: 4,
    marginVertical: 8,
  },
});
export default SkeletonUserCard;
