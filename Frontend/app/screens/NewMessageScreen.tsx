import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, StyleSheet, TouchableOpacity, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { useStores } from "app/models"
import { Picker } from "@react-native-picker/picker"
import { TextInput } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"

interface NewMessageScreenProps extends NativeStackScreenProps<AppStackScreenProps<"NewMessage">> {}

export const NewMessageScreen: FC<NewMessageScreenProps> = observer(function NewMessageScreen() {
  const { apiStore } = useStores()

  const [destinataire, setDestinataire] = useState("")
  const [message, setMessage] = useState("")
  const navigation = useNavigation()

  useEffect(() => {
    apiStore.fetchUsers()
  }, [])

  const handleSendMessage = async () => {
    const destinataire_num = parseInt(destinataire)

    const smallerID = Math.min(apiStore.user.id, destinataire_num)
    const biggerID = Math.max(apiStore.user.id, destinataire_num)

    const conversation = {
      title: `${smallerID}${biggerID}`,
      horodatage: new Date().toISOString(),
      users: [`/api/users/${apiStore.user.id}`, `/api/users/${destinataire}`],
    }
    try {
      await apiStore.addConversation(
        conversation.title,
        conversation.horodatage,
        conversation.users,
      )
      const newMessage = {
        content: message,
        user: `/api/users/${destinataire}`,
        conversation: `/api/conversations/${apiStore.NewconversationId}`,
        Horodatage: new Date().toISOString(),
      }
      await apiStore.sendMessage(
        newMessage.content,
        newMessage.user,
        newMessage.conversation,
        newMessage.Horodatage,
      )
      navigation.goBack()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Screen style={$root} preset="scroll">
      <Picker
        selectedValue={destinataire}
        onValueChange={(itemValue) => setDestinataire(itemValue)}
        style={textInputStyle}
      >
        {apiStore.users.map((user) => (
          <Picker.Item key={user.id} label={user.pseudo} value={user.id} />
        ))}
      </Picker>
      <TextInput
        style={style.messageInput}
        value={message}
        onChangeText={setMessage}
        placeholder="Tapez votre message ici..."
      />
      <TouchableOpacity style={style.button} onPress={handleSendMessage}>
        <Text style={style.buttonText}>Envoyer</Text>
      </TouchableOpacity>
    </Screen>
  )
})
const $root: ViewStyle = {
  flex: 1,
}

const textInputStyle: ViewStyle = {
  borderWidth: 1,
  borderColor: "gray",
  borderRadius: 4,
  padding: 8,
  marginBottom: 16,
}

const style = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  messageInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  messageInput: {
    flex: 1,
    marginRight: 10,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#286641",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
})
