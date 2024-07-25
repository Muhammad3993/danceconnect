import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon } from 'components/icons/arrowLeft'
import { theming } from 'common/constants/theming'
import { CommunitiesIcon } from 'components/icons/communities'
import { DCInput } from 'components/shared/input'
import { CloseIcon } from 'components/icons/close'
import { UploadIcon } from 'components/icons/upload'
import { images } from 'common/resources/images'
import { TrashIcon } from 'components/icons/trash'
import { DCButton } from 'components/shared/button'
import CategorySelector from 'components/category_selector'
import LocationSelector from 'components/location_selector'
import { t } from 'i18next'

export function CreateCommunity() {

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryError, setCategoryError] = useState('');

  return (
    <SafeAreaView style={styles.root}>

      <View style={styles.top}>
        <ArrowLeftIcon fill={theming.colors.textPrimary} />
        <Text style={styles.topTitle}>{t("create_community_card_title")}</Text>
        <CloseIcon />
      </View>

      <ScrollView>

        <View style={styles.container}>
          <View style={styles.box}>
            <View style={styles.boxCircleOpacity}>
              <View style={styles.boxCircle}>
                <CommunitiesIcon active fill={"white"} />
              </View>
            </View>
            <Text style={styles.boxTitle}>{t("create_community_card_title")}</Text>
            <Text style={styles.boxSubtitle}>{t("ds_desc_event")}</Text>
          </View>
        </View>

        <View style={styles.inputName}>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>{t("create_name")}</Text>
            <Text style={styles.inputNameTopLimit}>0/100</Text>
          </View>
          <DCInput
            placeholder={t("name")}
            inputStyle={styles.inputNameStyle}
          />
        </View>

        <View>
          <View style={[styles.container, { marginBottom: 15 }]}>
            <Text style={styles.inputNameTopTitle}>{t("choose_category_title")} <Text style={styles.bodyTitle}>{t("few")}</Text></Text>
            <Text style={styles.bodySubtitle}>{t("ds_desc_event")}</Text>
          </View>
          <CategorySelector
            value={selectedCategories}
            onChange={setSelectedCategories}
            errorMessage={categoryError}
          />
        </View>

        <View style={styles.inputName}>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>{t("description_title")}</Text>
            <Text style={styles.inputNameTopLimit}>0/350</Text>
          </View>
          <Text style={styles.describe}>{t("description_desc")}</Text>
          {
            true ?
              <DCInput
                placeholder={t("description")}
                inputStyle={styles.inputNameStyle}
              /> :
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionTitle}>Our community created for dancers who are passionate about salsa, bachata, and kizomba. We bring together individuals from all walks of life who share a deep love for Latin music and the exhilarating art of dance.</Text>
              </View>
          }
        </View>

        <View style={styles.uploadBox}>
          <Text style={styles.inputNameTopTitle}>{false ? t("upload_img_title") : `Add Cover Image`}<Text style={styles.bodyTitle}>{t("optional")}</Text></Text>
          <Text style={styles.bodySubtitle}>{t("upload_img_desc")}</Text>
          {
            true ? (
              <TouchableOpacity style={styles.upload}>
                <UploadIcon />
                <Text style={styles.uploadTitle}>Upload picture</Text>
              </TouchableOpacity>
            ) :
              <View style={styles.images}>
                <View style={styles.image}>
                  <Image
                    source={images.homeImg1}
                    style={styles.img}
                  />
                  <TouchableOpacity style={styles.imageTrash}>
                    <TrashIcon stroke={theming.colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
          }
        </View>

        <View style={[styles.container, { marginBottom: 15 }]}>
          <LocationSelector />
        </View>

      </ScrollView>

      <View style={styles.bottom}>
        <DCButton children={t("clear")} containerStyle={styles.bottomBtn} textStyle={styles.bottomTitle} />
        <DCButton children={t("create_community")} containerStyle={styles.bottomBtn1} />
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  top: {
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theming.spacing.LG,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theming.colors.black,
    fontFamily: theming.fonts.latoRegular
  },
  container: {
    paddingHorizontal: theming.spacing.LG,
  },
  box: {
    backgroundColor: theming.colors.transparentPurple,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  boxCircleOpacity: {
    width: 66,
    height: 66,
    backgroundColor: theming.colors.lightPurple1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  boxCircle: {
    width: 46,
    height: 46,
    backgroundColor: theming.colors.purple,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  boxTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theming.colors.black,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 5,
  },
  boxSubtitle: {
    width: "90%",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
    marginBottom: 10,
    marginTop: 5,
    textAlign: "center",
  },
  inputName: {
    marginVertical: theming.spacing.LG,
    paddingHorizontal: theming.spacing.LG
  },
  inputNameTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  inputNameTopTitle: {
    color: theming.colors.black,
    fontWeight: "700",
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular
  },
  inputNameTopLimit: {
    color: theming.colors.darkGray,
    fontSize: 14,
    fontWeight: "400",
    fontFamily: theming.fonts.latoRegular
  },
  inputNameStyle: {
    padding: 0,
    paddingHorizontal: 16,
    height: 56,
    borderColor: theming.colors.gray50,
    flexDirection: "row",
    alignItems: "center",
    width: "100%"
  },
  bodyTitle: {
    fontWeight: "400",
    fontSize: 16,
    color: theming.colors.darkGray,
    fontFamily: theming.fonts.latoRegular,
  },
  bodySubtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 5,
  },
  describe: {
    fontSize: 16,
    fontWeight: "400",
    color: theming.colors.gray700,
    fontFamily: theming.fonts.latoRegular,
    marginBottom: 15,
  },
  descriptionBox: {
    borderWidth: 1,
    borderColor: theming.colors.gray50,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 17,
    backgroundColor: theming.colors.lightGray
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: theming.colors.gray800,
    fontFamily: theming.fonts.latoRegular,
  },
  upload: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theming.colors.secondary200,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 15
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.purple,
  },
  uploadBox: {
    marginBottom: 30,
    paddingHorizontal: theming.spacing.LG
  },
  image: {
    width: 177,
    height: 141,
    position: "relative",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageTrash: {
    width: 40,
    height: 40,
    backgroundColor: theming.colors.brown,
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  images: {
    marginTop: 20,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: theming.colors.gray75,
    paddingHorizontal: theming.spacing.LG,
    paddingTop: 16,
    paddingBottom: 36,
  },
  bottomBtn: {
    width: "49%",
    height: 58,
    backgroundColor: theming.colors.white,
    borderWidth: 1,
    borderColor: theming.colors.purple,
  },
  bottomBtn1: {
    width: "49%",
    height: 58,
  },
  bottomTitle: {
    color: theming.colors.purple,
    fontWeight: "700",
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
  },
  city: {
    marginVertical: 30,
  }
})