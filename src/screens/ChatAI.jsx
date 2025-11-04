// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   Modal,
//   useWindowDimensions,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { Ionicons } from "@expo/vector-icons";
// import { theme } from "../utils/theme";
// import { LinearGradient } from "expo-linear-gradient";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from "@react-native-community/datetimepicker";

// const API_BASE_URL = "https://bele.omnisuiteai.com";

// const ChatScreen = ({ navigation }) => {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([
//     {
//       id: 1,
//       type: "bot",
//       text: "Hey there! 👋 How can I help you today?",
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [showSignupForm, setShowSignupForm] = useState(false);
//   const [showNumberButtons, setShowNumberButtons] = useState(false);
//   const [numberOptions, setNumberOptions] = useState([]);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [dobDateObj, setDobDateObj] = useState(new Date(1990, 0, 1));
//   const { width } = useWindowDimensions();
//   const isSmallScreen = width < 600;

//   const [formData, setFormData] = useState({
//     firstName: "",
//     surname: "",
//     email: "",
//     phone: "",
//     dob: "",
//     address: "",
//     suburb: "",
//     state: "",
//     postcode: "",
//     pin: "",
//   });

//   const [formErrors, setFormErrors] = useState({});
//   const scrollViewRef = useRef();
//   // Form handling
//   const handleFormChange = (name, value) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setFormErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateForm = () => {
//     let isValid = true;
//     const errors = {};

//     if (!formData.firstName.trim()) {
//       errors.firstName = "First Name is required";
//       isValid = false;
//     }
//     if (!formData.surname.trim()) {
//       errors.surname = "Surname is required";
//       isValid = false;
//     }
//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = "Invalid email format";
//       isValid = false;
//     }
//     if (!formData.phone.trim()) {
//       errors.phone = "Phone is required";
//       isValid = false;
//     } else if (!/^04\d{8}$/.test(formData.phone)) {
//       errors.phone =
//         "Phone must be a valid Australian mobile (e.g., 0412345678)";
//       isValid = false;
//     }
//     if (!formData.dob.trim()) {
//       errors.dob = "Date of Birth is required";
//       isValid = false;
//     } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
//       errors.dob = "Date of Birth must be YYYY-MM-DD";
//       isValid = false;
//     }
//     if (!formData.address.trim()) {
//       errors.address = "Address is required";
//       isValid = false;
//     }
//     if (!formData.suburb.trim()) {
//       errors.suburb = "Suburb is required";
//       isValid = false;
//     }
//     if (!formData.state.trim()) {
//       errors.state = "State is required";
//       isValid = false;
//     }
//     if (!formData.postcode.trim()) {
//       errors.postcode = "Postcode is required";
//       isValid = false;
//     } else if (!/^\d{4}$/.test(formData.postcode)) {
//       errors.postcode = "Postcode must be 4 digits";
//       isValid = false;
//     }
//     if (!formData.pin.trim()) {
//       errors.pin = "PIN is required";
//       isValid = false;
//     } else if (!/^\d{4}$/.test(formData.pin)) {
//       errors.pin = "PIN must be exactly 4 digits";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleFormSubmit = async () => {
//     if (!validateForm()) return;

//     const formatted = Object.entries(formData)
//       .map(([key, value]) => `${key}: ${value}`)
//       .join(", ");

//     setShowSignupForm(false);
//     // Reset form data
//     setFormData({
//       firstName: "",
//       surname: "",
//       email: "",
//       phone: "",
//       dob: "",
//       address: "",
//       suburb: "",
//       state: "",
//       postcode: "",
//       pin: "",
//     });

//     await handleSend(formatted);
//   };
//   const handleSignupIntent = async (userMessage) => {
//     const signupKeywords = ["sign up", "signup", "register", "create account"];
//     const hasSignupIntent = signupKeywords.some((keyword) =>
//       userMessage.toLowerCase().includes(keyword)
//     );

//     if (hasSignupIntent) {
//       setShowSignupForm(true);

//       const botMsg = {
//         id: chat.length + 2,
//         type: "bot",
//         text: "I see you'd like to sign up! Please fill out the form below:",
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       };

//       setChat((prev) => [...prev, botMsg]);
//       return true;
//     }
//     return false;
//   };

//   const handleSend = async (msgText, retryWithoutSession = false) => {
//     if (!msgText || loading) return;

//     const userMsg = {
//       id: Date.now() + Math.floor(Math.random() * 1000),
//       type: "user",
//       text: msgText,
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     setChat((prev) => [...prev, userMsg]);
//     setMessage("");
//     setLoading(true);

//     try {
//       // Check for signup intent
//       if (!retryWithoutSession) {
//         const isSignupIntent = await handleSignupIntent(msgText);
//         if (isSignupIntent) {
//           setLoading(false);
//           return;
//         }
//       }

//       let payload;
//       if (retryWithoutSession || !sessionId) {
//         payload = { query: msgText };
//       } else {
//         payload = { query: msgText, session_id: sessionId };
//       }

//       const token = await AsyncStorage.getItem("access_token");
//       const headers = {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       };

//       if (token) {
//         headers.Authorization = `Bearer ${token}`;
//       }

//       const response = await fetch(`${API_BASE_URL}/chat/query`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorBody = await response.text();
//         throw new Error(
//           `HTTP ${response.status}: ${errorBody || response.statusText}`
//         );
//       }

//       const data = await response.json();

//       if (!sessionId && !retryWithoutSession && data.session_id) {
//         setSessionId(data.session_id);
//         try {
//           await AsyncStorage.setItem("chat_session_id", data.session_id);
//         } catch (e) {
//           // ignore storage errors
//         }
//       }

//       const botText = data?.message || "Sorry, I couldn't understand that.";
//       const botMsg = {
//         id: Date.now() + Math.floor(Math.random() * 1000),
//         type: "bot",
//         text: botText,
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       };

//       setChat((prev) => [...prev, botMsg]);

//       // Handle special cases
//       if (isDetailsRequest(botText)) {
//         setTimeout(() => {
//           setShowSignupForm(true);
//           setShowNumberButtons(false);
//         }, 300);
//       } else if (isNumberSelection(botText)) {
//         const numbers = extractNumbers(botText);
//         setNumberOptions(numbers);
//         setShowNumberButtons(true);
//         setShowSignupForm(false);
//       } else {
//         setShowSignupForm(false);
//         setShowNumberButtons(false);
//       }
//     } catch (error) {
//       console.error("Chat error:", error);
//       const errorMsg = {
//         id: Date.now() + Math.floor(Math.random() * 1000),
//         type: "bot",
//         text: error.message.includes("401")
//           ? "Session expired. Please log in again."
//           : `Error: ${error.message}. Please try again.`,
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       };
//       setChat((prev) => [...prev, errorMsg]);

//       // Retry without session if session is invalid
//       if (error.message.includes("Invalid session") && !retryWithoutSession) {
//         await clearSession();
//         setTimeout(() => {
//           handleSend(msgText, true);
//         }, 500);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = () => {
//     handleSend(message);
//   };

//   // Load session on mount
//   useEffect(() => {
//     (async () => {
//       try {
//         const stored = await AsyncStorage.getItem("chat_session_id");
//         if (stored) setSessionId(stored);
//       } catch (e) {
//         // ignore
//       }
//     })();
//   }, []);
//   return (
//     <LinearGradient
//       colors={theme.gradients.splash}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0.5, y: 1 }}
//       style={tw`flex-1`}
//     >
//       {/* Header */}
//       <View style={tw`flex-row items-center px-4 py-3 mt-12`}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={tw`text-white text-lg font-semibold ml-3`}>
//           Chat with AI Bot
//         </Text>
//       </View>

//       <KeyboardAvoidingView
//         style={tw`flex-1`}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           ref={scrollViewRef}
//           contentContainerStyle={tw`px-4 pb-6`}
//           showsVerticalScrollIndicator={false}
//           onContentSizeChange={() =>
//             scrollViewRef.current?.scrollToEnd({ animated: true })
//           }
//         >
//           {chat.map((msg) =>
//             msg.type === "user" ? (
//               <View key={msg.id} style={tw`items-end mt-4`}>
//                 <LinearGradient
//                   colors={theme.AIgradients.linear}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={[tw`px-4 py-3 rounded-2xl`, { maxWidth: "80%" }]}
//                 >
//                   <Text style={tw`text-white`}>{msg.text}</Text>
//                 </LinearGradient>
//                 <Text style={tw`text-gray-400 text-xs mt-1`}>{msg.time}</Text>
//               </View>
//             ) : (
//               <View
//                 key={msg.id}
//                 style={[tw`mt-6 flex-row items-start`, { maxWidth: "90%" }]}
//               >
//                 <LinearGradient
//                   colors={theme.AIgradients.linear}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={tw`w-8 h-8 rounded-full items-center justify-center mr-2`}
//                 >
//                   <Ionicons name="sparkles" size={18} color="white" />
//                 </LinearGradient>
//                 <View
//                   style={[
//                     tw`px-4 py-3 rounded-2xl`,
//                     {
//                       backgroundColor: "rgba(255,255,255,0.1)",
//                       maxWidth: "85%",
//                     },
//                   ]}
//                 >
//                   <Text style={tw`text-white`}>{msg.text}</Text>
//                 </View>
//               </View>
//             )
//           )}

//           {loading && (
//             <View style={[tw`mt-6 flex-row items-start`, { maxWidth: "90%" }]}>
//               <LinearGradient
//                 colors={theme.AIgradients.linear}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={tw`w-8 h-8 rounded-full items-center justify-center mr-2`}
//               >
//                 <Ionicons name="sparkles" size={18} color="white" />
//               </LinearGradient>
//               <View
//                 style={[
//                   tw`px-4 py-3 rounded-2xl`,
//                   { backgroundColor: "rgba(255,255,255,0.1)", maxWidth: "85%" },
//                 ]}
//               >
//                 <ActivityIndicator size="small" color="#fff" />
//               </View>
//             </View>
//           )}
//         </ScrollView>

//         {/* Signup Form */}
//         {showSignupForm && (
//           <View
//             style={[
//               styles.formContainer,
//               { backgroundColor: theme.colors.primary },
//             ]}
//           >
//             <ScrollView style={{ maxHeight: 400 }}>
//               <Text style={tw`text-white text-lg font-bold mb-3`}>
//                 Create Your Account
//               </Text>

//               <View style={tw`flex-row mb-2`}>
//                 <View style={tw`flex-1 mr-2`}>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       formErrors.firstName && styles.inputError,
//                     ]}
//                     placeholder="First Name *"
//                     placeholderTextColor="#999"
//                     value={formData.firstName}
//                     onChangeText={(text) => handleFormChange("firstName", text)}
//                   />
//                   {formErrors.firstName && (
//                     <Text style={styles.errorText}>{formErrors.firstName}</Text>
//                   )}
//                 </View>
//                 <View style={tw`flex-1`}>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       formErrors.surname && styles.inputError,
//                     ]}
//                     placeholder="Surname *"
//                     placeholderTextColor="#999"
//                     value={formData.surname}
//                     onChangeText={(text) => handleFormChange("surname", text)}
//                   />
//                   {formErrors.surname && (
//                     <Text style={styles.errorText}>{formErrors.surname}</Text>
//                   )}
//                 </View>
//               </View>

//               <View style={tw`mb-2`}>
//                 <TextInput
//                   style={[styles.input, formErrors.email && styles.inputError]}
//                   placeholder="Email *"
//                   placeholderTextColor="#999"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   value={formData.email}
//                   onChangeText={(text) => handleFormChange("email", text)}
//                 />
//                 {formErrors.email && (
//                   <Text style={styles.errorText}>{formErrors.email}</Text>
//                 )}
//               </View>

//               <View style={tw`mb-2`}>
//                 <TextInput
//                   style={[styles.input, formErrors.phone && styles.inputError]}
//                   placeholder="Phone (04XXXXXXXX) *"
//                   placeholderTextColor="#999"
//                   keyboardType="phone-pad"
//                   value={formData.phone}
//                   onChangeText={(text) => handleFormChange("phone", text)}
//                 />
//                 {formErrors.phone && (
//                   <Text style={styles.errorText}>{formErrors.phone}</Text>
//                 )}
//               </View>

//               <View style={tw`mb-2`}>
//                 <TouchableOpacity
//                   style={[
//                     styles.input,
//                     formErrors.dob && styles.inputError,
//                     {
//                       justifyContent: "center",
//                       paddingVertical: 12,
//                     },
//                   ]}
//                   onPress={() => setShowDatePicker(true)}
//                 >
//                   <Text style={{ color: formData.dob ? "#fff" : "#999" }}>
//                     {formData.dob || "Date of Birth (YYYY-MM-DD) *"}
//                   </Text>
//                 </TouchableOpacity>
//                 {formErrors.dob && (
//                   <Text style={styles.errorText}>{formErrors.dob}</Text>
//                 )}
//               </View>

//               <View style={tw`mb-2`}>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     formErrors.address && styles.inputError,
//                   ]}
//                   placeholder="Address *"
//                   placeholderTextColor="#999"
//                   value={formData.address}
//                   onChangeText={(text) => handleFormChange("address", text)}
//                 />
//                 {formErrors.address && (
//                   <Text style={styles.errorText}>{formErrors.address}</Text>
//                 )}
//               </View>

//               <View style={tw`flex-row mb-2`}>
//                 <View style={tw`flex-1 mr-2`}>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       formErrors.suburb && styles.inputError,
//                     ]}
//                     placeholder="Suburb *"
//                     placeholderTextColor="#999"
//                     value={formData.suburb}
//                     onChangeText={(text) => handleFormChange("suburb", text)}
//                   />
//                   {formErrors.suburb && (
//                     <Text style={styles.errorText}>{formErrors.suburb}</Text>
//                   )}
//                 </View>
//                 <View style={tw`w-1/4 mr-2`}>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       formErrors.state && styles.inputError,
//                     ]}
//                     placeholder="State *"
//                     placeholderTextColor="#999"
//                     value={formData.state}
//                     onChangeText={(text) => handleFormChange("state", text)}
//                   />
//                   {formErrors.state && (
//                     <Text style={styles.errorText}>{formErrors.state}</Text>
//                   )}
//                 </View>
//                 <View style={tw`w-1/4`}>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       formErrors.postcode && styles.inputError,
//                     ]}
//                     placeholder="Postcode *"
//                     placeholderTextColor="#999"
//                     keyboardType="number-pad"
//                     maxLength={4}
//                     value={formData.postcode}
//                     onChangeText={(text) => handleFormChange("postcode", text)}
//                   />
//                   {formErrors.postcode && (
//                     <Text style={styles.errorText}>{formErrors.postcode}</Text>
//                   )}
//                 </View>
//               </View>

//               <View style={tw`mb-3`}>
//                 <TextInput
//                   style={[styles.input, formErrors.pin && styles.inputError]}
//                   placeholder="4-digit PIN *"
//                   placeholderTextColor="#999"
//                   secureTextEntry
//                   keyboardType="number-pad"
//                   maxLength={4}
//                   value={formData.pin}
//                   onChangeText={(text) => handleFormChange("pin", text)}
//                 />
//                 {formErrors.pin && (
//                   <Text style={styles.errorText}>{formErrors.pin}</Text>
//                 )}
//               </View>

//               <View style={tw`flex-row justify-between`}>
//                 <TouchableOpacity
//                   style={[styles.button, styles.cancelButton]}
//                   onPress={() => setShowSignupForm(false)}
//                   disabled={loading}
//                 >
//                   <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.button, styles.submitButton]}
//                   onPress={handleFormSubmit}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Text style={styles.buttonText}>Sign Up</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         )}

//         {/* Number Selection Buttons */}
//         {showNumberButtons && (
//           <View
//             style={tw`flex-row flex-wrap gap-2 justify-center p-2 bg-gray-800`}
//           >
//             {numberOptions.map((number, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={tw`px-4 py-2 bg-blue-500 rounded-full`}
//                 onPress={() => {
//                   setShowNumberButtons(false);
//                   handleSend(number);
//                 }}
//               >
//                 <Text style={tw`text-white`}>{number}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Message Input */}
//         {!showSignupForm && (
//           <View
//             style={[
//               tw`flex-row items-center px-4 py-3`,
//               { backgroundColor: "rgba(255,255,255,0.05)" },
//             ]}
//           >
//             <TextInput
//               style={tw`flex-1 text-white px-4 py-2 rounded-full bg-gray-800`}
//               placeholder="Type your message..."
//               placeholderTextColor="#999"
//               value={message}
//               onChangeText={setMessage}
//               onSubmitEditing={sendMessage}
//               returnKeyType="send"
//             />
//             <TouchableOpacity
//               style={tw`ml-2 bg-blue-500 w-10 h-10 rounded-full items-center justify-center`}
//               onPress={sendMessage}
//               disabled={!message.trim() || loading}
//             >
//               <Ionicons
//                 name="arrow-up"
//                 size={20}
//                 color={!message.trim() || loading ? "#ccc" : "white"}
//               />
//             </TouchableOpacity>
//           </View>
//         )}
//       </KeyboardAvoidingView>

//       {/* Date Picker */}
//       {showDatePicker &&
//         (Platform.OS === "android" ? (
//           <DateTimePicker
//             value={dobDateObj}
//             mode="date"
//             display="default"
//             maximumDate={new Date()}
//             onChange={onDateChange}
//           />
//         ) : (
//           <Modal transparent animationType="slide">
//             <View style={tw`flex-1 justify-end bg-black/50`}>
//               <View style={tw`bg-white rounded-t-2xl p-4`}>
//                 <View style={tw`flex-row justify-between items-center mb-4`}>
//                   <TouchableOpacity onPress={handleIosCancel} style={tw`p-2`}>
//                     <Text style={tw`text-red-500 font-semibold`}>Cancel</Text>
//                   </TouchableOpacity>
//                   <Text
//                     style={tw`text-center flex-1 font-semibold text-gray-700`}
//                   >
//                     Select Date of Birth
//                   </Text>
//                   <TouchableOpacity onPress={handleIosDone} style={tw`p-2`}>
//                     <Text style={tw`text-blue-500 font-semibold`}>Done</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <View style={{ height: 216 }}>
//                   <DateTimePicker
//                     value={dobDateObj}
//                     mode="date"
//                     display="spinner"
//                     onChange={onDateChange}
//                     maximumDate={new Date()}
//                     themeVariant="light"
//                   />
//                 </View>
//               </View>
//             </View>
//           </Modal>
//         ))}
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   formContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     maxHeight: "70%",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   input: {
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 4,
//     fontSize: 14,
//     color: "#fff",
//   },
//   inputError: {
//     borderWidth: 1,
//     borderColor: "red",
//   },
//   errorText: {
//     color: "#ff6b6b",
//     fontSize: 12,
//     marginBottom: 8,
//   },
//   button: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     minWidth: 120,
//   },
//   submitButton: {
//     backgroundColor: "#2ecc71",
//   },
//   cancelButton: {
//     backgroundColor: "#e74c3c",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "600",
//   },
// });

// export default ChatScreen;
/** @format */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal,
  useWindowDimensions,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../utils/theme";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const API_BASE_URL = "https://bele.omnisuiteai.com";

const ChatScreen = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hey there 👋 I'm your AI assistant! How can I help you today? You can say 'I want to sign up' to get started.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showNumberButtons, setShowNumberButtons] = useState(false);
  const [numberOptions, setNumberOptions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobDateObj, setDobDateObj] = useState(new Date(1990, 0, 1));
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    pin: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const scrollViewRef = useRef();

  // Form handling
  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First Name is required";
      isValid = false;
    }
    if (!formData.surname.trim()) {
      errors.surname = "Surname is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
      isValid = false;
    } else if (!/^04\d{8}$/.test(formData.phone)) {
      errors.phone =
        "Phone must be a valid Australian mobile (e.g., 0412345678)";
      isValid = false;
    }
    if (!formData.dob.trim()) {
      errors.dob = "Date of Birth is required";
      isValid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      errors.dob = "Date of Birth must be YYYY-MM-DD";
      isValid = false;
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }
    if (!formData.suburb.trim()) {
      errors.suburb = "Suburb is required";
      isValid = false;
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
      isValid = false;
    }
    if (!formData.postcode.trim()) {
      errors.postcode = "Postcode is required";
      isValid = false;
    } else if (!/^\d{4}$/.test(formData.postcode)) {
      errors.postcode = "Postcode must be 4 digits";
      isValid = false;
    }
    if (!formData.pin.trim()) {
      errors.pin = "PIN is required";
      isValid = false;
    } else if (!/^\d{4}$/.test(formData.pin)) {
      errors.pin = "PIN must be exactly 4 digits";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    const formatted = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    setShowSignupForm(false);
    // Reset form data
    setFormData({
      firstName: "",
      surname: "",
      email: "",
      phone: "",
      dob: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
      pin: "",
    });

    await handleSend(formatted);
  };

  const handleSignupIntent = async (userMessage) => {
    const signupKeywords = ["sign up", "signup", "register", "create account"];
    const hasSignupIntent = signupKeywords.some((keyword) =>
      userMessage.toLowerCase().includes(keyword)
    );

    if (hasSignupIntent) {
      setShowSignupForm(true);

      const botMsg = {
        id: chat.length + 2,
        type: "bot",
        text: "I see you'd like to sign up! Please fill out the form below:",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChat((prev) => [...prev, botMsg]);
      return true;
    }
    return false;
  };

  const handleSend = async (msgText, retryWithoutSession = false) => {
    if (!msgText || loading) return;

    const userMsg = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: "user",
      text: msgText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      // Check for signup intent
      if (!retryWithoutSession) {
        const isSignupIntent = await handleSignupIntent(msgText);
        if (isSignupIntent) {
          setLoading(false);
          return;
        }
      }

      let payload;
      if (retryWithoutSession || !sessionId) {
        payload = { query: msgText };
      } else {
        payload = { query: msgText, session_id: sessionId };
      }

      const token = await AsyncStorage.getItem("access_token");
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/chat/query`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorBody || response.statusText}`
        );
      }

      const data = await response.json();

      if (!sessionId && !retryWithoutSession && data.session_id) {
        setSessionId(data.session_id);
        try {
          await AsyncStorage.setItem("chat_session_id", data.session_id);
        } catch (e) {
          // ignore storage errors
        }
      }

      const botText = data?.message || "Sorry, I couldn't understand that.";
      const botMsg = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: "bot",
        text: botText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChat((prev) => [...prev, botMsg]);

      // Handle special cases
      if (isDetailsRequest(botText)) {
        setTimeout(() => {
          setShowSignupForm(true);
          setShowNumberButtons(false);
        }, 300);
      } else if (isNumberSelection(botText)) {
        const numbers = extractNumbers(botText);
        setNumberOptions(numbers);
        setShowNumberButtons(true);
        setShowSignupForm(false);
      } else {
        setShowSignupForm(false);
        setShowNumberButtons(false);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: "bot",
        text: error.message.includes("401")
          ? "Session expired. Please log in again."
          : `Error: ${error.message}. Please try again.`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChat((prev) => [...prev, errorMsg]);

      // Retry without session if session is invalid
      if (error.message.includes("Invalid session") && !retryWithoutSession) {
        await clearSession();
        setTimeout(() => {
          handleSend(msgText, true);
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    handleSend(message);
  };

  // Helper functions
  const isDetailsRequest = (text) => {
    return (
      text.toLowerCase().includes("details") ||
      text.toLowerCase().includes("information")
    );
  };

  const isNumberSelection = (text) => {
    return (
      text.toLowerCase().includes("choose") ||
      text.toLowerCase().includes("select") ||
      text.toLowerCase().includes("option")
    );
  };

  const extractNumbers = (text) => {
    const numbers = text.match(/\d+/g);
    return numbers ? numbers.slice(0, 5) : [];
  };

  const clearSession = async () => {
    setSessionId(null);
    try {
      await AsyncStorage.removeItem("chat_session_id");
    } catch (e) {
      // ignore
    }
  };

  // Date picker handlers
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDobDateObj(selectedDate);
      const formattedDate = selectedDate.toISOString().split("T")[0];
      handleFormChange("dob", formattedDate);
    }
  };

  const handleIosDone = () => {
    setShowDatePicker(false);
    const formattedDate = dobDateObj.toISOString().split("T")[0];
    handleFormChange("dob", formattedDate);
  };

  const handleIosCancel = () => {
    setShowDatePicker(false);
  };

  // Load session on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("chat_session_id");
        if (stored) setSessionId(stored);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <LinearGradient
      colors={theme.gradients.splash}
      start={{ x: 0.85, y: 0.1 }}
      end={{ x: 0.15, y: 0.9 }}
      style={tw`flex-1`}
    >
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-3 mt-12`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-black text-lg font-semibold ml-16`}>
          Flying Kiwi Fitness
        </Text>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={tw`px-4 pb-6`}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {chat.map((msg) =>
            msg.type === "user" ? (
              <View key={msg.id} style={tw`items-end mt-4`}>
                <View
                  style={[
                    tw`px-4 py-3 rounded-2xl`,
                    { backgroundColor: theme.colors.secondary },
                    { maxWidth: "80%" },
                  ]}
                >
                  <Text style={tw`text-white`}>{msg.text}</Text>
                </View>
                <Text style={tw`text-gray-400 text-xs mt-1`}>{msg.time}</Text>
              </View>
            ) : (
              <View
                key={msg.id}
                style={[tw`mt-6 flex-row items-start`, { maxWidth: "90%" }]}
              >
                <LinearGradient
                  colors={theme.AIgradients.linear}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={tw`w-8 h-8 rounded-full items-center justify-center mr-2`}
                >
                  <Ionicons name="sparkles" size={18} color="white" />
                </LinearGradient>

                <View
                  style={[
                    tw`px-4 py-3 rounded-2xl`,
                    {
                      backgroundColor: "white",
                      maxWidth: "85%",
                    },
                  ]}
                >
                  <Text style={tw`text-black`}>{msg.text}</Text>
                </View>
              </View>
            )
          )}

          {loading && (
            <View style={[tw`mt-6 flex-row items-start`, { maxWidth: "90%" }]}>
              <LinearGradient
                colors={theme.AIgradients.linear}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={tw`w-8 h-8 rounded-full items-center justify-center mr-2`}
              >
                <Ionicons name="sparkles" size={18} color="white" />
              </LinearGradient>
              <View
                style={[
                  tw`px-4 py-3 rounded-2xl`,
                  { backgroundColor: "white", maxWidth: "85%" },
                ]}
              >
                <ActivityIndicator size="small" color="#000" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Signup Form */}
        {showSignupForm && (
          <View style={styles.formContainer}>
            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={tw`text-black text-lg font-bold mb-3`}>
                Create Your Account
              </Text>

              <View style={tw`flex-row mb-2`}>
                <View style={tw`flex-1 mr-2`}>
                  <TextInput
                    style={[
                      styles.input,
                      formErrors.firstName && styles.inputError,
                    ]}
                    placeholder="First Name *"
                    placeholderTextColor="#999"
                    value={formData.firstName}
                    onChangeText={(text) => handleFormChange("firstName", text)}
                  />
                  {formErrors.firstName && (
                    <Text style={styles.errorText}>{formErrors.firstName}</Text>
                  )}
                </View>
                <View style={tw`flex-1`}>
                  <TextInput
                    style={[
                      styles.input,
                      formErrors.surname && styles.inputError,
                    ]}
                    placeholder="Surname *"
                    placeholderTextColor="#999"
                    value={formData.surname}
                    onChangeText={(text) => handleFormChange("surname", text)}
                  />
                  {formErrors.surname && (
                    <Text style={styles.errorText}>{formErrors.surname}</Text>
                  )}
                </View>
              </View>

              <View style={tw`mb-2`}>
                <TextInput
                  style={[styles.input, formErrors.email && styles.inputError]}
                  placeholder="Email *"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleFormChange("email", text)}
                />
                {formErrors.email && (
                  <Text style={styles.errorText}>{formErrors.email}</Text>
                )}
              </View>

              <View style={tw`mb-2`}>
                <TextInput
                  style={[styles.input, formErrors.phone && styles.inputError]}
                  placeholder="Phone (04XXXXXXXX) *"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => handleFormChange("phone", text)}
                />
                {formErrors.phone && (
                  <Text style={styles.errorText}>{formErrors.phone}</Text>
                )}
              </View>

              <View style={tw`mb-2`}>
                <TouchableOpacity
                  style={[
                    styles.input,
                    formErrors.dob && styles.inputError,
                    {
                      justifyContent: "center",
                      paddingVertical: 12,
                    },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: formData.dob ? "#000" : "#999" }}>
                    {formData.dob || "Date of Birth (YYYY-MM-DD) *"}
                  </Text>
                </TouchableOpacity>
                {formErrors.dob && (
                  <Text style={styles.errorText}>{formErrors.dob}</Text>
                )}
              </View>

              <View style={tw`mb-2`}>
                <TextInput
                  style={[
                    styles.input,
                    formErrors.address && styles.inputError,
                  ]}
                  placeholder="Address *"
                  placeholderTextColor="#999"
                  value={formData.address}
                  onChangeText={(text) => handleFormChange("address", text)}
                />
                {formErrors.address && (
                  <Text style={styles.errorText}>{formErrors.address}</Text>
                )}
              </View>

              <View style={tw`flex-row mb-2`}>
                <View style={tw`flex-1 mr-2`}>
                  <TextInput
                    style={[
                      styles.input,
                      formErrors.suburb && styles.inputError,
                    ]}
                    placeholder="Suburb *"
                    placeholderTextColor="#999"
                    value={formData.suburb}
                    onChangeText={(text) => handleFormChange("suburb", text)}
                  />
                  {formErrors.suburb && (
                    <Text style={styles.errorText}>{formErrors.suburb}</Text>
                  )}
                </View>
                <View style={tw`w-1/4 mr-2`}>
                  <TextInput
                    style={[
                      styles.input,
                      formErrors.state && styles.inputError,
                    ]}
                    placeholder="State *"
                    placeholderTextColor="#999"
                    value={formData.state}
                    onChangeText={(text) => handleFormChange("state", text)}
                  />
                  {formErrors.state && (
                    <Text style={styles.errorText}>{formErrors.state}</Text>
                  )}
                </View>
                <View style={tw`w-1/4`}>
                  <TextInput
                    style={[
                      styles.input,
                      formErrors.postcode && styles.inputError,
                    ]}
                    placeholder="Postcode *"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={formData.postcode}
                    onChangeText={(text) => handleFormChange("postcode", text)}
                  />
                  {formErrors.postcode && (
                    <Text style={styles.errorText}>{formErrors.postcode}</Text>
                  )}
                </View>
              </View>

              <View style={tw`mb-3`}>
                <TextInput
                  style={[styles.input, formErrors.pin && styles.inputError]}
                  placeholder="4-digit PIN *"
                  placeholderTextColor="#999"
                  secureTextEntry
                  keyboardType="number-pad"
                  maxLength={4}
                  value={formData.pin}
                  onChangeText={(text) => handleFormChange("pin", text)}
                />
                {formErrors.pin && (
                  <Text style={styles.errorText}>{formErrors.pin}</Text>
                )}
              </View>

              <View style={tw`flex-row justify-between`}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowSignupForm(false)}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleFormSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Number Selection Buttons */}
        {showNumberButtons && (
          <View
            style={tw`flex-row flex-wrap gap-2 justify-center p-2 bg-white mx-4 mb-2 rounded-xl`}
          >
            {numberOptions.map((number, index) => (
              <TouchableOpacity
                key={index}
                style={tw`px-4 py-2 bg-blue-500 rounded-full`}
                onPress={() => {
                  setShowNumberButtons(false);
                  handleSend(number);
                }}
              >
                <Text style={tw`text-white`}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Message Input Area */}
        <View
          style={[
            tw`flex-row items-center px-4 py-3 mb-12`,
            { backgroundColor: "rgba(255,255,255,0.05)" },
          ]}
        >
          <TextInput
            style={tw`flex-1 text-black px-4 py-2 rounded-full bg-white`}
            placeholder="What's on your mind?"
            placeholderTextColor="#000000"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
          />

          <LinearGradient
            colors={theme.AIgradients.linear}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={tw`ml-2 w-10 h-10 rounded-full items-center justify-center`}
          >
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons name="arrow-up" size={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>

      {/* Date Picker */}
      {showDatePicker &&
        (Platform.OS === "android" ? (
          <DateTimePicker
            value={dobDateObj}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={onDateChange}
          />
        ) : (
          <Modal transparent animationType="slide">
            <View style={tw`flex-1 justify-end bg-black/50`}>
              <View style={tw`bg-white rounded-t-2xl p-4`}>
                <View style={tw`flex-row justify-between items-center mb-4`}>
                  <TouchableOpacity onPress={handleIosCancel} style={tw`p-2`}>
                    <Text style={tw`text-red-500 font-semibold`}>Cancel</Text>
                  </TouchableOpacity>
                  <Text
                    style={tw`text-center flex-1 font-semibold text-gray-700`}
                  >
                    Select Date of Birth
                  </Text>
                  <TouchableOpacity onPress={handleIosDone} style={tw`p-2`}>
                    <Text style={tw`text-blue-500 font-semibold`}>Done</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ height: 216 }}>
                  <DateTimePicker
                    value={dobDateObj}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    themeVariant="light"
                  />
                </View>
              </View>
            </View>
          </Modal>
        ))}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    maxHeight: 400,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    fontSize: 14,
    color: "#000",
  },
  inputError: {
    borderWidth: 1,
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ChatScreen;
