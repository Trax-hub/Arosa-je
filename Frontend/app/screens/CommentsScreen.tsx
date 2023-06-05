import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { AutoImage, Button, Card, Screen, Text } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface CommentsScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Comments">> {}

export const CommentsScreen: FC<CommentsScreenProps> = observer(function CommentsScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Card
          verticalAlignment="center"
          LeftComponent={<Button 
            preset="reversed" 
            text="Découvrir"
            style={{ backgroundColor: '#2F5E3D' }} 
            textStyle={{ color: '#FFFFFF' }} 
          />}
          heading="Nom de la plante"
          content="conseil"
        />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: '#F8FFF8',
}
