import { StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { BasicInfo } from './ui/BasicInfo';
import { theming } from 'common/constants/theming';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { Details } from './ui/Details';
import { Tickets } from './ui/Tickets';

export function CreateEvent() {
  const refPagerView = useRef<PagerView>(null);
  const [currPage, setCurrPage] = useState(0);

  const goNext = async () => {
    if (currPage < 2) {
      const nextPage = currPage + 1;
      refPagerView.current?.setPage(nextPage);
      setCurrPage(nextPage);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <PagerView
        scrollEnabled={false}
        ref={refPagerView}
        style={styles.root}
        initialPage={0}
        useNext={false}>
        <BasicInfo key={'1'} click={goNext} />
        <Details key={'2'} click={goNext} />
        <Tickets key={'3'} />
      </PagerView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
});
