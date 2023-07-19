import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View, ViewStyle, TextInput, Button } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
import Spinner from "react-native-loading-spinner-overlay"

interface ConversationScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"Conversation">> {}

export const ConversationScreen: FC<ConversationScreenProps> = observer(
  function ConversationScreen() {
    // Pull in one of our MST stores
    const { apiStore } = useStores()
    
    // Use React useState hook for handling message input
    const [message, setMessage] = useState('')

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

    const otherUserId = apiStore.usersConversations.find(conversation => conversation.id !== apiStore.user.id)?.id;

    console.log(otherUserId)
    

    const handleSendMessage = () => {
      const newMessage = {
        content: message,
        user: `/api/users/${otherUserId}`,
        conversation: `/api/conversations/${apiStore.conversationId}`,
        Horodatage: new Date().toISOString(),
      }

      // Envoie le newComment au serveur 
      apiStore.sendMessage(newMessage.content, newMessage.user, newMessage.conversation, newMessage.Horodatage)
        .then(() => {
          console.log('Message ajouté avec succès');
          setMessage('')
          apiStore.fetchMessages(apiStore.conversationId)
        })
        .catch((error) => {
          console.error('Erreur lors de l\'ajout du commentaire : ', error);
        });
    }  

    apiStore.user.id
    

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
          textStyle={style.spinnerTextStyle}
        />
        <View style={style.messageInputContainer}>
          <TextInput 
            style={style.messageInput} 
            value={message} 
            onChangeText={setMessage} 
            placeholder="Tapez votre message ici..."
          />
          <Button title="Envoyer" onPress={handleSendMessage} />
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const style = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  messageInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  messageInput: {
    flex: 1,
    marginRight: 10,
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1
  }
})
