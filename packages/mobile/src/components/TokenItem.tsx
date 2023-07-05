import React from 'react';
import {View, Image, Text} from 'react-native';
import {ethers} from 'ethers';

export const TokenItem = ({token}: any) => {
  return (
    <View>
      <View style={{alignItems: 'center', paddingTop: 20}}>
        <View
          style={{
            backgroundColor: '#252525',
            width: '95%',
            borderRadius: 50,
            height: 80,
            paddingLeft: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 10,
              }}>
              <Image
                source={{
                  uri:
                    token?.contract_ticker_symbol === 'AVAX'
                      ? 'https://www.covalenthq.com/static/images/icons/display-icons/avalanche-avax-logo.png'
                      : token?.logo_url,
                }}
                style={{width: 60, height: 60}}
              />
              <View style={{paddingLeft: 10}}>
                <Text style={{color: 'white', fontSize: 15}}>
                  {token?.contract_ticker_symbol}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 10,
              }}>
              <View style={{paddingRight: 20}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 15,
                    alignSelf: 'flex-end',
                  }}>
                  {token?.native_token
                    ? `${ethers.utils.formatUnits(token?.balance)}`
                    : token?.quote > 0
                    ? `${
                        token?.balance.substr(0, token?.balance.length - 6) +
                        ',' +
                        token?.balance.substr(-6)
                      }`
                    : '0.0'}
                </Text>
                <Text
                  style={{
                    color: '#4F896D',
                    fontSize: 15,
                    paddingTop: 10,
                    alignSelf: 'flex-end',
                  }}>
                  ${token?.quote}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
