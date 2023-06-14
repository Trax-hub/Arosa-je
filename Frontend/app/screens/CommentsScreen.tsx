import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { AutoImage, Button, Card, Screen, Text } from "app/components"
import axios from "axios"
import { useStores } from "app/models"

interface CommentsScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Comments">> {}

import { useNavigation } from '@react-navigation/native';
import Spinner from "react-native-loading-spinner-overlay"

// Inside your component
export const CommentsScreen: FC<CommentsScreenProps> = observer(function CommentsScreen() {
  
  // State pour stocker les données des posts
  const [posts, setPosts] = useState([])
  const navigation = useNavigation();

  const fetchPosts = () => {
    // Récupère les données lors du chargement du composant
    axios.get(process.env.REACT_APP_API_URL)
      .then((response) => {
        // met à jour le state avec les données récupérées
        setPosts(response.data['hydra:member'])
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    fetchPosts();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPosts();
    });

    return unsubscribe;
  }, [navigation])

  return (
    <Screen style={$root} preset="scroll">
      {
        // Itérer sur les posts et créer une carte pour chaque
        posts.map((post) => (
          <Card
            key={post.id}
            style={cardStyle}  // Apply the style here
            verticalAlignment="center"
            LeftComponent={
              <AutoImage
                maxWidth={80}
                style={{ alignSelf: "center" }}
                source={{
                  uri: post.photo,
                }}
              />
            }
            heading={post.title}
            content={post.description}
          />
        ))
      }

    </Screen>
  )
})


const $root: ViewStyle = {
  flex: 1,
  backgroundColor: '#F8FFF8',
}

const cardStyle: ViewStyle = {
  margin: 10,  // Add 10 units of space around each card
}
