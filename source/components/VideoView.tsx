import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {memo, useState} from 'react';
import Video from 'react-native-video';
import colors from '../utils/colors';

interface Props {
  paused?: boolean;
  width: number;
  height: number;
  videoPoster?: string;
  videoUrl?: string;
  uploadPercent?: null | number;
}

export const VideoView = memo(
  ({
    paused = false,
    width,
    height,
    videoPoster,
    videoUrl,
    uploadPercent,
  }: Props) => {
    const [localPause, setLocalPause] = useState(false);
    const [isMute, setIsMute] = useState(true);

    const showPercent = Boolean(
      uploadPercent && uploadPercent > 0 && uploadPercent < 99,
    );

    return (
      <View style={[styles.mediaContainer, {width}]}>
        <Video
          paused={localPause || paused}
          repeat
          muted={isMute}
          posterResizeMode="cover"
          poster={videoPoster}
          style={{width, height}}
          resizeMode="cover"
          source={{uri: videoUrl}}
          ignoreSilentSwitch="ignore"
        />

        <Pressable
          onPress={() => setLocalPause(!localPause)}
          style={[styles.playOverlay, {width, height}]}>
          {localPause && (
            <Image source={{uri: 'playcircle'}} style={styles.img} />
          )}
        </Pressable>

        {!localPause && (
          <Pressable
            onPress={() => setIsMute(!isMute)}
            style={styles.muteOverlay}>
            <Image
              source={{uri: isMute ? 'plus' : 'minus'}}
              style={styles.img}
            />
          </Pressable>
        )}

        {showPercent && (
          <View style={[styles.uploadOverlay, {width, height}]}>
            <Text style={{fontSize: 25, color: '#fff'}}>{uploadPercent}</Text>
            <Text style={{fontSize: 25, color: '#fff'}}>uploading</Text>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  mediaContainer: {
    minHeight: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray100,
  },
  playOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  muteOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    zIndex: 10,
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
  img: {
    width: 40,
    height: 40,
    tintColor: colors.white,
  },
});
