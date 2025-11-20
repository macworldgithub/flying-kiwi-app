// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   ActivityIndicator,
//   Alert,
//   Image,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import tw from "tailwind-react-native-classnames";
// import { theme } from "../utils/theme";
// import * as LocalAuthentication from "expo-local-authentication";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_BASE_URL } from "../utils/config";
// import fingerprint from "../../assets/finger_print.png";

// const Login = () => {
//   const navigation = useNavigation();
//   const [hasBiometric, setHasBiometric] = useState(false);
//   const [showBiometricScreen, setShowBiometricScreen] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [identifierInput, setIdentifierInput] = useState("");
//   const [pinInput, setPinInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [forgetPinModalVisible, setForgetPinModalVisible] = useState(false);
//   const [forgetEmail, setForgetEmail] = useState("");

//   //Check saved user and biometric availability
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const userData = await AsyncStorage.getItem("userData");
//         const hasHardware = await LocalAuthentication.hasHardwareAsync();

//         const isEnrolled = await LocalAuthentication.isEnrolledAsync();

//         const biometricAvailable = hasHardware && isEnrolled;
//         setHasBiometric(biometricAvailable);

//         // If user data exists, show biometric screen instead of login
//         if (userData && biometricAvailable) {
//           setShowBiometricScreen(true);
//         } else {
//           console.log(
//             "ℹNo saved user or biometrics unavailable, showing login screen..."
//           );
//         }
//       } catch (e) {
//         console.log("Error checking biometric:", e);
//       }
//     };
//     checkAuthStatus();
//   }, []);

//   const handleBiometricAuth = async () => {
//     try {
//       const result = await LocalAuthentication.authenticateAsync({
//         promptMessage: "Authenticate to continue",
//         cancelLabel: "Cancel",
//       });

//       if (result.success) {
//         const userData = await AsyncStorage.getItem("userData");

//         if (userData) {
//           navigation.replace("Home");
//         } else {
//           Alert.alert("No saved session found. Please log in again.");
//           setShowBiometricScreen(false);
//         }
//       } else {
//         Alert.alert("Authentication Failed", "Please use your PIN instead.");
//         setShowBiometricScreen(false);
//       }
//     } catch (error) {
//       Alert.alert("Error", "Biometric authentication unavailable.");
//       setShowBiometricScreen(false);
//     }
//   };

//   const handleLogin = async () => {
//     if (!identifierInput || !pinInput) {
//       Alert.alert("Missing Fields", "Please enter both identifier and PIN.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}auth/login`, {
//         method: "POST",
//         headers: {
//           accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           identifier: identifierInput.trim(),
//           pin: pinInput,
//         }),
//       });

//       const data = await response.json();

//       if (response.status !== 201) {
//         throw new Error(data.message || "Invalid credentials");
//       }

//       await AsyncStorage.setItem("userData", JSON.stringify(data));
//       await AsyncStorage.setItem("access_token", data.access_token);
//       await AsyncStorage.setItem("lastIdentifier", identifierInput.trim());
//       await AsyncStorage.setItem("lastPin", pinInput);

//       Alert.alert("Success", "Login successful!", [
//         {
//           text: "OK",
//           onPress: () => {
//             setModalVisible(false);
//             navigation.replace("Home");
//           },
//         },
//       ]);
//     } catch (error) {
//       Alert.alert("Login Failed", error.message || "Unauthorized access.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (showBiometricScreen) {
//     return (
//       <LinearGradient
//         colors={theme.gradients.splash}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={tw`flex-1 items-center justify-center px-6`}
//       >
//         <View
//           style={[
//             tw`bg-white rounded-2xl shadow-lg p-6 w-full`,
//             { maxWidth: 320 },
//           ]}
//         >
//           <Text style={tw`text-xl font-bold text-center mb-4`}>
//             Welcome Back
//           </Text>
//           <Image
//             source={fingerprint}
//             style={tw`w-16 h-16 mx-auto mb-4`}
//             resizeMode="contain"
//           />
//           <Text style={tw`text-gray-500 text-center mb-4`}>
//             Use your fingerprint to unlock your session
//           </Text>
//           <TouchableOpacity
//             onPress={handleBiometricAuth}
//             style={[
//               tw`py-3 rounded-lg`,
//               { backgroundColor: theme.colors.primary },
//             ]}
//           >
//             <Text style={tw`text-white text-center font-semibold`}>
//               Authenticate
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => {
//               console.log("🔄 Switching from biometric to PIN login...");
//               setShowBiometricScreen(false);
//             }}
//             style={[
//               tw`mt-3 border py-3 rounded-lg`,
//               { borderColor: theme.colors.primary },
//             ]}
//           >
//             <Text
//               style={[
//                 tw`text-center font-semibold`,
//                 { color: theme.colors.primary },
//               ]}
//             >
//               Use PIN Instead
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>
//     );
//   }

//   //Default login screen (first-time)
//   return (
//     <LinearGradient
//       colors={theme.gradients.splash}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={tw`flex-1 items-center justify-center px-6`}
//     >
//       <View
//         style={[
//           tw`bg-white rounded-2xl shadow-lg p-6 w-full`,
//           { maxWidth: 320 },
//         ]}
//       >
//         <Text style={tw`text-xl font-bold text-center mb-4`}>Secure Login</Text>

//         <TouchableOpacity
//           style={[
//             tw`border py-3 rounded-lg mb-3`,
//             { borderColor: theme.colors.primary },
//           ]}
//           onPress={() => {
//             setModalVisible(true);
//           }}
//         >
//           <Text
//             style={[
//               tw`text-center font-semibold`,
//               { color: theme.colors.primary },
//             ]}
//           >
//             Use PIN Instead
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             tw`border py-3 rounded-lg`,
//             { borderColor: theme.colors.primary },
//           ]}
//           onPress={() => {
//             navigation.navigate("ChatAI");
//           }}
//         >
//           <Text
//             style={[
//               tw`text-center font-semibold`,
//               { color: theme.colors.primary },
//             ]}
//           >
//             Chat AI
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* PIN Modal */}
//       <Modal
//         animationType="slide"
//         transparent
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(false);
//         }}
//       >
//         <View
//           style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//         >
//           <View style={[tw`bg-white rounded-2xl p-6 w-4/5`, { maxWidth: 320 }]}>
//             <Text style={tw`text-lg font-bold text-center mb-4`}>
//               PIN Login
//             </Text>

//             <TextInput
//               style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
//               placeholder="Enter Identifier (email or custNo)"
//               placeholderTextColor="#9CA3AF"
//               value={identifierInput}
//               onChangeText={(text) => {
//                 setIdentifierInput(text);
//               }}
//               autoCapitalize="none"
//               keyboardType="email-address"
//             />

//             <TextInput
//               style={tw`border border-gray-300 text-black rounded-lg px-3 py-2 mb-3`}
//               placeholder="Enter PIN"
//               placeholderTextColor="#9CA3AF"
//               secureTextEntry
//               keyboardType="numeric"
//               value={pinInput}
//               onChangeText={(text) => {
//                 setPinInput(text);
//               }}
//             />

//             <TouchableOpacity
//               style={[
//                 tw`py-3 rounded-lg mb-3`,
//                 { backgroundColor: theme.colors.primary },
//               ]}
//               onPress={handleLogin}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={tw`text-white text-center font-semibold`}>
//                   Log In
//                 </Text>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 tw`py-3 rounded-lg mb-3`,
//                 { backgroundColor: theme.colors.primary },
//               ]}
//               onPress={() => setForgetPinModalVisible(true)}
//             >
//               <Text style={tw`text-white text-center font-semibold`}>
//                 Forget Pin
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 setModalVisible(false);
//               }}
//               style={[
//                 tw`border py-3 rounded-lg`,
//                 { borderColor: theme.colors.primary },
//               ]}
//             >
//               <Text
//                 style={[
//                   tw`text-center font-semibold`,
//                   { color: theme.colors.primary },
//                 ]}
//               >
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Forget PIN Modal */}
//       <Modal
//         animationType="slide"
//         transparent
//         visible={forgetPinModalVisible}
//         onRequestClose={() => setForgetPinModalVisible(false)}
//       >
//         <View
//           style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//         >
//           <View style={[tw`bg-white rounded-2xl p-6 w-4/5`, { maxWidth: 320 }]}>
//             <Text style={tw`text-lg font-bold text-center mb-4`}>
//               Reset Your PIN
//             </Text>

//             <Text style={tw`text-gray-600 mb-4`}>
//               Enter your email address and we'll send you instructions to reset
//               your PIN.
//             </Text>

//             <TextInput
//               style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`}
//               placeholder="Enter your email"
//               placeholderTextColor="#9CA3AF"
//               value={forgetEmail}
//               onChangeText={setForgetEmail}
//               autoCapitalize="none"
//               keyboardType="email-address"
//               autoComplete="email"
//             />

//             <TouchableOpacity
//               style={[
//                 tw`py-3 rounded-lg mb-3`,
//                 { backgroundColor: theme.colors.primary },
//               ]}
//               onPress={() => {
//                 // TODO: Implement forget pin logic here
//                 console.log("Reset PIN for:", forgetEmail);
//                 // Show success message and close modal
//                 alert(
//                   "If an account exists with this email, you will receive instructions to reset your PIN."
//                 );
//                 setForgetPinModalVisible(false);
//                 setForgetEmail("");
//               }}
//             >
//               <Text style={tw`text-white text-center font-semibold`}>
//                 Send Reset PIN
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => setForgetPinModalVisible(false)}
//               style={[
//                 tw`border py-3 rounded-lg`,
//                 { borderColor: theme.colors.primary },
//               ]}
//             >
//               <Text
//                 style={[
//                   tw`text-center font-semibold`,
//                   { color: theme.colors.primary },
//                 ]}
//               >
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </LinearGradient>
//   );
// };

// export default Login;

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   ActivityIndicator,
//   Alert,
//   Image,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import tw from "tailwind-react-native-classnames";
// import { theme } from "../utils/theme";
// import * as LocalAuthentication from "expo-local-authentication";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_BASE_URL } from "../utils/config";
// import fingerprint from "../../assets/finger_print.png";

// const Login = () => {
//   const navigation = useNavigation();

//   const [hasBiometric, setHasBiometric] = useState(false);
//   const [showBiometricScreen, setShowBiometricScreen] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [identifierInput, setIdentifierInput] = useState("");
//   const [pinInput, setPinInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Forget PIN States
//   const [forgetPinModalVisible, setForgetPinModalVisible] = useState(false);
//   const [forgetEmail, setForgetEmail] = useState("");
//   const [forgetLoading, setForgetLoading] = useState(false);

//   // Change PIN States
//   const [changePinModalVisible, setChangePinModalVisible] = useState(false);
//   const [oldPin, setOldPin] = useState("");
//   const [newPin, setNewPin] = useState("");
//   const [changePinLoading, setChangePinLoading] = useState(false);

//   // Check saved user and biometric availability
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const userData = await AsyncStorage.getItem("userData");
//         const hasHardware = await LocalAuthentication.hasHardwareAsync();
//         const isEnrolled = await LocalAuthentication.isEnrolledAsync();

//         const biometricAvailable = hasHardware && isEnrolled;
//         setHasBiometric(biometricAvailable);

//         if (userData && biometricAvailable) {
//           setShowBiometricScreen(true);
//         } else {
//           console.log(
//             "No saved user or biometrics unavailable, showing login screen..."
//           );
//         }
//       } catch (e) {
//         console.log("Error checking biometric:", e);
//       }
//     };
//     checkAuthStatus();
//   }, []);

//   const handleBiometricAuth = async () => {
//     try {
//       const result = await LocalAuthentication.authenticateAsync({
//         promptMessage: "Authenticate to continue",
//         cancelLabel: "Cancel",
//       });

//       if (result.success) {
//         const userData = await AsyncStorage.getItem("userData");
//         if (userData) {
//           navigation.replace("Home");
//         } else {
//           Alert.alert("No saved session found. Please log in again.");
//           setShowBiometricScreen(false);
//         }
//       } else {
//         Alert.alert("Authentication Failed", "Please use your PIN instead.");
//         setShowBiometricScreen(false);
//       }
//     } catch (error) {
//       Alert.alert("Error", "Biometric authentication unavailable.");
//       setShowBiometricScreen(false);
//     }
//   };

//   const handleLogin = async () => {
//     if (!identifierInput || !pinInput) {
//       Alert.alert("Missing Fields", "Please enter both identifier and PIN.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}auth/login`, {
//         method: "POST",
//         headers: {
//           accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           identifier: identifierInput.trim(),
//           pin: pinInput,
//         }),
//       });

//       const data = await response.json();

//       if (response.status !== 201) {
//         throw new Error(data.message || "Invalid credentials");
//       }

//       await AsyncStorage.setItem("userData", JSON.stringify(data));
//       await AsyncStorage.setItem("access_token", data.access_token);
//       await AsyncStorage.setItem("lastIdentifier", identifierInput.trim());
//       await AsyncStorage.setItem("lastPin", pinInput);
//       console.log("✅ User logged in and data saved.");

//       Alert.alert("Success", "Login successful!", [
//         {
//           text: "OK",
//           onPress: () => {
//             setModalVisible(false);
//             navigation.replace("Home");
//           },
//         },
//       ]);
//     } catch (error) {
//       Alert.alert("Login Failed", error.message || "Unauthorized access.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Change PIN (UI only)
//   const handleChangePin = () => {
//     if (!oldPin || !newPin) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     if (newPin.length < 4) {
//       Alert.alert("Error", "PIN must be at least 4 digits");
//       return;
//     }

//     // Just show success message and close modal
//     Alert.alert("Success", "PIN change request received");
//     setChangePinModalVisible(false);
//     setOldPin("");
//     setNewPin("");
//   };

//   // Main Function to Call Forgot PIN API
//   const handleForgotPin = async () => {
//     if (!forgetEmail.trim()) {
//       Alert.alert("Error", "Please enter your email address.");
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(forgetEmail.trim())) {
//       Alert.alert("Invalid Email", "Please enter a valid email address.");
//       return;
//     }

//     setForgetLoading(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}auth/forgot-pin`, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           identifier: forgetEmail.trim(), // Exactly as your API expects
//         }),
//       });

//       const data = await response.json();

//       if (response.ok || response.status === 201) {
//         Alert.alert(
//           "Success",
//           "New PIN has been sent to your email.",
//           [
//             {
//               text: "OK",
//               onPress: () => {
//                 setForgetPinModalVisible(false);
//                 setForgetEmail("");
//                 setModalVisible(false); // Optional: close PIN modal too
//               },
//             },
//           ],
//           { cancelable: false }
//         );
//       } else {
//         Alert.alert(
//           "Failed",
//           data.message || "Unable to send PIN. Please try again."
//         );
//       }
//     } catch (error) {
//       console.error("Forgot PIN API Error:", error);
//       Alert.alert(
//         "Network Error",
//         "Please check your internet connection and try again."
//       );
//     } finally {
//       setForgetLoading(false);
//     }
//   };

//   // Biometric Screen
//   if (showBiometricScreen) {
//     return (
//       <LinearGradient
//         colors={theme.gradients.splash}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={tw`flex-1 items-center justify-center px-6`}
//       >
//         <View
//           style={[
//             tw`bg-white rounded-2xl shadow-lg p-6 w-full`,
//             { maxWidth: 320 },
//           ]}
//         >
//           <Text style={tw`text-xl font-bold text-center mb-4`}>
//             Welcome Back
//           </Text>
//           <Image
//             source={fingerprint}
//             style={tw`w-16 h-16 mx-auto mb-4`}
//             resizeMode="contain"
//           />
//           <Text style={tw`text-gray-500 text-center mb-4`}>
//             Use your fingerprint to unlock your session
//           </Text>
//           <TouchableOpacity
//             onPress={handleBiometricAuth}
//             style={[
//               tw`py-3 rounded-lg`,
//               { backgroundColor: theme.colors.primary },
//             ]}
//           >
//             <Text style={tw`text-white text-center font-semibold`}>
//               Authenticate
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => setShowBiometricScreen(false)}
//             style={[
//               tw`mt-3 border py-3 rounded-lg`,
//               { borderColor: theme.colors.primary },
//             ]}
//           >
//             <Text
//               style={[
//                 tw`text-center font-semibold`,
//                 { color: theme.colors.primary },
//               ]}
//             >
//               Use PIN Instead
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>
//     );
//   }

//   // Main Login Screen
//   return (
//     <LinearGradient
//       colors={theme.gradients.splash}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={tw`flex-1 items-center justify-center px-6`}
//     >
//       <View
//         style={[
//           tw`bg-white rounded-2xl shadow-lg p-6 w-full`,
//           { maxWidth: 320 },
//         ]}
//       >
//         <Text style={tw`text-xl font-bold text-center mb-4`}>Secure Login</Text>

//         <TouchableOpacity
//           style={[
//             tw`border py-3 rounded-lg mb-3`,
//             { borderColor: theme.colors.primary },
//           ]}
//           onPress={() => setModalVisible(true)}
//         >
//           <Text
//             style={[
//               tw`text-center font-semibold`,
//               { color: theme.colors.primary },
//             ]}
//           >
//             Use PIN Instead
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             tw`border py-3 rounded-lg`,
//             { borderColor: theme.colors.primary },
//           ]}
//           onPress={() => navigation.navigate("ChatAI")}
//         >
//           <Text
//             style={[
//               tw`text-center font-semibold`,
//               { color: theme.colors.primary },
//             ]}
//           >
//             Chat AI
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* PIN Login Modal */}
//       <Modal
//         animationType="slide"
//         transparent
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View
//           style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//         >
//           <View style={[tw`bg-white rounded-2xl p-6 w-4/5`, { maxWidth: 320 }]}>
//             <Text style={tw`text-lg font-bold text-center mb-4`}>
//               PIN Login
//             </Text>

//             <TextInput
//               style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
//               placeholder="Enter Identifier (email or custNo)"
//               placeholderTextColor="#9CA3AF"
//               value={identifierInput}
//               onChangeText={setIdentifierInput}
//               autoCapitalize="none"
//               keyboardType="email-address"
//             />

//             <TextInput
//               style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
//               placeholder="Enter PIN"
//               placeholderTextColor="#9CA3AF"
//               secureTextEntry
//               keyboardType="numeric"
//               value={pinInput}
//               onChangeText={setPinInput}
//             />

//             <TouchableOpacity
//               style={[
//                 tw`py-3 rounded-lg mb-3`,
//                 { backgroundColor: theme.colors.primary },
//               ]}
//               onPress={handleLogin}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={tw`text-white text-center font-semibold`}>
//                   Log In
//                 </Text>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 tw`py-3 rounded-lg mb-3`,
//                 { backgroundColor: theme.colors.primary },
//               ]}
//               onPress={() => setForgetPinModalVisible(true)}
//             >
//               <Text style={tw`text-white text-center font-semibold`}>
//                 Forget PIN?
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => setModalVisible(false)}
//               style={[
//                 tw`border py-3 rounded-lg`,
//                 { borderColor: theme.colors.primary },
//               ]}
//             >
//               <Text
//                 style={[
//                   tw`text-center font-semibold`,
//                   { color: theme.colors.primary },
//                 ]}
//               >
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Forget PIN Modal - Fully Working API */}
//       <Modal
//         animationType="slide"
//         transparent
//         visible={forgetPinModalVisible}
//         onRequestClose={() => setForgetPinModalVisible(false)}
//       >
//         <View
//           style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//         >
//           <View style={[tw`bg-white rounded-2xl p-6 w-4/5`, { maxWidth: 320 }]}>
//             <Text style={tw`text-lg font-bold text-center mb-4`}>
//               Reset Your PIN
//             </Text>
//             <Text style={tw`text-gray-600 mb-4 text-center`}>
//               Enter your email address and we'll send you a new PIN.
//             </Text>

//             <TextInput
//               style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`}
//               placeholder="Enter your email"
//               placeholderTextColor="#9CA3AF"
//               value={forgetEmail}
//               onChangeText={setForgetEmail}
//               autoCapitalize="none"
//               keyboardType="email-address"
//               autoComplete="email"
//             />

//             <TouchableOpacity
//               style={[
//                 tw`py-3 rounded-lg mb-3`,
//                 { backgroundColor: theme.colors.primary },
//               ]}
//               onPress={handleForgotPin}
//               disabled={forgetLoading}
//             >
//               {forgetLoading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={tw`text-white text-center font-semibold`}>
//                   Send Reset PIN
//                 </Text>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 setForgetPinModalVisible(false);
//                 setForgetEmail("");
//                 setChangePinModalVisible(true);
//               }}
//               style={[
//                 tw`border py-3 rounded-lg mb-3`,
//                 { borderColor: theme.colors.primary },
//               ]}
//             >
//               <Text
//                 style={[
//                   tw`text-center font-semibold`,
//                   { color: theme.colors.primary },
//                 ]}
//               >
//                 Change PIN
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 setForgetPinModalVisible(false);
//                 setForgetEmail("");
//               }}
//               style={[
//                 tw`border py-3 rounded-lg`,
//                 { borderColor: theme.colors.primary },
//               ]}
//             >
//               <Text
//                 style={[
//                   tw`text-center font-semibold`,
//                   { color: theme.colors.primary },
//                 ]}
//               >
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Change PIN Modal */}
//       <Modal
//         animationType="slide"
//         transparent
//         visible={changePinModalVisible}
//         onRequestClose={() => setChangePinModalVisible(false)}
//       >
//         <View
//           style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
//         >
//           <View style={[tw`bg-white rounded-2xl p-6 w-4/5`, { maxWidth: 320 }]}>
//             <Text style={tw`text-lg font-bold text-center mb-4`}>
//               Change Your PIN
//             </Text>
//             <Text style={tw`text-gray-600 mb-4 text-center`}>
//               Enter your old PIN and new PIN to change it.
//             </Text>

//             <TextInput
//               style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
//               placeholder="Old PIN"
//               placeholderTextColor="#9CA3AF"
//               secureTextEntry
//               keyboardType="numeric"
//               value={oldPin}
//               onChangeText={setOldPin}
//               maxLength={4}
//             />

//             <TextInput
//               style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`}
//               placeholder="New PIN (min 4 digits)"
//               placeholderTextColor="#9CA3AF"
//               secureTextEntry
//               keyboardType="numeric"
//               value={newPin}
//               onChangeText={setNewPin}
//               maxLength={4}
//             />

//             <TouchableOpacity
//               style={[
//                 tw`py-3 rounded-lg mb-3`,
//                 { backgroundColor: theme.colors.primary },
//               ]}
//               onPress={handleChangePin}
//               disabled={changePinLoading}
//             >
//               {changePinLoading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={tw`text-white text-center font-semibold`}>
//                   Update PIN
//                 </Text>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 setChangePinModalVisible(false);
//                 setOldPin("");
//                 setNewPin("");
//               }}
//               style={[
//                 tw`border py-3 rounded-lg`,
//                 { borderColor: theme.colors.primary },
//               ]}
//             >
//               <Text
//                 style={[
//                   tw`text-center font-semibold`,
//                   { color: theme.colors.primary },
//                 ]}
//               >
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </LinearGradient>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import tw from "tailwind-react-native-classnames";
import { theme } from "../utils/theme";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/config";
import fingerprint from "../../assets/finger_print.png";

const Login = () => {
  const navigation = useNavigation();

  const [hasBiometric, setHasBiometric] = useState(false);
  const [showBiometricScreen, setShowBiometricScreen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [identifierInput, setIdentifierInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Forget PIN States
  const [forgetPinModalVisible, setForgetPinModalVisible] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");
  const [forgetLoading, setForgetLoading] = useState(false);

  // Change PIN States
  const [changePinModalVisible, setChangePinModalVisible] = useState(false);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [changePinLoading, setChangePinLoading] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        const biometricAvailable = hasHardware && isEnrolled;
        setHasBiometric(biometricAvailable);

        if (userData && biometricAvailable) {
          setShowBiometricScreen(true);
        }
      } catch (e) {
        console.log("Error checking biometric:", e);
      }
    };
    checkAuthStatus();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
        cancelLabel: "Cancel",
      });

      if (result.success) {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          navigation.replace("Home");
        } else {
          Alert.alert("No saved session found. Please log in again.");
          setShowBiometricScreen(false);
        }
      } else {
        Alert.alert("Authentication Failed", "Please use your PIN instead.");
        setShowBiometricScreen(false);
      }
    } catch (error) {
      Alert.alert("Error", "Biometric authentication unavailable.");
      setShowBiometricScreen(false);
    }
  };

  const handleLogin = async () => {
    if (!identifierInput || !pinInput) {
      Alert.alert("Missing Fields", "Please enter both identifier and PIN.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifierInput.trim(),
          pin: pinInput,
        }),
      });

      const data = await response.json();

      if (response.status !== 201) {
        throw new Error(data.message || "Invalid credentials");
      }

      await AsyncStorage.setItem("userData", JSON.stringify(data));
      await AsyncStorage.setItem("access_token", data.access_token);
      await AsyncStorage.setItem("lastIdentifier", identifierInput.trim());
      await AsyncStorage.setItem("lastPin", pinInput);

      Alert.alert("Success", "Login successful!", [
        {
          text: "OK",
          onPress: () => {
            setModalVisible(false);
            navigation.replace("Home");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Login Failed", error.message || "Unauthorized access.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPin = async () => {
    if (!forgetEmail.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgetEmail.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setForgetLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}auth/forgot-pin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: forgetEmail.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok || response.status === 201) {
        Alert.alert(
          "Success",
          "New PIN has been sent to your email.",
          [
            {
              text: "OK",
              onPress: () => {
                setForgetPinModalVisible(false);
                setForgetEmail("");
                setModalVisible(false);
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Failed",
          data.message || "Unable to send PIN. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Network Error",
        "Please check your internet connection and try again."
      );
    } finally {
      setForgetLoading(false);
    }
  };

  // YEH HI CHANGE PIN KA FULL WORKING API HAI - UI SAME RAKHI HAI
  const handleChangePin = async () => {
    if (!oldPin || !newPin) {
      Alert.alert("Error", "Please enter both old and new PIN");
      return;
    }
    if (oldPin.length < 4 || newPin.length < 4) {
      Alert.alert("Error", "PIN must be at least 4 digits");
      return;
    }
    if (oldPin === newPin) {
      Alert.alert("Error", "New PIN cannot be same as old PIN");
      return;
    }

    setChangePinLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Session Expired", "Please login again");
        navigation.replace("Login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}auth/change-pin`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPin: oldPin.trim(),
          newPin: newPin.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok || response.status === 200) {
        await AsyncStorage.setItem("lastPin", newPin.trim());
        Alert.alert("Success", "PIN changed successfully!", [
          {
            text: "OK",
            onPress: () => {
              setChangePinModalVisible(false);
              setOldPin("");
              setNewPin("");
            },
          },
        ]);
      } else {
        Alert.alert("Failed", data.message || "Old PIN is incorrect");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setChangePinLoading(false);
    }
  };

  if (showBiometricScreen) {
    return (
      <LinearGradient
        colors={theme.gradients.splash}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={tw`flex-1 items-center justify-center px-6`}
      >
        <View
          style={[
            tw`bg-white rounded-2xl shadow-lg p-6 w-full`,
            { maxWidth: 320 },
          ]}
        >
          <Text style={tw`text-xl font-bold text-center mb-4`}>
            Welcome Back
          </Text>
          <Image
            source={fingerprint}
            style={tw`w-16 h-16 mx-auto mb-4`}
            resizeMode="contain"
          />
          <Text style={tw`text-gray-500 text-center mb-4`}>
            Use your fingerprint to unlock your session
          </Text>
          <TouchableOpacity
            onPress={handleBiometricAuth}
            style={[
              tw`py-3 rounded-lg`,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              Authenticate
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowBiometricScreen(false)}
            style={[
              tw`mt-3 border py-3 rounded-lg`,
              { borderColor: theme.colors.primary },
            ]}
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
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={theme.gradients.splash}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={tw`flex-1 items-center justify-center px-6`}
    >
      <View
        style={[
          tw`bg-white rounded-2xl shadow-lg p-6 w-full`,
          { maxWidth: 320 },
        ]}
      >
        <Text style={tw`text-xl font-bold text-center mb-4`}>Secure Login</Text>

        <TouchableOpacity
          style={[
            tw`border py-3 rounded-lg mb-3`,
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
            tw`border py-3 rounded-lg`,
            { borderColor: theme.colors.primary },
          ]}
          onPress={() => navigation.navigate("ChatAI")}
        >
          <Text
            style={[
              tw`text-center font-semibold`,
              { color: theme.colors.primary },
            ]}
          >
            Chat AI
          </Text>
        </TouchableOpacity>
      </View>

      {/* PIN Login Modal */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={[tw`bg-white rounded-2xl p-6 w-4/5`, { maxWidth: 320 }]}>
            <Text style={tw`text-lg font-bold text-center mb-4`}>
              PIN Login
            </Text>

            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
              placeholder="Enter Identifier (email or custNo)"
              placeholderTextColor="#9CA3AF"
              value={identifierInput}
              onChangeText={setIdentifierInput}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
              placeholder="Enter PIN"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="numeric"
              value={pinInput}
              onChangeText={setPinInput}
            />

            <TouchableOpacity
              style={[
                tw`py-3 rounded-lg mb-3`,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={tw`text-white text-center font-semibold`}>
                  Log In
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                tw`py-3 rounded-lg mb-3`,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setForgetPinModalVisible(true)}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Forget PIN?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[
                tw`border py-3 rounded-lg`,
                { borderColor: theme.colors.primary },
              ]}
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

      {/* Forget PIN Modal */}
      <Modal animationType="slide" transparent visible={forgetPinModalVisible}>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={[tw`bg-white rounded-2xl p-6 w-4/5`, { maxWidth: 320 }]}>
            <Text style={tw`text-lg font-bold text-center mb-4`}>
              Reset Your PIN
            </Text>
            <Text style={tw`text-gray-600 mb-4 text-center`}>
              Enter your email address and we'll send you a new PIN.
            </Text>

            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={forgetEmail}
              onChangeText={setForgetEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TouchableOpacity
              style={[
                tw`py-3 rounded-lg mb-3`,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleForgotPin}
              disabled={forgetLoading}
            >
              {forgetLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={tw`text-white text-center font-semibold`}>
                  Send Reset PIN
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setForgetPinModalVisible(false);
                setForgetEmail("");
                setChangePinModalVisible(true);
              }}
              style={[
                tw`border py-3 rounded-lg mb-3`,
                { borderColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[
                  tw`text-center font-semibold`,
                  { color: theme.colors.primary },
                ]}
              >
                Change PIN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setForgetPinModalVisible(false);
                setForgetEmail("");
              }}
              style={[
                tw`border py-3 rounded-lg`,
                { borderColor: theme.colors.primary },
              ]}
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

      {/* Change PIN Modal - API LAGA DIYA, UI SAME RAKHI */}
      <Modal animationType="slide" transparent visible={changePinModalVisible}>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={[tw`bg-white rounded-2xl p-6 w-4/5`, { maxWidth: 320 }]}>
            <Text style={tw`text-lg font-bold text-center mb-4`}>
              Change Your PIN
            </Text>
            <Text style={tw`text-gray-600 mb-4 text-center`}>
              Enter your old PIN and new PIN to change it.
            </Text>

            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
              placeholder="Old PIN"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="numeric"
              value={oldPin}
              onChangeText={setOldPin}
              maxLength={6}
            />

            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`}
              placeholder="New PIN (min 4 digits)"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="numeric"
              value={newPin}
              onChangeText={setNewPin}
              maxLength={6}
            />

            <TouchableOpacity
              style={[
                tw`py-3 rounded-lg mb-3`,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleChangePin}
              disabled={changePinLoading}
            >
              {changePinLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={tw`text-white text-center font-semibold`}>
                  Update PIN
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setChangePinModalVisible(false);
                setOldPin("");
                setNewPin("");
              }}
              style={[
                tw`border py-3 rounded-lg`,
                { borderColor: theme.colors.primary },
              ]}
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
