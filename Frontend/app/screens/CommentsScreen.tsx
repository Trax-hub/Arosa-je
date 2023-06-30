import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, StyleSheet } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { AutoImage, Button, Card, Screen, Text } from "app/components"
import axios from "axios"
import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
import Spinner from "react-native-loading-spinner-overlay"

interface CommentsScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Comments">> {}

export const CommentsScreen: FC<CommentsScreenProps> = observer(function CommentsScreen() {
  
  const { apiStore } = useStores();
  const navigation = useNavigation();

  useEffect(() => {
    apiStore.fetchConseils();
    const unsubscribe = navigation.addListener('focus', () => {
      apiStore.fetchConseils();
    });

    return unsubscribe;
  }, [navigation])

  return (
    <Screen style={$root} preset="scroll">
      {
        // Itérer sur les posts et créer une carte pour chaque
        apiStore.comments.map((comment) => (
          <Card
            key={comment.id}
            style={cardStyle}  // Apply the style here
            verticalAlignment="center"
            LeftComponent={
              <AutoImage
                maxWidth={80}
                style={{ alignSelf: "center" }}
                source={{
                  uri: comment.plant,
                }}
              />
            }
            heading={comment.plant}
            content={comment.comment}
          />
        ))
      }
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
  backgroundColor: '#F8FFF8',
}

const cardStyle: ViewStyle = {
  margin: 10,  // Add 10 units of space around each card
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
})