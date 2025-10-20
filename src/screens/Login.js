// import React from "react";
// import { View, Text, TouchableOpacity, Image } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import tw from "tailwind-react-native-classnames";
// import { theme } from "../utils/theme";
// // import fingerprint from "../../assets/finger_print.png"
// import finger from "../../assets/finger.png";

// const Login = () => {
//   const navigation = useNavigation();

//   return (
//     <LinearGradient
//       colors={theme.gradients.splash}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={tw`flex-1`}
//     >
//       <View style={tw`flex-1 items-center justify-center px-6`}>
//         <View
//           style={[
//             tw`bg-white rounded-2xl shadow-lg p-6 w-full`,
//             { maxWidth: 320 },
//           ]}
//         >
//           <Text style={tw`text-xl font-bold text-center mb-2`}>
//             Secure Login
//           </Text>
//           <Text style={tw`text-gray-500 text-xs text-center mb-2`}>
//             Choose your preferred authentication method
//           </Text>

//           {/* Biometric Section */}
//           <View style={tw`items-center mb-4`}>
//             <Image source={finger} style={tw`w-12 h-12 mb-2`} />
//             <Text style={tw`text-base font-semibold text-center`}>
//               Biometric Authentication
//             </Text>
//             <Text style={tw`text-gray-500 text-xs text-center`}>
//               Touch the fingerprint sensor or use face recognition
//             </Text>
//           </View>

//           {/* Login Buttons */}
//           <TouchableOpacity
//             style={[
//               tw`py-3 rounded-lg mb-3 `,
//               { backgroundColor: theme.colors.primary },
//             ]}
//             onPress={() => navigation.replace("Home")}
//           >
//             <Text style={tw`text-white text-center font-semibold`}>
//               Use Biometric Login
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               tw`border py-3 rounded-lg`,
//               { borderColor: theme.colors.primary },
//             ]}
//             onPress={() => navigation.replace("PrivacyConsent")}
//           >
//             <Text style={tw`text-black text-center font-semibold`}>
//               Use PIN Instead
//             </Text>
//           </TouchableOpacity>

//           <Text style={tw`text-gray-400 text-xs text-center mt-4`}>
//             Your login attempts are logged for security purposes
//           </Text>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import tw from "tailwind-react-native-classnames";
import { theme } from "../utils/theme";
import fingerprint from "../../assets/finger_print.png";
import * as LocalAuthentication from "expo-local-authentication";

const Login = () => {
  const navigation = useNavigation();
  const [hasBiometric, setHasBiometric] = useState(false);
  const [userIdInput, setUserIdInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setHasBiometric(Boolean(hasHardware && isEnrolled));
      } catch (e) {
        setHasBiometric(false);
      }
    };
    checkBiometrics();
  }, []);

  const handleBiometricPress = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate",
        disableDeviceFallback: false,
        cancelLabel: "Cancel",
      });
      if (result.success) {
        navigation.navigate("PrivacyConsent");
        return;
      }
      Alert.alert("Authentication Failed", "Please try again or use PIN.");
    } catch (e) {
      Alert.alert(
        "Biometrics Unavailable",
        "Your device may not support or have biometrics set up. Use PIN instead."
      );
    }
  };

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
          <Text style={tw`text-xl font-bold text-center mb-2`}>
            Secure Login
          </Text>
          <Text style={tw`text-gray-500 text-sm text-center mb-2`}>
            Choose your preferred authentication method
          </Text>

          <View style={tw`items-center mb-4`}>
            <Image
              source={fingerprint}
              style={tw`w-14 h-14 mb-2`}
              resizeMode="contain"
            />
            <Text style={tw`text-base font-semibold text-center`}>
              Biometric Authentication
            </Text>
            <Text style={tw`text-gray-500 text-xs text-center`}>
              Touch the fingerprint sensor or use face recognition
            </Text>
          </View>

          <TouchableOpacity
            style={[
              tw` py-3 rounded-lg mb-3`,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleBiometricPress}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              {hasBiometric ? "Use Biometric Login" : "Biometric Not Available"}
            </Text>
          </TouchableOpacity>

          <Text style={tw`text-base font-semibold text-center mt-4 mb-3`}>
            PIN Login
          </Text>
          <TouchableOpacity
            style={[
              tw`border  py-3 rounded-lg mb-3`,
              { borderColor: theme.colors.primary },
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Text
              style={[
                tw`text-center font-semibold`,
                { color: theme.colors.primary },
              ]}
            >
              Use PIN Instead
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`border  py-3 rounded-lg`,
              { borderColor: theme.colors.primary },
            ]}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text
              style={[
                tw`text-center font-semibold`,
                { color: theme.colors.primary },
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>

          <Text style={tw`text-gray-400 text-xs text-center mt-4`}>
            Your login attempts are logged for security purposes
          </Text>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={[tw`bg-white rounded-2xl p-6 w-4/5`, { maxWidth: 320 }]}>
            <Text style={tw`text-lg font-bold text-center mb-4`}>
              PIN Login
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
              placeholder="Enter User ID (e.g., ACC12345)"
              placeholderTextColor="#9CA3AF"
              value={userIdInput}
              onChangeText={setUserIdInput}
            />
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
              placeholder="Enter PIN"
              placeholderTextColor="#9CA3AF"
              value={pinInput}
              onChangeText={setPinInput}
              keyboardType="numeric"
              secureTextEntry
            />
            <TouchableOpacity
              style={[
                tw` py-3 rounded-lg mb-3`,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Log In
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[
                tw`py-3 rounded-lg mb-3`,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => {
                // Optional: You can add validation here before navigation
                if (!userIdInput || !pinInput) {
                  Alert.alert(
                    "Missing Info",
                    "Please enter both User ID and PIN."
                  );
                  return;
                }

                // Close modal and navigate to Home screen
                setModalVisible(false);
                setUserIdInput("");
                setPinInput("");

                navigation.navigate("Home"); 
              }}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Accept & Continue
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[
                tw`border py-3 rounded-lg`,
                { borderColor: theme.colors.primary },
              ]}
              onPress={() => {
                setModalVisible(false);
                setUserIdInput("");
                setPinInput("");
              }}
            >
              <Text
                style={[
                  tw`text-center font-semibold`,
                  { color: theme.colors.primary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default Login;
