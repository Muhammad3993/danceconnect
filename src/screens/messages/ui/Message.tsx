import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from 'common/resources/images';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { DCInput } from 'components/shared/input';
import { DCButton } from 'components/shared/button';
import { SendIcon } from 'components/icons/send';

export function Message() {
  const handleLinkPress = url => {
    Linking.openURL(url);
  };

  const linkify = text => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);
    const urls = parts.filter(part => urlPattern.test(part));
    const nonUrls = parts.filter(part => !urlPattern.test(part));

    return (
      <>
        {urls.map((url, index) => (
          <Text
            key={`url-${index}`}
            style={styles.link}
            onPress={() => handleLinkPress(url)}>
            {url}
          </Text>
        ))}
        <View />
        {nonUrls.map((part, index) => (
            <Text key={`part-${index}`}>{part}</Text>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.messageTop}>
        <View style={styles.messageTopLeft}>
          <ArrowLeftIcon fill={theming.colors.textPrimary} />
          <Text style={styles.messageTopTitle}>Karen Castillo</Text>
        </View>
        <View style={styles.messageTopRight}>
          <Image source={images.homeImg} style={styles.messageTopimg} />
        </View>
      </View>
      <ScrollView style={styles.messageBody}>
        {/* Messages */}
        <View style={[styles.messeage, styles.myMessage]}>
          <Text style={styles.myMessageText}>Hi there! Nice to meet you!.</Text>
          <Text style={styles.myMessageTime}>16:18</Text>
        </View>
        <View style={[styles.messeage, styles.myMessage]}>
          <Text style={styles.myMessageText}>
            Sure! We have over 150+ templates fully customizable for any project
          </Text>
          <Text style={styles.myMessageTime}>16:18</Text>
        </View>
        <View style={[styles.messeage, styles.anotherMessage]}>
          <Text style={styles.anotherMessageText}>
            Can you tell me more about your Webflow Templates?
          </Text>
          <Text style={styles.anotherMessageTime}>16:18</Text>
        </View>
        {/* Date */}
        <View style={styles.messageDate}>
          <View style={styles.messageDateLine} />
          <Text style={styles.messageDateTitle}>Date?Today</Text>
          <View style={styles.messageDateLine} />
        </View>
        {/* Messages */}
        <View style={[styles.messeage, styles.myMessage]}>
          <Text style={styles.myMessageText}>
            Sure! We have over 150+ templates fully customizable for any project
          </Text>
          <Text style={styles.myMessageTime}>16:18</Text>
        </View>
        <View style={[styles.messeage, styles.anotherMessage]}>
          <Text style={styles.anotherMessageText}>Do you have a website?</Text>
          <Text style={styles.anotherMessageTime}>16:18</Text>
        </View>
        <View style={[styles.messeage, styles.myMessage]}>
          <Text style={styles.myMessageText}>
            Yes, here’s the link to it 🙋🏻‍♂️
          </Text>
          <Text style={styles.myMessageTime}>16:18</Text>
        </View>
        <View style={[styles.messeage, styles.myMessage]}>
          <Text style={styles.myMessageText}>
            {linkify('Yes, here’s the link to it 🙋🏻‍♂️ https://www.example.com csahbcdshjccsdhcbdsvhdfjcndsuhvbndhufnvjhdsnvudfnvfdsjvnhj')}
          </Text>
          <Text style={styles.myMessageTime}>16:18</Text>
        </View>
      </ScrollView>
      <View style={styles.messageBottom}>
        <DCInput
          placeholder="Message"
          containerStyle={{
            width: '85%',
            height: 44,
            flex: 1,
          }}
          inputStyle={{
            padding: 0,
            paddingHorizontal: theming.spacing.MD,
            borderColor: theming.colors.gray50,
          }}
        />
        <DCButton
          children={<SendIcon />}
          containerStyle={{
            width: 44,
            height: 44,
            borderRadius: theming.spacing.SM,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  messageTop: {
    height: 48,
    paddingHorizontal: theming.spacing.LG,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theming.colors.gray75,
  },
  messageTopTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
  messageTopLeft: {
    flexDirection: 'row',
    gap: theming.spacing.MD,
  },
  messageTopRight: {
    width: 40,
    height: 40,
  },
  messageTopimg: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  messageBottom: {
    borderTopWidth: 1,
    borderColor: theming.colors.gray75,
    paddingHorizontal: theming.spacing.LG,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  messageBody: {
    flex: 1,
    paddingHorizontal: theming.spacing.LG,
    flexDirection: 'column-reverse',
  },
  messeage: {
    maxWidth: '80%',
    backgroundColor: theming.colors.purple,
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  anotherMessage: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
    backgroundColor: theming.colors.gray50,
  },
  myMessageText: {
    lineHeight: 22,
    fontSize: 16,
    fontWeight: '400',
    color: theming.colors.white,
  },
  anotherMessageText: {
    lineHeight: 22,
    fontSize: 16,
    fontWeight: '400',
    color: theming.colors.black,
  },
  myMessageTime: {
    fontSize: 12,
    fontWeight: '400',
    color: theming.colors.secondary300,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  anotherMessageTime: {
    fontSize: 12,
    fontWeight: '400',
    color: theming.colors.gray400,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  messageDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theming.spacing.SM,
    marginVertical: 15,
  },
  messageDateTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theming.colors.textSecondary,
  },
  messageDateLine: {
    width: '100%',
    height: 1,
    backgroundColor: theming.colors.gray50,
    marginVertical: 5,
    flex: 1,
  },
  link: {
    color: theming.colors.orange,
    textDecorationLine: 'underline',
  },
});
