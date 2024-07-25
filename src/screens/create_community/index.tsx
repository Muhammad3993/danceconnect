import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon } from 'components/icons/arrowLeft'
import { theming } from 'common/constants/theming'
import { CommunitiesIcon } from 'components/icons/communities'
import { DCInput } from 'components/shared/input'
import { CloseIcon } from 'components/icons/close'
import { ArrowRight } from 'components/icons/arrowRight'
import { UploadIcon } from 'components/icons/upload'
import { images } from 'common/resources/images'
import { TrashIcon } from 'components/icons/trash'
import { DCButton } from 'components/shared/button'
import { FillArrowIcon } from 'components/icons/fillArrow'

export function CreateCommunity() {
  return (
    <SafeAreaView style={styles.root}>

      <View style={styles.top}>
        <ArrowLeftIcon fill={theming.colors.textPrimary} />
        <Text style={styles.topTitle}>Create Your Community</Text>
        <CloseIcon />
      </View>

      <ScrollView style={styles.container}>

        <View style={styles.box}>
          <View style={styles.boxCircleOpacity}>
            <View style={styles.boxCircle}>
              <CommunitiesIcon active fill={"white"} />
            </View>
          </View>
          <Text style={styles.boxTitle}>Create Your Community</Text>
          <Text style={styles.boxSubtitle}>Create and share events, discuss them with your group members</Text>
        </View>

        <View style={styles.inputName}>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>Create Name</Text>
            <Text style={styles.inputNameTopLimit}>0/100</Text>
          </View>
          <DCInput
            placeholder='Name'
            inputStyle={styles.inputNameStyle}
          />
        </View>

        <View>
          <Text style={styles.inputNameTopTitle}>Choose Category <Text style={styles.bodyTitle}>can select few</Text></Text>
          <Text style={styles.bodySubtitle}>Create and share events, discuss them with your group members</Text>
          {
            false ? (
              <View style={styles.itemWrapper}>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>Salsa</Text>
                  <CloseIcon
                    width={12}
                    height={12}
                    stroke={theming.colors.orange}
                    style={{
                      position: "relative",
                      top: 1,
                    }}
                  />
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>Waltz</Text>
                  <CloseIcon
                    width={12}
                    height={12}
                    stroke={theming.colors.orange}
                    style={{
                      position: "relative",
                      top: 1,
                    }}
                  />
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>Kizomba</Text>
                  <CloseIcon
                    width={12}
                    height={12}
                    stroke={theming.colors.orange}
                    style={{
                      position: "relative",
                      top: 1,
                    }}
                  />
                </View>
              </View>
            ) : ""
          }
          <View style={true ? styles.bodyBox : styles.bodyBoxActive}>
            <View style={styles.bodyBoxTop}>
              <Text style={styles.bodyBoxTopTitle}>Social Dance</Text>
              <ArrowRight
                style={true ? { transform: [{ rotate: "90deg" }] } : ""}
              />
            </View>

            <View style={styles.bodyBoxItems}>
              <View style={true ? styles.item : styles.bodyBoxItem}>
                <Text style={true ? styles.itemTitle : styles.bodyBoxItemTitle}>Salsa</Text>
              </View>
              <View style={styles.bodyBoxItem}>
                <Text style={styles.bodyBoxItemTitle}>Bachata</Text>
              </View>
              <View style={styles.bodyBoxItem}>
                <Text style={styles.bodyBoxItemTitle}>Kizomba</Text>
              </View>
              <View style={styles.bodyBoxItem}>
                <Text style={styles.bodyBoxItemTitle}>Zouk</Text>
              </View>
            </View>

          </View>

          <View style={styles.bodyBox}>
            <View style={styles.bodyBoxTop}>
              <Text style={styles.bodyBoxTopTitle}>Ballroom Dance</Text>
              <ArrowRight />
            </View>
          </View>

          <View style={styles.bodyBox}>
            <View style={styles.bodyBoxTop}>
              <Text style={styles.bodyBoxTopTitle}>Modern Dance</Text>
              <ArrowRight />
            </View>
          </View>

          <View style={styles.bodyBox}>
            <View style={styles.bodyBoxTop}>
              <Text style={styles.bodyBoxTopTitle}>Street Dance</Text>
              <ArrowRight />
            </View>
          </View>

        </View>

        <View style={styles.inputName}>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>Create Name</Text>
            <Text style={styles.inputNameTopLimit}>0/350</Text>
          </View>
          <Text style={styles.describe}>Describe your community and add the necessary contact information</Text>
          {
            true ?
              <DCInput
                placeholder='Description'
                inputStyle={styles.inputNameStyle}
              /> :
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionTitle}>Our community created for dancers who are passionate about salsa, bachata, and kizomba. We bring together individuals from all walks of life who share a deep love for Latin music and the exhilarating art of dance.</Text>
              </View>
          }
        </View>

        <View style={styles.uploadBox}>
          <Text style={styles.inputNameTopTitle}>{false ? `Upload Cover Image` : `Add Cover Image`}<Text style={styles.bodyTitle}>(Optional)</Text></Text>
          <Text style={styles.bodySubtitle}>What picture is better to put here?</Text>
          {
            false ? (
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

        <View>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>Choose Location</Text>
          </View>
          <DCInput
            placeholder='Country'
            inputStyle={styles.inputNameStyle}
            rightIcon={<FillArrowIcon />}
          />
        </View>

        <View style={styles.city}>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>City / Province</Text>
          </View>
          <DCInput
            placeholder='City'
            inputStyle={styles.inputNameStyle}
            rightIcon={<FillArrowIcon />}
          />
        </View>

      </ScrollView>

      <View style={styles.bottom}>
        <DCButton children="Clear All" containerStyle={styles.bottomBtn} textStyle={styles.bottomTitle} />
        <DCButton children="Create  Community" containerStyle={styles.bottomBtn1} />
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
  itemWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 13,
    gap: 4,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: theming.colors.orange,
    borderRadius: 100,
    gap: 8,
  },
  itemTitle: {
    color: theming.colors.orange,
    fontWeight: "600",
    fontSize: 14,
    fontFamily: theming.fonts.latoRegular,
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
  bodyBox: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: 8,
    marginTop: 13,
    height: "auto",
  },
  bodyBoxActive: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: 8,
    marginTop: 13,
    height: 60,
    overflow: "hidden",
  },
  bodyBoxTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bodyBoxTopBtn: {
    width: 20,
    height: 20,
    backgroundColor: theming.colors.orange,
  },
  bodyBoxTopTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
  bodyBoxItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 18,
    gap: 4,
  },
  bodyBoxItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: theming.colors.darkGray,
    borderRadius: 100,
    gap: 8,
  },
  bodyBoxItemTitle: {
    color: theming.colors.darkGray,
    fontWeight: "600",
    fontSize: 14,
    fontFamily: theming.fonts.latoRegular,
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