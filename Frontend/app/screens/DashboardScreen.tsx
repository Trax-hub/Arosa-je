import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Dimensions, View, StyleSheet, Text } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { useStores } from "app/models"
import Carousel from 'react-native-snap-carousel';
import { FontAwesome5, Octicons  } from '@expo/vector-icons'; 
import { useNavigation } from "@react-navigation/native"


interface DashboardScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Dashboard">> {}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const DashboardScreen: FC<DashboardScreenProps> = observer(function DashboardScreen() {
  const { apiStore } = useStores()
  const carouselRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState('');

  const navigation1 = useNavigation()

  useEffect(() => {
    apiStore.fetchPlants()
    apiStore.fetchConseils()
    apiStore.fetchUsers()
    apiStore.fetchConversations()
    const date = new Date();
    const currentMonthIndex = date.getMonth();
    setCurrentMonth(getMonthName(currentMonthIndex));
    carouselRef.current.snapToItem(currentMonthIndex, true, false)
    const unsubscribe = navigation1.addListener("focus", () => {
      apiStore.fetchPlants()
      apiStore.fetchConseils()
      apiStore.fetchUsers()
      apiStore.fetchConversations()
      const date = new Date();
      const currentMonthIndex = date.getMonth();
      setCurrentMonth(getMonthName(currentMonthIndex));
      carouselRef.current.snapToItem(currentMonthIndex, true, false)
    })
    return unsubscribe
  }, [navigation1])

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getMonthName = (monthIndex) => {
    const month = new Date(0, monthIndex).toLocaleString('fr-FR', { month: 'long' });
    return capitalizeFirstLetter(month);
}


const entries = Array.from({ length: 12 }, (_, i) => (
  <View style={styles.container}>
    <Text style={styles.text}><FontAwesome5 name="leaf" size={50} color="#2F5E3D" />  {apiStore.nbPlants} plantes</Text>
    <Text style={styles.text}><FontAwesome5 name="info" size={50} color="#2F5E3D" />  {apiStore.nbComments} conseils</Text>
    <Text style={styles.text}><FontAwesome5 name="user" size={50} color="#2F5E3D" />  {apiStore.nbUser} utilisateurs</Text>
    <Text style={styles.text}><Octicons name="comment-discussion" size={50} color="#2F5E3D" />  {apiStore.nbConversations} conversations</Text>
  </View>
));


  const _renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        {item}
      </View>
    );
  }

  const handleSnapToItem = (index) => {
    setCurrentMonth(getMonthName(index));
  }

  return (
    <Screen style={$root} preset="scroll">
      <Text style={styles.month}>{currentMonth}</Text>
      <Carousel
        layout={'stack'}
        layoutCardOffset={9}
        ref={carouselRef}
        data={entries}
        renderItem={_renderItem}
        onSnapToItem={handleSnapToItem}
        sliderWidth={windowWidth}
        itemWidth={windowWidth}
        itemHeight={windowHeight}
        sliderHeight={windowHeight}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const styles = StyleSheet.create({
  slide: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FDF2',
  },
  month: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#F0FDF2',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around', // pour l'espacement vertical équitable
    paddingHorizontal: 20, // pour un peu d'espacement horizontal
  },
  text: {
    textAlign: 'center', // pour centrer le texte horizontalement
    fontSize: 40,
  },
});