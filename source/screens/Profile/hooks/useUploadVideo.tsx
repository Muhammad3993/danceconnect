import {useCallback, useEffect, useState} from 'react';
import {Keyboard, NativeEventEmitter, NativeModules} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import {showEditor} from 'react-native-video-trim';
import useAppStateHook from '../../../hooks/useAppState';
import {useDispatch} from 'react-redux';

export function useUploadVideo(onUploadVideo: () => void) {
  const dispatch = useDispatch();
  const {setLoading, setMessageNotice, setVisibleNotice} = useAppStateHook();
  const [viedoUrl, setVideourl] = useState<null | string>(null);

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', event => {
      switch (event.name) {
        case 'onShow': {
          // on Dialog show
          setLoading(false);
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
          onUploadVideo();
          setVideourl(event.outputPath);
          break;
        }
        case 'onCancelTrimming': {
          // when user clicks Cancel button
          console.log('onCancelTrimming', event);
          break;
        }
        case 'onError': {
          // any error occured: invalid file, lack of permissions to write to photo/gallery, unexpected error...
          console.log('onError', event);
          setMessageNotice(event?.message);
          setVisibleNotice(true);
          setLoading(false);
          setVideourl(null);
          break;
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [onUploadVideo, dispatch]);

  const selectVideo = useCallback(async () => {
    Keyboard.dismiss();
    let options: ImageLibraryOptions = {
      mediaType: 'video',
      selectionLimit: 1,
      videoQuality: 'medium',
    };
    setLoading(true);

    const videos = await launchImageLibrary(options);

    if (videos.assets) {
      const file = videos.assets[0];
      const duration = file.duration ?? 0;

      if (duration > 31) {
        await showEditor(file.uri ?? '', {
          maxDuration: 30,
          removeAfterSavedToPhoto: true,
        });
      } else {
        setVideourl(file.uri ?? null);
        setLoading(false);
        onUploadVideo();
      }
    } else {
      setLoading(false);
    }
  }, [onUploadVideo]);

  return {
    viedoUrl,
    selectVideo,
  };
}
