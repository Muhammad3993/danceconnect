import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';

function Backdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );
}

export const DCBottomSheet = forwardRef<
  BottomSheetModal,
  BottomSheetModalProps
>((props, ref) => {
  return (
    <BottomSheetModal
      enableOverDrag={false}
      backdropComponent={Backdrop}
      ref={ref}
      index={0}
      {...props}
    />
  );
});
