/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { FontAwesome5  } from "@expo/vector-icons"

const Tab = createBottomTabNavigator()
/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Home: undefined
  // 🔥 Your screens go here
  Scan: undefined
  Conseils: undefined
  Carte: undefined
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()
const Drawer = createDrawerNavigator()
const AppStack = observer(function AppStack() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#F0FDF2",
        },
        headerTintColor: "#2F5E3D",
        tabBarActiveTintColor: "#2F5E3D",
        tabBarStyle: {
          backgroundColor: "#F0FDF2",
        },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={Screens.HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={size} />
          ),
        }}
      />
      {/*a* 🔥 Your screens go here */}
      <Tab.Screen
        name="Conseils"
        component={Screens.CommentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="hands-helping" color={color} size={size} /> 
          ),
        }}
      />
      <Tab.Screen name="Scan" component={Screens.ScanScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="camera" color={color} size={size} />
          ),
        }}/>

      <Tab.Screen name="Carte" component={Screens.MapScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map" color={color} size={size} />
          ),
        }}/>
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Tab.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#F0FDF2", // Remplacez '#F0FDF2' par la couleur que vous voulez
    },
  }

  return (
    <NavigationContainer ref={navigationRef} theme={MyTheme} {...props}>
      <AppStack />
    </NavigationContainer>
  )
})
