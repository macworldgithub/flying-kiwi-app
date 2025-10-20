// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import * as React from "react";
// import { NavigationContainer } from '@react-navigation/native';
import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Home from './src/Screens/Home';
import Home from "./src/screens/Home.jsx";
// import BillQuery from './src/Screens/BillQuery';
import BillQuery from "./src/screens/BillQuery.jsx";
// import UpdateAddress from './src/Screens/UpdateAddress';
import UpdateAddress from "./src/screens/UpdateAddress.jsx";
// import CoverageCheck from './src/Screens/CoverageCheck';
import CoverageCheck from "./src/screens/CoverageCheck.jsx";
// import Splash from './src/Screens/Splash';
import Splash from "./src/screens/Splash.js";
// import Login from './src/Screens/Login';
import Login from "./src/screens/Login.js";
// import PrivacyConsent from './src/Screens/PrivacyConsent';
import PrivacyConsent from "./src/screens/PrivacyConsent.jsx";
// import ChatAI from './src/Screens/ChatAI';
import ChatAI from "./src/screens/ChatAI.jsx";
import SignUp from "./src/screens/Signup.js";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Initial Route is Splash */}
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BillQuery" component={BillQuery} />
        <Stack.Screen name="UpdateAddress" component={UpdateAddress} />
        <Stack.Screen name="CoverageCheck" component={CoverageCheck} />
        <Stack.Screen name="PrivacyConsent" component={PrivacyConsent} />
        <Stack.Screen name="ChatAI" component={ChatAI} />
        <Stack.Screen name="SignUp" component={SignUp} />
   
      </Stack.Navigator>
    </NavigationContainer>
  );
}
