import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
import Spinner from "react-native-loading-spinner-overlay"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ConversationScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"Conversation">> {}

export const ConversationScreen: FC<ConversationScreenProps> = observer(
  function ConversationScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const { apiStore } = useStores()

    const styles: { [key: string]: ViewStyle } = {
      right: { alignSelf: "flex-end", backgroundColor: "#dcf8c6" },
      left: { alignSelf: "flex-start", backgroundColor: "#ffffff" },
    }

    const navigation1 = useNavigation()

    useEffect(() => {
      apiStore.fetchMessages(apiStore.conversationId)
      const unsubscribe = navigation1.addListener("focus", () => {
        apiStore.fetchMessages(apiStore.conversationId)
      })
      return unsubscribe
    }, [navigation1])

    return (
      <Screen style={$root} preset="scroll">
        {apiStore.messages.map((message, index) => (
          <View
            key={index}
            style={message.user.pseudo !== apiStore.user.username ? styles.right : styles.left}
          >
            <Text>{message.content}</Text>
          </View>
        ))}
        <Spinner
          visible={apiStore.loading}
          textContent={"Chargement..."}
          textStyle={styles.spinnerTextStyle}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
})
