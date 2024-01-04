/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import useTickets from '../hooks/useTickets';
import {useTranslation} from 'react-i18next';
type props = {
  ticket: any;
  ticketCard?: boolean;
};
const QuantityTicketValue = ({ticket, ticketCard}: props) => {
  const {addToBasket, currentQuantity, resetQuantity} = useTickets();

  const {t} = useTranslation();
  if (ticketCard) {
    return (
      <RN.View style={styles.quantityWrapper} key={ticket?.id}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={[styles.quantityText, {paddingVertical: 4}]}>
            Quantity
          </RN.Text>
        </RN.View>
        <RN.Text
          style={[
            styles.quantityText,
            {padding: 4, color: colors.textPrimary, fontSize: 16},
          ]}>
          {ticket.quantity}
        </RN.Text>
      </RN.View>
    );
  }
  return (
    <RN.View style={styles.quantityWrapper} key={ticket?.id}>
      <RN.View style={{justifyContent: 'center'}}>
        <RN.Text style={styles.quantityText}>{t('quantity')}</RN.Text>
      </RN.View>
      <RN.View style={{flexDirection: 'row'}}>
        <RN.TouchableOpacity
          style={styles.increaseBtn}
          onPress={() => {
            if (currentQuantity(ticket) === 0) {
              return;
            } else {
              resetQuantity(ticket);
            }
          }}>
          <RN.Image source={{uri: 'minus'}} style={styles.increaseIcon} />
        </RN.TouchableOpacity>
        <RN.View style={{justifyContent: 'center', marginHorizontal: 12}}>
          <RN.Text style={styles.count}>{currentQuantity(ticket)}</RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          disabled={
            currentQuantity(ticket) === ticket?.quantity - ticket.items.length
          }
          style={styles.increaseBtn}
          onPress={() => {
            if (
              currentQuantity(ticket) ===
              ticket?.quantity - ticket.items.length
            ) {
              return;
            } else {
              addToBasket(ticket);
            }
          }}>
          <RN.Image
            source={{uri: 'plus'}}
            style={[
              styles.increaseIcon,
              {
                tintColor:
                  currentQuantity(ticket) ===
                  ticket?.quantity - ticket.items.length
                    ? colors.gray
                    : colors.orange,
              },
            ]}
          />
        </RN.TouchableOpacity>
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  quantityText: {
    fontSize: 14,
    lineHeight: 18.9,
    color: colors.darkGray,
    fontWeight: '400',
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  increaseIcon: {
    height: 16,
    width: 16,
    tintColor: colors.orange,
  },
  quantityWrapper: {
    borderTopWidth: 1,
    borderColor: colors.gray,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  increaseBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
  },
});

export default QuantityTicketValue;
