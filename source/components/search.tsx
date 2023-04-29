import React from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';

type searchProps = {
  onSearch: (value: string) => void;
  searchValue: string;
  placeholder: string;
  onPressAdd: () => void;
};
const Search = ({
  onPressAdd,
  onSearch,
  searchValue,
  placeholder,
}: searchProps) => {
  const addButton = () => {
    return (
      <RN.TouchableOpacity onPress={onPressAdd} style={styles.buttonContainer}>
        <RN.Image source={{uri: 'plus'}} style={{height: 26, width: 28}} />
      </RN.TouchableOpacity>
    );
  };
  return (
    <RN.View style={styles.container}>
      <RN.TextInput
        value={searchValue}
        onChangeText={onSearch}
        placeholder={placeholder}
        style={styles.inputContainer}
        inlineImageLeft="search"
        inlineImagePadding={20}
        placeholderTextColor={colors.darkGray}
      />
      {addButton()}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginHorizontal: 0,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.lightGray,
    paddingLeft: 10,
    paddingVertical: 10,
    width: '80%',
    color: colors.textPrimary,
    borderRadius: 8,
    tintColor: colors.gray,
  },
  buttonContainer: {
    backgroundColor: colors.purple,
    padding: 10,
    borderRadius: 50,
  },
});
export default Search;
