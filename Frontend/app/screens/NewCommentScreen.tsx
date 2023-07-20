import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextInput, Button } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { Picker } from "@react-native-picker/picker"
import { useStores } from "app/models" // Supposons que useStores est un hook personnalisé qui vous permet d'accéder à vos stores MobX.
import { useNavigation } from "@react-navigation/native"

interface NewCommentScreenProps extends NativeStackScreenProps<AppStackScreenProps<"NewComment">> {}

export const NewCommentScreen: FC<NewCommentScreenProps> = observer(function NewCommentScreen() {
  const { apiStore } = useStores() // Accès au store ApiStore.
  const navigation = useNavigation();

  const [comment, setComment] = useState("")
  const [user, setUser] = useState("")
  const [plant, setPlant] = useState("")

  useEffect(() => {
    apiStore.fetchPlants() // Récupérer les données des plantes au montage du composant.
  }, [])

  const handleSubmit = () => {
    const newComment = {
      comment: comment,
      date: "2023-06-12", // Utilise la date actuelle
      user: `/api/users/${apiStore.user.id}`,
      plant: `/api/plants/${plant}`,
    }
  
    // Envoie le newComment au serveur 
    apiStore.addComment(newComment.comment, newComment.date, newComment.user, newComment.plant)
      .then(() => {
        console.log('Commentaire ajouté avec succès');
        navigation.goBack()
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout du commentaire : ', error);
      });
  }  

  return (
    <Screen style={$root} preset="scroll">
      <TextInput
        placeholder="Comment"
        value={comment}
        onChangeText={setComment}
        style={textInputStyle}
      />
      <Picker
        selectedValue={plant}
        onValueChange={(itemValue) => setPlant(itemValue)}
        style={textInputStyle}
      >
        {apiStore.plants.map((plant) => (
          <Picker.Item key={plant.id} label={plant.name} value={plant.id} />
        ))}
      </Picker>
      <Button title="Publier" onPress={handleSubmit} />
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