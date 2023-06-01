import React, { FC, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { ViewStyle } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackScreenProps } from "app/navigators";
import { Screen } from "app/components";

interface ScanScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Scan">> {}

export const ScanScreen: FC<ScanScreenProps> = observer(function ScanScreen() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const [identifiedPlant, setIdentifiedPlant] = useState(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      identifyPlant(photo.base64);
    }
  }

  async function identifyPlant(imageBase64) {
    const apiKey = "Os8HOo2WdCGszoy2QsorUVBZYEMw32FPNmKrrz3i6Oe6dxdCsG";
    const url = "https://api.plant.id/v2/identify";

    const requestBody = JSON.stringify({
      api_key: apiKey,
      images: [imageBase64],
      organs: ["leaf"],
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Plant identification result:", data);
        if (data.suggestions && data.suggestions.length > 0) {
          setIdentifiedPlant(data.suggestions[0]);
        }
      } else {
        console.error("Failed to send request to Plant.id API. Status:", response.status);
      }
    } catch (error) {
      console.error("Error identifying plant:", error);
    }
  }

  return (
    <Screen style={$root} preset="scroll">
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      {identifiedPlant && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scientific Name: {identifiedPlant.plant_details.scientific_name}</Text>
          <Text style={styles.resultText}>Probability: {identifiedPlant.probability}</Text>
        </View>
      )}
    </Screen>
  );
})

const $root: ViewStyle = {
  flex: 1,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
});
