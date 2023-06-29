import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackScreenProps } from 'app/navigators';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {useAuth0, Auth0Provider} from 'react-native-auth0';


interface LoginScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Login">> {} 
const Home = () => {
  const {authorize, clearSession, user, error, getCredentials} = useAuth0();

  const onLogin = async () => {
    try {
      await authorize({scope: 'openid profile email'}, {customScheme: 'auth0.com.auth0samples'});
      let credentials = await getCredentials();
      Alert.alert('AccessToken: ' + credentials.accessToken);
    } catch (e) {
      console.log(e);
    }
  };

  const loggedIn = user !== undefined && user !== null;

  const onLogout = async () => {
    try {
      await clearSession({customScheme: 'auth0.com.auth0samples'});
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Auth0Sample - Login </Text>
      {user && <Text>You are logged in as {user.name}</Text>}
      {!user && <Text>You are not logged in</Text>}
      {error && <Text>{error.message}</Text>}
      <Button
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? 'Log Out' : 'Log In'}
      />
    </View>
  );
};

export const LoginScreen: FC<LoginScreenProps> = observer(function CommentsScreen() {

  return (
    <Auth0Provider domain={"dev-swankylwozi6yh0f.us.auth0.com"} clientId={"SMPtSVWbLv9pyaP5b0ObYgII7YMdtZZO"}>
      <Home />
    </Auth0Provider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

