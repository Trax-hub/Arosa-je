import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { useStores } from "app/models"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ConversationScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Conversation">> {}

export const ConversationScreen: FC<ConversationScreenProps> = observer(function ConversationScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { apiStore } = useStores()

  useEffect(() => {
    apiStore.fetchMessages(apiStore.conversationId);
  }, []);
  
  return (
<Screen style={$root} preset="scroll">
      <Text text="conversation" />
      {apiStore.messages.map((message, index) => (
        <Text key={index} text={message.user.pseudo+":" +message.content} />
      ))}
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
