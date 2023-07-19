import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TouchableOpacity, StyleSheet } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Screen, Text, Card } from "app/components"
import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
import Spinner from "react-native-loading-spinner-overlay"

interface MessagerieScreenProps extends NativeStackScreenProps<AppStackParamList, "Messagerie"> {}

export const MessagerieScreen: FC<MessagerieScreenProps> = observer(({ navigation }) => {
  
  // Pull in one of our MST stores
  const { apiStore } = useStores()

  const navigation1 = useNavigation()

  useEffect(() => {
    apiStore.fetchConversations()
    const unsubscribe = navigation.addListener("focus", () => {
      apiStore.fetchConversations()
    })
    return unsubscribe
  }, [navigation1])

  return (
    <Screen style={$root} preset="scroll">
      {apiStore.conversations.map((conversation, index) => {
        // Get the username of the other user in the conversation
        const otherUserPseudo = conversation.user.find(user => user.pseudo !== apiStore.user.username)?.pseudo;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {apiStore.setconversationId(conversation.id); navigation.navigate("Conversation")}}
          >
            <Card heading={otherUserPseudo}>
            </Card>
          </TouchableOpacity>
        )
      })}
            <Spinner
        visible={apiStore.loading}
        textContent={"Chargement..."}
        textStyle={styles.spinnerTextStyle}
      />
    </Screen>
  )
})


const $root: ViewStyle = {
  flex: 1,
}
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
})
