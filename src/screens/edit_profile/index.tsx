import React, { useState } from 'react';
// import react-native
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import component
import { DCInput } from 'components/shared/input';
import { DCButton } from 'components/shared/button';
// import theming
import { theming } from 'common/constants/theming';
// import images
import { images } from 'common/resources/images';
// import icons
import { ArrowLeft } from 'components/icons/arrowLeft';
import { EditIcon } from 'components/icons/edit';
import { MailIcon } from 'components/icons/mail';
// dropdown
import DropDownPicker from 'react-native-dropdown-picker';
import { FillArrow } from 'components/icons/fillArrow';

export function EditProfileScreen() {

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [items, setItems] = useState([
    { label: 'male', value: 0 },
    { label: 'female', value: 1 },
    { label: 'nonbinary', value: 2 },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.editProfile}>
        <View style={styles.editTop}>

          <View style={styles.editBack}>
            <ArrowLeft fill={theming.colors.textPrimary} />
            <Text style={styles.backTitle}>Edit profile</Text>
          </View>

          <View style={styles.editAvatar}>
            <View style={styles.editAvatarView}>
              <Image
                style={styles.editImage}
                source={images.editProfile}
              />
              <EditIcon style={styles.editIcon} />
            </View>
          </View>

          <View style={styles.editForm}>
            <DCInput 
              inputStyle={{
                height: 56, 
                backgroundColor: theming.colors.lightGray, 
                padding: 0, 
                paddingHorizontal: theming.spacing.MD,
                borderColor: theming.colors.grayM
              }} 
              value='Andrew Ainsley'
            />
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder=""
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropDownContainer}
              showArrowIcon={true}
              showTickIcon={false}
              modalContentContainerStyle={{
                borderWidth: 1,
                borderColor: theming.colors.gray
              }}
              textStyle={{
                textTransform: "capitalize",
                fontSize: 16
              }}
              ArrowDownIconComponent={() => <FillArrow  />}
              ArrowUpIconComponent={() => <FillArrow style={{transform: [{ rotate: '180deg' }]}} />}
            />
            <DCInput 
              inputStyle={{
                height: 56, 
                backgroundColor: 
                theming.colors.lightGray, 
                padding: 0, 
                paddingHorizontal: theming.spacing.MD,
                borderColor: theming.colors.grayM
              }} 
              value='andrew_ainsley@yourdomain.com'
              rightIcon={<MailIcon style={{margin: "auto"}} />}
            />
          </View>

        </View>

        <DCButton
          title='Save' 
          containerStyle={{
            backgroundColor: theming.colors.orange, 
            borderWidth: 0, 
            width: "100%"
          }}
          textStyle={{
            color: theming.colors.white, 
            fontWeight: "700",
            fontFamily: theming.fonts.latoRegular
          }}
        />
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theming.spacing.LG,
    backgroundColor: theming.colors.white,
  },
  editProfile: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: theming.spacing.LG,
  },
  editTop: {
    alignItems: 'center',
  },
  editBack: {
    width: '100%',
    // height: 48,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  backTitle: {
    fontSize: 20,
    color: theming.colors.textPrimary,
    fontWeight: "700",
    fontFamily: theming.fonts.latoRegular
  },
  editAvatar: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingVertical: theming.spacing.LG,
  },
  editAvatarView: {
    width: "41%",
    height: 140,
  },
  editImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  editForm: {
    width: "100%",
    gap: theming.spacing.MD
  },
  dropdown: {
    width: "100%",
    height: 56,
    backgroundColor: theming.colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: theming.spacing.MD,
    borderWidth: 1,
    borderColor: theming.colors.grayM,
  },
  dropDownContainer: {
    backgroundColor: theming.colors.lightGray,
    borderWidth: 1,
    borderColor: theming.colors.grayM,
  }
});