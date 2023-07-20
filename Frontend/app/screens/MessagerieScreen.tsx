import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TouchableOpacity, StyleSheet } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Screen, Text, Card } from "app/components"
import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
import Spinner from "react-native-loading-spinner-overlay"
import { AntDesign } from '@expo/vector-icons';

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
      {apiStore.conversations.filter(conversation => 
        conversation.user.some(user => user.id === apiStore.user.id)
      ).map((conversation, index) => {

        const otherUserPseudo = conversation.user.find(user => user.pseudo !== apiStore.user.username)?.pseudo;

        const sortedMessages = conversation.messages.slice().sort((a, b) => new Date(b.Horodatage).getTime() - new Date(a.Horodatage).getTime());
        const lastMessage = sortedMessages.find(message => message.user.id == apiStore.user.id);

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {apiStore.setconversationId(conversation.id); navigation.navigate("Conversation")}}
          >
            <Card heading={otherUserPseudo} content={lastMessage ? lastMessage.content : ""} RightComponent={<AntDesign name="right" size={18} color="black" />}>
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
