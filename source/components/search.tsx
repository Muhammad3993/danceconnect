import React from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import {isAndroid} from '../utils/constants';

type searchProps = {
  onSearch: (value: string) => void;
  searchValue: string;
  placeholder: string;
  onPressAdd?: () => void;
  visibleAddBtn?: boolean;
  autoFocus?: boolean;
};
const Search = ({
  onPressAdd,
  onSearch,
  searchValue,
  placeholder,
  visibleAddBtn = true,
  autoFocus = false,
}: searchProps) => {
  const addButton = () => {
    return (
      <RN.View style={{justifyContent: 'center'}}>
        <RN.TouchableOpacity
          onPress={onPressAdd}
          style={styles.buttonContainer}>
          <RN.Image source={{uri: 'plus'}} style={{height: 15, width: 15}} />
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const searchIcon = () => {
    return (
      <RN.Image
        source={{uri: 'search'}}
        style={{height: 20, width: 20, position: 'absolute', left: 6, top: 12}}
      />
    );
  };
  return (
    <RN.View style={styles.container}>
      <RN.TextInput
        value={searchValue}
        onChangeText={onSearch}
        placeholder={placeholder}
        style={[styles.inputContainer, {width: visibleAddBtn ? '86%' : '100%'}]}
        inlineImageLeft="search"
        inlineImagePadding={20}
        placeholderTextColor={colors.darkGray}
        autoFocus={autoFocus}
      />
      {!isAndroid && searchIcon()}
      {visibleAddBtn && addButton()}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    margin: 20,
    marginHorizontal: 0,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.lightGray,
    paddingLeft: isAndroid ? 10 : 30,
    paddingVertical: isAndroid ? 10 : 14,
    color: colors.textPrimary,
    borderRadius: 8,
    tintColor: colors.gray,
  },
  buttonContainer: {
    backgroundColor: colors.purple,
    padding: 12,
    marginLeft: 8,
    borderRadius: 50,
    justifyContent: 'center',
  },
});
export default Search;
