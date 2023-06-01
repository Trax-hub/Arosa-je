import React, { FC } from "react";
import { observer } from "mobx-react-lite";
import { View, ViewStyle, Dimensions, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackScreenProps } from "app/navigators";
import { Button, Card, Screen, Text } from "app/components";
import { useNavigation } from "@react-navigation/native";

interface HomeScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Home">> {}

// Get the window width
const windowWidth = Dimensions.get('window').width;

// Define styles
const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: windowWidth > 768 ? 'row' : 'column',
    justifyContent: 'center', // Center items on the main axis
    alignItems: 'center', // Center items on the cross axis
  },
});

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  const navigation = useNavigation();
  return (
    <Screen style={$root} preset="scroll">
      <View style={styles.cardContainer}>
        <Card
          verticalAlignment="center"
          heading="Conseils de pro"
          content="Trouvez les réponses à vos questions"
          FooterComponent={<Button 
            preset="reversed" 
            text="Découvrir"
            style={{ backgroundColor: '#2F5E3D' }} 
            textStyle={{ color: '#FFFFFF' }} 
          />}
        />
        <Card
          verticalAlignment="center"
          heading="Carte interactive"
          content="Pour trouver les plantes à garder près de chez vous"
          FooterComponent={<Button 
            preset="reversed" 
            text="Découvrir"
            style={{ backgroundColor: '#2F5E3D' }} 
            textStyle={{ color: '#FFFFFF' }} 
          />}
        />
        <Card
          verticalAlignment="center"

          heading="Scanner une plante"
          content="Trouvez les réponses à vos questions"
          FooterComponent={<Button 
            preset="reversed" 
            text="Découvrir"
            style={{ backgroundColor: '#2F5E3D' }} 
            textStyle={{ color: '#FFFFFF' }} 
          />}
        />
      </View>
    </Screen>
  )
});


const $root: ViewStyle = {
  flex: 1,
  padding: 10,
}
