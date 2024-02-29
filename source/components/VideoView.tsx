import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import Video from 'react-native-video';
import colors from '../utils/colors';

interface Props {
  paused?: boolean;
  width: number;
  height?: number;
  videoPoster?: string;
  videoUrl?: string;
  uploadPercent?: null | number;
  isCreating?: boolean;
}

export const VideoView = memo(
  ({
    paused = false,
    width,
    height,
    videoPoster,
    videoUrl,
    uploadPercent,
    isCreating = false,
  }: Props) => {
    const [localPause, setLocalPause] = useState(false);
    const [buffering, setBuffering] = useState(true);
    const [isMute, setIsMute] = useState(true);
    const [scalableWidth, setScalableWidth] = useState(width);
    const [scalableHeight, setScalableHeight] = useState(height ?? width);
    const [sizing, setSizing] = useState(true);

    const showPercent = Boolean(
      uploadPercent && uploadPercent > 0 && uploadPercent < 99,
    );

    const adjustSize = useCallback(
      (sourceWidth: number, sourceHeight: number) => {
        let ratio = 1;

        if (width && height) {
          ratio = Math.min(width / sourceWidth, height / sourceHeight);
        } else if (width) {
          ratio = width / sourceWidth;
        } else if (height) {
          ratio = height / sourceHeight;
        }

        const computedWidth = sourceWidth * ratio;
        const computedHeight = sourceHeight * ratio;

        setScalableWidth(computedWidth);
        setScalableHeight(computedHeight);
        setSizing(false);
      },
      [height, width],
    );

    return (
      <View
        style={[
          styles.mediaContainer,
          {width: scalableWidth, height: scalableHeight},
        ]}>
        {(sizing || buffering) && (
          <View
            style={[
              styles.sizingOverlay,
              {width: scalableWidth, height: scalableHeight},
            ]}>
            <ActivityIndicator />
          </View>
        )}
        <Video
          paused={localPause || paused}
          repeat
          muted={isMute}
          posterResizeMode="cover"
          poster={videoPoster}
          style={{width: scalableWidth, height: scalableHeight}}
          resizeMode="cover"
          source={{uri: videoUrl}}
          ignoreSilentSwitch="ignore"
          onBuffer={data => {
            if (buffering && !data.isBuffering) {
              setBuffering(false);
            }
          }}
          onLoad={({naturalSize}) => {
            if (
              isCreating &&
              Platform.OS !== 'android' &&
              naturalSize.orientation === 'portrait'
            ) {
              adjustSize(naturalSize.height, naturalSize.width);
            } else {
              adjustSize(naturalSize.width, naturalSize.height);
            }
          }}
        />

        {!sizing && (
          <>
            <Pressable
              onPress={() => setLocalPause(!localPause)}
              style={[
                styles.playOverlay,
                {width: scalableWidth, height: scalableHeight},
              ]}>
              {localPause && (
                <View style={styles.playButton}>
                  <Image source={{uri: 'play'}} style={styles.palyImg} />
                </View>
              )}
            </Pressable>

            {!localPause && (
              <View style={styles.soundBtn}>
                <Pressable onPress={() => setIsMute(!isMute)}>
                  <Image
                    source={{uri: isMute ? 'unsound' : 'sound'}}
                    style={styles.img}
                  />
                </Pressable>
              </View>
            )}

            {showPercent && (
              <View
                style={[
                  styles.uploadOverlay,
                  {width: scalableWidth, height: scalableHeight},
                ]}>
                <Text style={{fontSize: 25, color: '#fff'}}>
                  {uploadPercent}
                </Text>
                <Text style={{fontSize: 25, color: '#fff'}}>uploading</Text>
              </View>
            )}
          </>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  mediaContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },

  sizingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  playbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
  },

  soundBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    zIndex: 10,
    backgroundColor: 'rgba(33,33,33,0.5)',
    borderRadius: 20,
    position: 'absolute',
    bottom: 12,
    right: 12,
  },

  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  palyImg: {
    width: 24,
    height: 24,
  },
  img: {
    width: 28,
    height: 28,
  },
});
