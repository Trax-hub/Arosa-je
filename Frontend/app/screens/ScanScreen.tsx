import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Camera, CameraType } from "expo-camera"
import * as FileSystem from "expo-file-system"
import { ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Screen } from "app/components"
import openai from "app/services/api/api"
import Spinner from "react-native-loading-spinner-overlay"
import axios from "axios"
import * as Location from "expo-location"
import { Alert } from "react-native"

interface ScanScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Scan">> {}

export const ScanScreen: FC<ScanScreenProps> = observer(function ScanScreen() {
  const [type, setType] = useState(CameraType.back)
  const [permission, requestPermission] = Camera.useCameraPermissions()
  const cameraRef = useRef(null)
  const [identifiedPlant, setIdentifiedPlant] = useState(null)
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [plantName, setPlantName] = useState("")
  const [plantExplanation, setPlantExplanation] = useState("")
  const [plantPhoto, setPplantPhoto] = useState("")
  const [showCard, setShowCard] = useState(true)

  if (!permission) {
    // Camera permissions are still loading
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>Nous avons besoin de votre permission pour montrer la caméra</Text>
        <Button onPress={requestPermission} title="donner la permission" />
      </View>
    )
  }

  async function handlePublish() {
    const location = await getLocation()
    if (!location) {
      console.error("L'emplacement n'a pas pu être déterminé")
      Alert.alert("Erreur", "La localisation n'a pas pu être déterminée.")
      return
    }

    const plantData = {
      title: plantName,
      description: plantExplanation,
      localisation: "test",
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
      photo: plantPhoto,
    }

    try {
      const response = await axios.post("http://192.168.254.53:8000/api/posts", plantData)
      console.log(response.data)
      Alert.alert("Succès", "La publication a réussi.")
      setShowCard(false) // Hide card
    } catch (error) {
      console.error(error)
      Alert.alert("Erreur", "Une erreur est survenue lors de la publication.")
    }
  }

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
      console.error("Permission to access location was denied")
      return
    }

    let location = await Location.getCurrentPositionAsync({})
    return location
  }

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back))
  }

  async function takePicture() {
    if (cameraRef.current) {
      setLoading(true)
      const photo = await cameraRef.current.takePictureAsync({ base64: true })
      await identifyPlant(photo.base64)
    }
  }

  async function chatgpt(plantName) {
    const result = await openai.post("https://api.openai.com/v1/completions", {
      model: "text-davinci-003",
      prompt: `Comment entretenir cette plante le nom est anglais: ${plantName}? je veux que tu me reponde en deux phrase sous ce format. Plante :  "nom de la plante". Explications : "tu mets la réponse comment entretenir" `,
      //temperature: 0.6,
      max_tokens: 175,
      n: 1,
    })
    const responseText = result.data.choices[0].text
    const responseParts = responseText.split("Explications :")
    setPlantName(responseParts[0].replace("Plante :", "").trim())
    setPlantExplanation(responseParts[1].trim())
    setLoading(false)
  }

  async function identifyPlant(imageBase64) {
    const apiKey = "ktBodLzbwbLM7KIU4Iw3YZXdFiLkNmTYRUpdS3NZ3XcwLlhSOi"
    const url = "https://api.plant.id/v2/identify"

    const requestBody = JSON.stringify({
      api_key: apiKey,
      images: [imageBase64],
      organs: ["leaf"],
      plant_details: ["wiki_image"],
      plant_language : "fr",
    })

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Plant identification result:", data)
        if (data.suggestions && data.suggestions.length > 0) {
          setIdentifiedPlant(data.suggestions[0])
          chatgpt(data.suggestions[0].plant_name)
          setPplantPhoto(data.suggestions[0].plant_details.wiki_image.value)
        }
      } else {
        console.error("Failed to send request to Plant.id API. Status:", response.status)
      }
    } catch (error) {
      console.error("Error identifying plant:", error)
    }
  }

  return (
    <Screen style={$root} preset="scroll">
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Tourner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <Spinner
        visible={loading}
        textContent={"En attente du jardinier..."}
        textStyle={styles.spinnerTextStyle}
      />


      {/* {identifiedPlant && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Scientific Name: {identifiedPlant.plant_details.scientific_name}
          </Text>
          <Text style={styles.resultText}>Probability: {identifiedPlant.probability}</Text>
        </View>
      )} */}
      <Text>{response}</Text>
      {showCard && plantName && plantExplanation && (
        <Card
          verticalAlignment="center"
          heading={plantName}
          content={plantExplanation}
          FooterComponent={
            <Button
              preset="reversed"
              text="Publier"
              onPress={
                handlePublish}
              style={{ backgroundColor: "#2F5E3D" }}
              textStyle={{ color: "#FFFFFF" }}
            />
          }
        />
      )}
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "#F8FFF8",
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    height: 400,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  resultContainer: {
    backgroundColor: "white",
    padding: 16,
    marginTop: 16,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
})
