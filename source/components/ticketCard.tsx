import React from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import {useNavigation} from '@react-navigation/native';
type props = {
  item?: any;
};
const TicketCard = (item: props) => {
  const {event, currentTicket} = item.item;
  const eventData = event[0];
  const navigation = useNavigation();
  //   console.log('ev', event[0]);
  const onPressTicket = () => {
    navigation.navigate('Ticket', currentTicket);
  };
  return (
    <RN.TouchableOpacity style={styles.container} onPress={onPressTicket}>
      {/* <RN.Image
        resizeMode="cover"
        source={
          eventData?.images?.length > 0
            ? {
                uri: 'data:image/png;base64,' + eventData?.images[0]?.base64,
              }
            : require('../assets/images/default.jpeg')
        }
        defaultSource={require('../assets/images/default.jpeg')}
        style={styles.itemImg}
      /> */}
      <RN.Text>{currentTicket?.event?.title}</RN.Text>
      <RN.Text>{`${eventData?.price} $`}</RN.Text>
    </RN.TouchableOpacity>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 14,
    // borderWidth: 1,
    // borderColor: '#E0E0E0',
    padding: 12,
    // paddingTop: 4,
    // paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 9,
  },
  itemImg: {
    width: '100%',
    height: '90%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    // marginTop: -12,
  },
});
export default TicketCard;
