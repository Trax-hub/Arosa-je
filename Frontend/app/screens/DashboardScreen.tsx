import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { useStores } from "app/models"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface DashboardScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Dashboard">> {}

export const DashboardScreen: FC<DashboardScreenProps> = observer(function DashboardScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { apiStore } = useStores()

  useEffect(() => {
    apiStore.fetchPlants()
    apiStore.fetchConseils()
    apiStore.fetchUsers()
  }, [])

  return (
    <Screen style={$root} preset="scroll">
      <Text>{apiStore.nbPlants} plantes</Text>
      <Text>{apiStore.nbComments} conseils</Text>
      <Text>{apiStore.nbUser} utilisateurs</Text>

    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
