import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {validateEmail} from '../../utils/helpers';
import {Input} from '../../components/input';
import {Button} from '../../components/Button';
import {isAndroid, statusBarHeight} from '../../utils/constants';
import {
  addManagerToCommunity,
  apiUrl,
  deleteManagerToCommunity,
  getManagersForCommunityUid,
} from '../../api/serverRequests';
const Managers = () => {
  const navigation = useNavigation();
  const props = useRoute();
  const communityUid = props?.params.id;
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState(false);
  const [members, setMembers] = useState<any>([]);
  const [error, setError] = useState('');
  const [isVisibleBtn, setVisibleBtn] = useState(false);

  const onBack = () => navigation.goBack();
  const confirmBtn = () => {
    if (validateEmail(email)) {
      addMember();
    } else {
      setErrorEmail(true);
    }
  };

  const getManagers = () => {
    getManagersForCommunityUid(communityUid).then(response => {
      setMembers(response);
    });
  };
  useEffect(() => {
    getManagers();
  }, []);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  }, [error]);
  const addMember = () => {
    addManagerToCommunity(communityUid, email)
      .then(res => {
        getManagers();
      })
      .catch(er => {
        const errorMessage = er.response?.data?.message;
        setError(errorMessage);
        setVisibleBtn(false);
      });
    setEmail('');
    setErrorEmail(false);
  };
  const onPressRemoveManager = (emailMG: string) => {
    deleteManagerToCommunity(communityUid, emailMG)
      .then(res => {
        getManagers();
      })
      .catch(er => {
        const errorMessage = er.response?.data?.message;
        setError(errorMessage);
        setVisibleBtn(false);
      });
  };
  const renderHeader = () => {
    return (
      <RN.TouchableOpacity onPress={onBack} style={styles.headerContainer}>
        <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        <RN.Text style={styles.backTitle}>Managers</RN.Text>
      </RN.TouchableOpacity>
    );
  };
  const renderFooter = () => {
    return (
      <RN.View style={styles.footerWrapper}>
        <Button
          title="Save"
          disabled
          buttonStyle={styles.createBtn}
          onPress={confirmBtn}
        />
      </RN.View>
    );
  };
  return (
    <>
      {renderHeader()}
      <RN.View style={styles.inputContainer}>
        <Input
          value={email.toLowerCase()}
          onChange={(v: string) => {
            setEmail(v);
            setErrorEmail(false);
            if (v.length > 0) {
              setVisibleBtn(true);
            } else {
              setVisibleBtn(false);
            }
          }}
          placeholder="Email"
          isErrorBorder={errorEmail}
          keyboardType="email-address"
          iconName="inbox"
          onFocusInput={() => setErrorEmail(false)}
        />
        {error?.length > 0 && (
          <RN.Text style={styles.errorText}>{error}</RN.Text>
        )}
      </RN.View>
      <RN.ScrollView style={[styles.container, {paddingTop: 14}]}>
        {members?.length > 0 &&
          members.map(i => {
            return (
              <RN.View style={styles.memberContainer} key={i.id}>
                <RN.View style={{flexDirection: 'row'}}>
                  <RN.View style={styles.memberImgContainer}>
                    <RN.Image
                      source={{
                        uri: i.userImage
                          ? apiUrl + i.userImage
                          : 'profileoutline',
                      }}
                      style={
                        i.userImage ? styles.memberImg : styles.memberImgNone
                      }
                    />
                  </RN.View>
                  <RN.View style={{justifyContent: 'center', paddingLeft: 8}}>
                    <RN.Text>{i.userName}</RN.Text>
                    <RN.Text>{i.email}</RN.Text>
                  </RN.View>
                </RN.View>
                <RN.TouchableOpacity
                  onPress={() => onPressRemoveManager(i.email)}
                  style={styles.memberDeleteBtn}>
                  <RN.Text style={styles.memberDeleteText}>remove</RN.Text>
                </RN.TouchableOpacity>
              </RN.View>
            );
          })}
        <RN.View style={{paddingBottom: 40}} />
      </RN.ScrollView>
      {isVisibleBtn && renderFooter()}
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  errorText: {
    color: colors.redError,
    textAlign: 'center',
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    paddingVertical: 14,
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
  },
  memberImgContainer: {
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  memberImg: {
    height: 34,
    width: 34,
    borderRadius: 100,
  },
  memberImgNone: {
    height: 10,
    width: 10,
    tintColor: colors.textPrimary,
    padding: 16,
  },
  memberDeleteBtn: {
    borderWidth: 1,
    borderRadius: 100,
    borderColor: colors.orange,
    justifyContent: 'center',
  },
  memberDeleteText: {
    color: colors.orange,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  inputContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
    padding: 14,
    paddingHorizontal: 24,
    paddingTop: statusBarHeight + 14,
    backgroundColor: colors.white,
  },
  backIcon: {
    height: 20,
    width: 24,
  },
  backTitle: {
    fontSize: 22,
    color: colors.textPrimary,
    lineHeight: 24.4,
    fontWeight: '600',
    paddingLeft: 24,
    fontFamily: 'Mulish-Regular',
  },
  createBtn: {
    marginVertical: 14,
  },
  footerWrapper: {
    paddingHorizontal: 14,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    backgroundColor: colors.white,
    paddingBottom: isAndroid ? 0 : 8,
  },
});

export default Managers;
