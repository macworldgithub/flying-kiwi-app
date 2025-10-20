import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
// import * as LocalAuthentication from 'expo-local-authentication';
import tw from "tailwind-react-native-classnames";
import { theme } from "../utils/theme";

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [pin, setPin] = useState("");

  return (
    <LinearGradient
      colors={theme.gradients.splash}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={tw`flex-1`}
    >
      <View style={tw`flex-1 items-center justify-center px-6`}>
        <View
          style={[
            tw`bg-white rounded-2xl shadow-lg p-6 w-full`,
            { maxWidth: 320 },
          ]}
        >
          <Text style={tw`text-xl font-bold text-center mb-2`}>Sign Up</Text>
          <Text style={tw`text-gray-500 text-sm text-center mb-4`}>
            Create a new account to access Bele services
          </Text>

          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="Street Address"
            placeholderTextColor="#9CA3AF"
            value={street}
            onChangeText={setStreet}
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="City"
            placeholderTextColor="#9CA3AF"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="State"
            placeholderTextColor="#9CA3AF"
            value={state}
            onChangeText={setState}
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="ZIP Code"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={zip}
            onChangeText={setZip}
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="Enter PIN (at least 4 digits)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            secureTextEntry
            value={pin}
            onChangeText={setPin}
          />

          <TouchableOpacity
            style={[
              tw` py-3 rounded-lg mb-3`,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`border py-3 rounded-lg`,
              { borderColor: theme.colors.primary },
            ]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text
              style={[
                tw` text-center font-semibold`,
                { color: theme.colors.primary },
              ]}
            >
              Back to Login
            </Text>
          </TouchableOpacity>

          <Text style={tw`text-gray-400 text-xs text-center mt-4`}>
            Your data is securely stored and protected. Biometric enrollment is
            optional for PIN login.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SignUp;