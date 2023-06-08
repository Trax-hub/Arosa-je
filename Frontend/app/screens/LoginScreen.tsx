import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { useNavigation } from "@react-navigation/native"

interface LoginScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Login">> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Pull in navigation via hook
  const navigation = useNavigation()

  const handleLogin = () => {
    // Handle your login logic here
    // If login is successful, you can navigate to another screen
    // navigation.navigate('Home')
  }

  return (
    <Screen style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Adresse mail"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: "#F8FFF8",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: '#286641',
    padding: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});
