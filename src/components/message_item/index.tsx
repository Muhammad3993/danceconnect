import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { images } from 'common/resources/images'
import { theming } from 'common/constants/theming'

interface MessageItemProps {
    active?: boolean;
}

export const MessageItem = ({ active }: MessageItemProps) => {
    return (
        <View style={styles.messageItem}>
            <View style={styles.messageItemImage}>
                <Image
                    source={images.homeImg1}
                    style={styles.messageItemImg}
                />
            </View>
            <View style={styles.messageItemRight}>
                <View style={styles.messageItemData}>
                    <Text style={styles.messageItemTitle}>Karen Castillo</Text>
                    <Text style={styles.messageItemSubtitle}>You: What’s man!</Text>
                </View>
                {
                    active ? (
                        <Text style={styles.messageItemTime}>20:49 PM</Text>
                    ) : ""
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    messageItem: {
        width: "100%",
        height: 65,
        flexDirection: "row",
        gap: 20
    },
    messageItemImage: {
        width: 56,
        height: 56,
    },
    messageItemImg: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
        objectFit: "cover",
    },
    messageItemRight: {
        width: "78%",
        height: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: theming.colors.gray50
    },
    messageItemData: {
        height: "100%",
        gap: 7,
    },
    messageItemTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: theming.colors.black,
        fontFamily: theming.fonts.latoRegular,
    },
    messageItemSubtitle: {
        fontSize: 14,
        fontWeight: "500",
        color: theming.colors.gray700,
        fontFamily: theming.fonts.latoRegular,
    },
    messageItemTime: {
        fontSize: 12,
        fontWeight: "400",
        color: theming.colors.gray700,
        fontFamily: theming.fonts.latoRegular,
        position: "relative",
        top: 6,
    },
})