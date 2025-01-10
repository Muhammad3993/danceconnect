import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { LocationIcon } from 'components/icons/location';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { theming } from 'common/constants/theming';
import { DCBottomSheet } from 'components/shared/bottom_sheet';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { LocationBottomSheet } from './ui/LocationBottomSheet';

export function HeaderWithLocation() {
  const [content, setContent] = useState('main');
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const presentModal = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const closeModal = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.communitiesLocation}
        onPress={presentModal}>
        <LocationIcon width={16} height={16} />
        <Text style={styles.communitiesLocationTitle}>
          San Francisco, California
        </Text>
        <RightArrowIcon style={{ transform: [{ rotate: '90deg' }] }} />
      </TouchableOpacity>
      <DCBottomSheet snapPoints={['90%']} ref={bottomSheetRef}>
        <BottomSheetView>
          <LocationBottomSheet content={content} setContent={setContent} />
        </BottomSheetView>
      </DCBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  communitiesLocation: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theming.spacing.XS,
    marginTop: 10,
    borderWidth: 1,
    borderColor: theming.colors.gray300,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  communitiesLocationTitle: {
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },
});
