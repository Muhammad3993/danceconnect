import { useCallback, useLayoutEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { showEditor } from 'react-native-video-trim';
import { showErrorToast } from 'common/libs/toast';
import ImageCropPicker from 'react-native-image-crop-picker';

export interface VideoData {
  path: string;
  filename?: string;
}

export function usePickVideoFile(onPickVideo: (data: VideoData) => void) {
  useLayoutEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', event => {
      switch (event.name) {
        case 'onShow': {
          // on Dialog show
          // setLoading(false);
          console.log('onShowListener', event);
          break;
        }
        case 'onHide': {
          // on Dialog hide
          console.log('onHide', event);
          break;
        }
        case 'onStartTrimming': {
          // on start trimming
          console.log('onStartTrimming', event);
          break;
        }
        case 'onFinishTrimming': {
          // on trimming is done
          console.log('onFinishTrimming', event);
          onPickVideo({ path: event.outputPath, filename: event.outputPath });
          break;
        }
        case 'onCancelTrimming': {
          console.log('onCancelTrimming', event);
          break;
        }
        case 'onError': {
          showErrorToast(event?.message);
          break;
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [onPickVideo]);

  const selectVideo = useCallback(async () => {
    try {
      const video = await ImageCropPicker.openPicker({
        mediaType: 'video',
        selectionLimit: 1,
        videoQuality: 'medium',
        formatAsMp4: true,
      });

      const duration = video.duration ?? 0;

      if (duration > 31) {
        await showEditor(video.path ?? '', {
          maxDuration: 30,
          removeAfterSavedToPhoto: true,
        });
      } else {
        onPickVideo(video);
      }
    } catch (err) {
      const error = err as Error;
      showErrorToast(error.message);
    }
  }, [onPickVideo]);

  return selectVideo;
}
