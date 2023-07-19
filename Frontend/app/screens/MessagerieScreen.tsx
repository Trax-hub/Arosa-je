import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TouchableOpacity } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Screen, Text, Card } from "app/components"
import { useStores } from "app/models"

interface MessagerieScreenProps extends NativeStackScreenProps<AppStackParamList, "Messagerie"> {}

export const MessagerieScreen: FC<MessagerieScreenProps> = observer(({ navigation }) => {
  // Pull in one of our MST stores
  const { apiStore } = useStores()

  useEffect(() => {
    apiStore.fetchConversations()
    console.log(apiStore.conversations)
  }, [])

  return (
    <Screen style={$root} preset="scroll">
      {apiStore.conversations.map((conversation, index) => {
        // Get the last user's pseudo
        const lastUserPseudo = conversation.user[conversation.user.length - 1]?.pseudo

        return (
          
          <TouchableOpacity
            key={index}
            onPress={() => {apiStore.setconversationId(conversation.id); navigation.navigate("Conversation")}}
          >
            <Card heading={lastUserPseudo}>
              {conversation.user.map((user, userIndex) => (
                <Text key={userIndex}>{user.pseudo}</Text>
              ))}
            </Card>
          </TouchableOpacity>
        )
      })}
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
