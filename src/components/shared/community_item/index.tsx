import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';
import { images } from 'common/resources/images';
import { DCLine } from '../line';

interface CommunityItemProps {
  community: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    followers: [];
    categories: [];
    tags: string[];
  };
  click?: () => void;
}

export function CommunityItem({ community, click }: CommunityItemProps) {

  // Only show elements
  const slicedCategories = community.categories.slice(0, 2);
  // Remaining elements
  const remainingCategoriesCount =
    community.categories.length - slicedCategories.length;


  return (
    <TouchableOpacity onPress={click}>
      <View style={styles.item}>
        <View style={styles.itemBody}>
          <View style={styles.itemBodyText}>
            <Text style={styles.itemTitle}>{community.title}</Text>
            <Text style={styles.itemSubtitle} numberOfLines={3}>
              {community.description}
              <Text style={{ color: theming.colors.purple }}>Details</Text>
            </Text>
          </View>

          <View style={styles.itemImage}>
            <Image source={images.itemImg} style={styles.itemImg} />
          </View>
        </View>

        <View style={styles.itemSpot}>
          <View style={styles.itemSpotRight}>
            <View style={styles.itemSpotImages}>
              {community.followers.map(userUmg => (
                <Image source={userUmg} style={styles.itemSpotImg} />
              ))}
              <Image
                source={images.defaultUser}
                style={[styles.itemSpotImg, { marginLeft: -8, zIndex: -1 }]}
              />
            </View>
            <Text style={styles.itemSpotTitle}>
              + {community.followers.length} followers
            </Text>
          </View>
        </View>

        <DCLine />

        <View style={styles.itemBottom}>
          <View style={styles.itemTags}>
            {slicedCategories.map((category, i) => (
              <View style={styles.itemTag} key={i}>
                <Text style={styles.itemTagTitle}>{category}</Text>
              </View>
            ))}
            {remainingCategoriesCount > 0 && (
              <View style={styles.itemAnotherTag}>
                <Text style={styles.itemAnotherTagTitle}>
                  +{remainingCategoriesCount}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.itemBtn}>
            <Text style={styles.itemBtnTitle}>Join</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: theming.spacing.SM,
    padding: 12,
    backgroundColor: theming.colors.white,
    marginTop: 15,
  },
  itemBody: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  itemBodyText: {
    width: '70%',
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
  itemSubtitle: {
    fontWeight: '400',
    fontSize: 14,
    color: theming.colors.gray700,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 6,
  },
  itemImage: {
    width: 80,
    height: 105,
    borderRadius: 6,
    overflow: 'hidden',
  },
  itemImg: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    resizeMode: 'cover',
  },
  itemSpot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theming.spacing.SM,
    marginTop: 10,
    marginBottom: 15,
  },
  itemSpotRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  itemSpotTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: theming.colors.gray700,
    fontFamily: theming.fonts.latoRegular,
  },
  itemSpotImages: {
    flexDirection: 'row',
    position: 'relative',
  },
  itemSpotImg: {
    width: 24,
    height: 24,
    borderRadius: 50,
    position: 'relative',
    borderWidth: 1,
    borderColor: theming.colors.white,
  },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  itemTags: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemTag: {
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  itemTagTitle: {
    color: theming.colors.purple,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
  itemAnotherTag: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: theming.colors.gray75,
  },
  itemAnotherTagTitle: {
    color: theming.colors.darkGray,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
  itemBtn: {
    backgroundColor: theming.colors.orange,
    paddingHorizontal: 26,
    paddingVertical: theming.spacing.SM,
    borderRadius: 100,
  },
  itemBtnTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: theming.colors.white,
    fontFamily: theming.fonts.latoRegular,
  },
});
