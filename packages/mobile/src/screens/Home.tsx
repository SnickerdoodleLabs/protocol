import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import React, {memo, useEffect} from 'react';
import {ROUTES} from '../constants';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {MotiView} from '@motify/components';
import {Easing} from 'react-native-reanimated';
import {MobileCore} from '../services/Gateway';
import {
  AccountAddress,
  EChain,
  LanguageCode,
  Signature,
} from '@snickerdoodlelabs/objects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MemoryVolatileStorage} from '@snickerdoodlelabs/persistence';
import {AppCtx} from '../context/AppContextProvider';
import AppLoader from '../components/AnimatedLoaders/UnlockLoader';
import {utils} from 'ethers';

export default function Home(props: any) {
  const {navigation} = props;
  const connector = useWalletConnect();
  const [accountAddress, setAccountAddress] = React.useState<string[]>();
  const [signature, setSignature] = React.useState();
  const {mobileCore, initConnection, getUnlockMessage} =
    React.useContext(AppCtx);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUnlock = async () => {
    if (connector.accounts[0]) {
      signApp();
    } else {
      const {accounts, chainId} = await connector.connect();
      setAccountAddress(accounts);
    }
  };

  const signApp = async () => {
    try {
      const result = await connector.signPersonalMessage([
        'Login to your Snickerdoodle data wallet',
      ]);
      console.log('sign', result);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate(ROUTES.WALLET);
        setTimeout(() => {
          //  initConnection();
        }, 500);
      }, 4200);
    } catch (err) {
      console.log('ERROR');
      console.log({err});
    }
  };

  return (
    <>
      <View style={{backgroundColor: '#222039', height: '100%'}}>
        <View>
          <SafeAreaView>
            <TouchableOpacity
              onPress={() => {
                connector.killSession();
              }}>
              <View style={{paddingTop: 50}}>
                <Image
                  source={require('../assets/images/homeBG.png')}
                  style={{height: 460, width: 'auto'}}
                />
              </View>
            </TouchableOpacity>
            {/*   <Text
              onPress={() => {
                mobileCore.isDataWalletAddressInitialized().then(res => {
                  console.log('isDataWalletInitialized', res);
                });
              }}>
              isDWInitiliazed
            </Text>
            <Text onPress={getAcc}>getACC</Text>
            <Text onPress={importData}>AsyncStorage</Text>
            <Text
              onPress={() => {
                navigation.navigate(ROUTES.WALLET);
              }}>
              Navigate
            </Text> */}
            <Text
              onPress={() => {
                initConnection();
              }}>
              Test
            </Text>
            <View style={{paddingTop: 100}}>
              <View
                style={[styles.walletConnectBtn, styles.walletConnectMainBtn]}>
                {[...Array(3).keys()].map(index => {
                  return (
                    <MotiView
                      from={{opacity: 0.7, scale: 1}}
                      key={index}
                      animate={{opacity: 0, scale: 1.5}}
                      transition={{
                        type: 'timing',
                        duration: 2400,
                        easing: Easing.out(Easing.ease),
                        delay: index * 600,

                        loop: true,
                      }}
                      style={[
                        StyleSheet.absoluteFillObject,
                        styles.walletConnectBtn,
                      ]}
                    />
                  );
                })}
                <TouchableOpacity
                  style={styles.walletConnectBtn}
                  onPress={handleUnlock}>
                  <View
                    style={{
                      flexDirection: 'column',
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{color: 'white', fontSize: 20, fontWeight: '600'}}>
                      Connect Wallet
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
      {isLoading && <AppLoader />}
    </>
  );
}

const styles = StyleSheet.create({
  walletConnectBtn: {
    backgroundColor: 'orange',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#8079B4',
    width: 280,
    height: 65,
    borderRadius: 60,
    alignItems: 'center',
    /*     borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 30,
    marginBottom: 30,
    paddingTop: 5, */
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  walletConnectMainBtn: {
    backgroundColor: 'orange',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#8079B4',
    width: 280,
    height: 65,
    borderRadius: 60,
    alignItems: 'center',
    /*     borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 30,
    marginBottom: 30,
    paddingTop: 5, */
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
