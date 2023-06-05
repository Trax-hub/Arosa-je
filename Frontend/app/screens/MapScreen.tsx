import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface MapScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Map">> {}

export const MapScreen: FC<MapScreenProps> = observer(function MapScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
