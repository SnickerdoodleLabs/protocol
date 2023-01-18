import {View, Text} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';

export type ParamList = {
  Params: {
    userID: string;
    NFTs: string[];
  };
};

export default function ForgotPassword() {
  const route = useRoute<RouteProp<ParamList, 'Params'>>();
  return (
    <View>
      <Text>ForgotPassword</Text>
      <Text>{route?.params?.userID} </Text>
    </View>
  );
}
