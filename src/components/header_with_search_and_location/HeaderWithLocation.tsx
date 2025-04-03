import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { RightArrowIcon } from '@components/icons/rightArrow';
import { DCBottomSheet } from '@components/shared/bottom_sheet';
import React, { useCallback, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { LocationBottomSheet } from './ui/LocationBottomSheet';
import { images } from '@common/resources/images';

export function HeaderWithLocation() {
  const [content, setContent] = useState('main');
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { styles, theme } = useStyles(styleSheet);

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
        <Image
          style={{ width: 16, height: 16 }}
          tintColor={theme.colors.secondary500}
          source={images.icon.locationPin}
        />
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

const styleSheet = createStyleSheet(theming => ({
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
}));
