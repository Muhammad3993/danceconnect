import React from 'react';
import * as RN from 'react-native';

import {SkeletonContainer, Skeleton} from 'react-native-skeleton-component';
import {SCREEN_WIDTH} from '../../utils/constants';
const SkeletonEventCard = () => {
  return (
    <SkeletonContainer
      highlightColor="#e8e8e8"
      backgroundColor="#dcdcdc"
      speed={850}
      animation="wave">
      <RN.View style={styles.container}>
        <RN.View style={styles.wrapper}>
          <RN.View>
            <Skeleton style={styles.title} />
            <RN.View style={{height: 14}} />
            <Skeleton style={styles.desc} />
            <RN.View style={{height: 14}} />
            <Skeleton style={styles.title} />
          </RN.View>
          <Skeleton style={styles.img} />
        </RN.View>
        <RN.View style={styles.footer}>
          <RN.View
            style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <RN.View style={{flexDirection: 'row'}}>
              <Skeleton style={styles.tag} />
              <Skeleton style={styles.tag} />
              <Skeleton style={styles.tag} />
            </RN.View>
            <Skeleton style={styles.joinBtn} />
          </RN.View>
        </RN.View>
      </RN.View>
    </SkeletonContainer>
  );
};

const styles = RN.StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    marginTop: 8,
    borderTopColor: '#dcdcdc',
  },
  joinBtn: {
    height: 30,
    width: 60,
    borderRadius: 40,
    marginTop: 8,
  },
  tag: {
    width: 40,
    height: 20,
    marginTop: 14,
    borderRadius: 4,
    marginRight: 4,
  },
  tags: {
    width: SCREEN_WIDTH / 2,
    height: 20,
    marginTop: 8,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    borderColor: '#dcdcdc',
  },
  title: {
    height: 20,
    width: SCREEN_WIDTH / 1.6,
    borderRadius: 8,
  },
  desc: {
    height: 50,
    width: SCREEN_WIDTH / 1.6,
    borderRadius: 8,
  },
  img: {
    height: 120,
    width: 80,
    borderRadius: 8,
  },
});
export default SkeletonEventCard;
