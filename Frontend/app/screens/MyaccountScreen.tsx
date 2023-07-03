import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Button } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import axios from 'axios';
import { useStores } from "app/models"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface MyaccountScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Myaccount">> {}

export const MyaccountScreen: FC<MyaccountScreenProps> = observer(function MyaccountScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { apiStore } = useStores();

  const handleLogout = () => {
    apiStore.resetStore();
  }

  return (
    <Screen style={$root} preset="scroll">
      <Text text="myaccount" />
      <Button title="Logout" onPress={handleLogout} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
