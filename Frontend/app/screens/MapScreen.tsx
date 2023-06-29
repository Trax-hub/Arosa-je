import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ViewStyle } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackScreenProps } from "app/navigators";
import { Screen, Text } from "app/components";
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

interface MapScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Map">> {}

export const MapScreen: FC<MapScreenProps> = observer(function MapScreen() {
  const [plants, setPlants] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPlants = async () => {
        try {
          const response = await axios.get("http://192.168.254.53:8000/api/posts");
          setPlants(response.data["hydra:member"]);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchPlants();
    }, [])
  );
  

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {plants.map((plant, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: plant.latitude, longitude: plant.longitude }}
          >
            <Callout>
              <Text>{plant.title}</Text>
              <Text>{plant.description}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
