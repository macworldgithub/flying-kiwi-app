import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home.jsx";
import BillQuery from "./src/screens/BillQuery.jsx";
import UpdateAddress from "./src/screens/UpdateAddress.jsx";
import CoverageCheck from "./src/screens/CoverageCheck.jsx";
import Splash from "./src/screens/Splash.js";
import Login from "./src/screens/Login.js";
import PrivacyConsent from "./src/screens/PrivacyConsent.jsx";
import ChatAI from "./src/screens/ChatAI.jsx";
import SignUp from "./src/screens/Signup.js";
import PlansScreen from "./src/screens/PlansScreen.jsx";
import Order from "./src/screens/Order.jsx";
import OrderDetail from "./src/screens/OrderDetail.jsx";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BillQuery" component={BillQuery} />
        <Stack.Screen name="UpdateAddress" component={UpdateAddress} />
        <Stack.Screen name="CoverageCheck" component={CoverageCheck} />
        <Stack.Screen name="PrivacyConsent" component={PrivacyConsent} />
        <Stack.Screen name="ChatAI" component={ChatAI} />
        <Stack.Screen name="Plans" component={PlansScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
