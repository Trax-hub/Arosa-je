import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"

interface LoginScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Login">> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen() {
  const { apiStore } = useStores()
  const navigation = useNavigation()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleLogin = () => {
    apiStore.login(email, password)
  }

  return (
    <Screen
      style={styles.container}
      preset="scroll"
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.form}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "80%",
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#2F5E3D",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
})
