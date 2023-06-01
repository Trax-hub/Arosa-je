import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Screen, Text } from "app/components"
import { useNavigation } from "@react-navigation/native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface HomeScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Home">> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Card
        verticalAlignment="center"
        LeftComponent={<Text>Left</Text>}
        RightComponent={<Text>Right</Text>}
        heading="Card Heading"
        content="Card Content"
        FooterComponent={<Button preset="reversed" text="FooterComponent"/>}
      />
      <Card
        verticalAlignment="center"
        LeftComponent={<Text>Left</Text>}
        RightComponent={<Text>Right</Text>}
        heading="Card Heading"
        content="Card Content"
        FooterComponent={<Button preset="reversed" text="FooterComponent"/>}
      />
      <Card
        verticalAlignment="center"
        LeftComponent={<Text>Left</Text>}
        RightComponent={<Text>Right</Text>}
        heading="Card Heading"
        content="Card Content"
        FooterComponent={<Button preset="reversed" text="FooterComponent"/>}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  padding: 10,
}
