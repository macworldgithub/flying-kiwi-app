// /** @format */
// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { Ionicons } from "@expo/vector-icons";
// import { theme } from "../utils/theme";
// import { LinearGradient } from "expo-linear-gradient";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const ChatScreen = ({ navigation }) => {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([
//     {
//       id: 1,
//       type: "bot",
//       text: "Hey there 👋 I'm your AI assistant! How can I help you today?",
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(null); // store session id from API

//   const scrollViewRef = useRef();

//   const sendMessage = async () => {
//     if (!message.trim() || loading) return;

//     const userMsg = {
//       id: chat.length + 1,
//       type: "user",
//       text: message.trim(),
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     setChat((prev) => [...prev, userMsg]);
//     setMessage("");
//     setLoading(true);

//     try {
//       // Retrieve the access token from AsyncStorage
//       const token = await AsyncStorage.getItem("access_token");
//       if (!token) {
//         throw new Error("No authentication token found. Please log in again.");
//       }

//       const payload = sessionId
//         ? { query: userMsg.text, session_id: sessionId }
//         : { query: userMsg.text };

//       const response = await fetch("https://bele.omnisuiteai.com/chat/query", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("API Response:", data);

//       // store session id if first time
//       if (!sessionId && data.session_id) {
//         setSessionId(data.session_id);
//       }

//       const botMsg = {
//         id: chat.length + 2,
//         type: "bot",
//         text: data?.message || "Sorry, I couldn’t understand that.",
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       };

//       setChat((prev) => [...prev, botMsg]);
//     } catch (error) {
//       console.error("Chat error:", error);
//       const errorMsg = {
//         id: chat.length + 2,
//         type: "bot",
//         text: error.message.includes("401")
//           ? "Session expired. Please log in again."
//           : "Oops 😅 Something went wrong. Please try again.",
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       };
//       setChat((prev) => [...prev, errorMsg]);
//     } finally {
//       setLoading(false);
//     }
//   };

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

//       {/* Chat Messages */}
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

//                 <LinearGradient
//                   colors={theme.AIgradients.linear}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={tw`p-[1px] rounded-2xl flex-shrink`}
//                 >
//                   <View
//                     style={[
//                       tw`px-4 py-3 rounded-2xl`,
//                       {
//                         backgroundColor: "rgba(255,255,255,0.05)",
//                         maxWidth: "85%",
//                       },
//                     ]}
//                   >
//                     <Text style={tw`text-white`}>{msg.text}</Text>
//                   </View>
//                 </LinearGradient>
//               </View>
//             )
//           )}

//           {/* Bot Typing Indicator */}
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
//                   tw`px-4 py-3 rounded-2xl bg-gray-700`,
//                   { maxWidth: "85%" },
//                 ]}
//               >
//                 <ActivityIndicator size="small" color="#fff" />
//               </View>
//             </View>
//           )}
//         </ScrollView>

//         {/* Message Input Area */}
//         <View
//           style={[
//             tw`flex-row items-center px-4 py-3 mb-12`,
//             { backgroundColor: "rgba(255,255,255,0.05)" },
//           ]}
//         >
//           <TextInput
//             style={tw`flex-1 text-white px-4 py-2 rounded-full bg-gray-800`}
//             placeholder="Type your message..."
//             placeholderTextColor="#aaa"
//             value={message}
//             onChangeText={setMessage}
//             onSubmitEditing={sendMessage}
//           />

//           <LinearGradient
//             colors={theme.AIgradients.linear}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={tw`ml-2 w-10 h-10 rounded-full items-center justify-center`}
//           >
//             <TouchableOpacity onPress={sendMessage}>
//               <Ionicons name="arrow-up" size={20} color="white" />
//             </TouchableOpacity>
//           </LinearGradient>
//         </View>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// };

// export default ChatScreen;

// /** @format */
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { Ionicons } from "@expo/vector-icons";
// import { theme } from "../utils/theme";
// import { LinearGradient } from "expo-linear-gradient";

// const ChatScreen = ({ navigation }) => {
//   const [message, setMessage] = useState("");

//   return (
//     <LinearGradient
//       colors={theme.gradients.splash}
//       start={{ x: 0.85, y: 0.1 }}
//       end={{ x: 0.15, y: 0.9 }}
//       style={tw`flex-1`}
//     >
//       {/* Header */}
//       <View style={tw`flex-row items-center px-4 py-3 mt-12`}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={tw`text-black text-lg font-semibold ml-16`}>
//           Flying Kiwi Fitness
//         </Text>
//       </View>

//       {/* Chat Messages */}
//       <KeyboardAvoidingView
//         style={tw`flex-1`}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           contentContainerStyle={tw`px-4 pb-6`}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* USER MESSAGE */}
//           <View style={tw`items-end mt-4`}>
//             <View
//               style={[
//                 tw`px-4 py-3 rounded-2xl `,
//                 { backgroundColor: theme.colors.secondary },
//                 { maxWidth: "80%" },
//               ]}
//             >
//               <Text style={tw`text-white`}>
//                 Can you help me create a weekly fitness plan?
//               </Text>
//             </View>

//             <Text style={tw`text-gray-400 text-xs mt-1`}>8:20 PM</Text>
//           </View>

//           {/* BOT MESSAGE */}
//           <View style={[tw`mt-6 flex-row items-start`, { maxWidth: "90%" }]}>
//             <LinearGradient
//               colors={theme.AIgradients.linear}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={tw`w-8 h-8 rounded-full items-center justify-center mr-2`}
//             >
//               <Ionicons name="sparkles" size={18} color="white" />
//             </LinearGradient>

//             <View
//               style={[
//                 tw`px-4 py-3 rounded-2xl`,
//                 {
//                   backgroundColor: "white",
//                   maxWidth: "85%",
//                 },
//               ]}
//             >
//               <Text style={tw`text-black`}>
//                 Tell me about your workout routine and fitness goals so I can
//                 create the right plan for you.
//               </Text>
//             </View>
//           </View>

//           {/* Placeholder Image */}

//           {/* USER MESSAGE */}
//           <View style={tw`items-end mt-4`}>
//             <View
//               style={[
//                 tw`px-4 py-3 rounded-2xl `,
//                 { backgroundColor: theme.colors.secondary },
//                 { maxWidth: "80%" },
//               ]}
//             >
//               <Text style={tw`text-white`}>
//                 That mountain looks amazing! Where is it?
//               </Text>
//             </View>
//             <Text style={tw`text-gray-400 text-xs mt-1`}>8:20 PM</Text>
//           </View>

//           {/* BOT MESSAGE */}
//           <View style={[tw`mt-6 flex-row items-start`, { maxWidth: "90%" }]}>
//             <LinearGradient
//               colors={theme.AIgradients.linear}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={tw`w-8 h-8 rounded-full items-center justify-center mr-2`}
//             >
//               <Ionicons name="sparkles" size={18} color="white" />
//             </LinearGradient>

//             <View
//               style={[
//                 tw`px-4 py-3 rounded-2xl`,
//                 {
//                   backgroundColor: "white",
//                   maxWidth: "85%",
//                 },
//               ]}
//             >
//               <Text style={tw`text-black`}>
//                 That’s the Annapurna Circuit in Nepal, one of the most famous
//                 trekking routes in the world. Known for breathtaking landscapes
//                 and cultural experiences.
//               </Text>
//             </View>
//           </View>
//         </ScrollView>

//         {/* MESSAGE INPUT AREA */}
//         <View
//           style={[
//             tw`flex-row items-center px-4 py-3 mb-12`,
//             { backgroundColor: "rgba(255,255,255,0.05)" },
//           ]}
//         >
//           <TextInput
//             style={tw`flex-1 text-black px-4 py-2 rounded-full bg-white`}
//             placeholder="What’s on your mind?"
//             placeholderTextColor="#000000"
//             value={message}
//             onChangeText={setMessage}
//           />

//           <LinearGradient
//             colors={theme.AIgradients.linear}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={tw`ml-2 w-10 h-10 rounded-full items-center justify-center`}
//           >
//             <TouchableOpacity>
//               <Ionicons name="arrow-up" size={20} color="white" />
//             </TouchableOpacity>
//           </LinearGradient>
//         </View>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// };

// export default ChatScreen;

/** @format */
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../utils/theme";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hey there 👋 I'm your AI assistant! How can I help you today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = {
      id: chat.length + 1,
      type: "user",
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("No authentication token found.");

      const payload = sessionId
        ? { query: userMsg.text, session_id: sessionId }
        : { query: userMsg.text };

      const response = await fetch("https://bele.omnisuiteai.com/chat/query", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!sessionId && data.session_id) setSessionId(data.session_id);

      const botMsg = {
        id: chat.length + 2,
        type: "bot",
        text: data?.message || "Sorry, I couldn’t understand that.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChat((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        id: chat.length + 2,
        type: "bot",
        text: error.message.includes("401")
          ? "Session expired. Please log in again."
          : "Oops 😅 Something went wrong. Please try again.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChat((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Message Input Area */}
        <View
          style={[
            tw`flex-row items-center px-4 py-3 mb-12`,
            { backgroundColor: "rgba(255,255,255,0.05)" },
          ]}
        >
          <TextInput
            style={tw`flex-1 text-black px-4 py-2 rounded-full bg-white`}
            placeholder="What’s on your mind?"
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
    </LinearGradient>
  );
};

export default ChatScreen;
