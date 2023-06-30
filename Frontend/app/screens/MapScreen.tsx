import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ViewStyle } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackScreenProps } from "app/navigators";
import { Screen, Text } from "app/components";
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useStores } from "app/models";
import Spinner from "react-native-loading-spinner-overlay"


interface MapScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Map">> {}

export const MapScreen: FC<MapScreenProps> = observer(function MapScreen() {

  const { apiStore } = useStores();
  const navigation = useNavigation();

  useEffect(() => {
    apiStore.fetchPlants();
    const unsubscribe = navigation.addListener('focus', () => {
      apiStore.fetchPlants();
    });

    return unsubscribe;
  }, [navigation])
  

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {apiStore.plants.map((plant, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: plant.latitude, longitude: plant.longitude }}
          >
            <Callout>
              <Text>{plant.name}</Text>
              <Text>{plant.description}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <Spinner
        visible={apiStore.loading}
        textContent={"Chargement..."}
        textStyle={styles.spinnerTextStyle}
      />
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
  spinnerTextStyle: {
    color: "#FFF",
  },
});

