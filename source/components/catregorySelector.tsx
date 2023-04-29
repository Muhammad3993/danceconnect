import React, {useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';

interface itemProp {
  title: string;
  id: number;
  items: string[];
}
type selectopProps = {
  data: itemProp[];
  onChoosheDanceStyle: (value: string) => void;
  addedStyles: string[];
};
const keyExtractor = (item: string, index: number) => index;

const CategorySelector = ({
  data,
  onChoosheDanceStyle,
  addedStyles,
}: selectopProps) => {
  //   console.log(data);
  const [currentIndex, setCurrentIndex] = useState(null);
  const onSelectItem = (key: React.SetStateAction<null>) => {
    setCurrentIndex(key === currentIndex ? null : key);
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  };
  const renderStyles = (items: any[]) => {
    return (
      <>
        {items?.map(
          (
            item: {
              name: string;
            },
            index: React.Key | null | undefined,
          ) => {
            const isAvailable = addedStyles?.includes(item.name);
            return (
              <RN.TouchableOpacity
                key={index}
                style={styles.danceStyleItem}
                activeOpacity={0.7}
                onPress={() => onChoosheDanceStyle(item.name)}>
                <RN.Text
                  style={[
                    styles.danceStyleText,
                    {
                      color: isAvailable ? colors.orange : colors.darkGray,
                    },
                  ]}>
                  {item?.name}
                </RN.Text>
              </RN.TouchableOpacity>
            );
          },
        )}
      </>
    );
  };
  const renderItem = ({title, id, items}: itemProp) => {
    const rotateIcon = {
      transform: [{rotate: id === currentIndex ? '270deg' : '180deg'}],
    };
    // 270 down 180 left
    const key = keyExtractor(title, id);
    return (
      <RN.View style={styles.itemContainer}>
        <RN.TouchableOpacity
          style={styles.titleWrapper}
          onPress={() => onSelectItem(key)}
          activeOpacity={0.7}>
          <RN.Text style={styles.itemTitle}>{title}</RN.Text>
          <RN.View style={styles.rightIconWrapper}>
            <RN.Animated.Image
              source={{uri: 'backicon'}}
              style={[styles.rightIcon, rotateIcon]}
            />
          </RN.View>
        </RN.TouchableOpacity>
        {id === currentIndex && (
          <RN.Animated.View style={styles.animatedBody}>
            {renderStyles(items)}
          </RN.Animated.View>
        )}
      </RN.View>
    );
  };
  return (
    <RN.View style={styles.mainContainer}>
      <RN.FlatList
        data={data}
        renderItem={({item}) => renderItem(item)}
        keyExtractor={(item, index) => `${item}-${index}`}
      />
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 32,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    marginBottom: 12,
    paddingVertical: 20,
    paddingLeft: 16,
    paddingRight: 20,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '700',
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightIcon: {
    height: 15,
    width: 15,
    tintColor: colors.white,
  },
  rightIconWrapper: {
    backgroundColor: colors.orange,
    padding: 2,
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  animatedBody: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 16,
    maxWidth: 380,
    height: undefined,
  },
  danceStyleItem: {
    borderWidth: 1,
    borderColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 4,
    marginBottom: 8,
  },
  danceStyleText: {
    fontSize: 14,
    lineHeight: 14.9,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
export default CategorySelector;
