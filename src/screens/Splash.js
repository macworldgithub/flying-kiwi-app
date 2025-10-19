// import React, { useEffect } from "react";
// import { View, Text, Image } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import tw from "tailwind-react-native-classnames";
// import { theme } from "../utils/theme";
// const Splash = () => {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace("Login");
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     // <LinearGradient
//     //   colors={theme.gradients.splash}
//     //   start={{ x: 0, y: 0 }}
//     //   end={{ x: 1, y: 1 }}
//     //   style={tw`flex-1 items-center justify-center`}
//     // >
//     //   {/* Logo */}
//     //   <View style={tw`items-center`}>
//     //     <Text style={tw`text-lg font-bold text-black`}>
//     //       Flying Kiwi Fitness
//     //     </Text>
//     //   </View>
//     // </LinearGradient>

//     <LinearGradient
//       colors={theme.gradients.splash} // ["#A9D7F1", "#F9F4F8", "#F8CFF3"]
//       start={{ x: 0.85, y: 0.1 }} // blue starts near top-right
//       end={{ x: 0.15, y: 0.9 }} // pink fades to bottom-left
//       style={tw`flex-1 items-center justify-center`}
//     >
//       {/* Your Splash Screen Content */}
//       <Text style={tw`text-lg font-bold text-black mb-3`}>
//         Flying Kiwi Fitness
//       </Text>

//       {/* Example progress bar */}
//       <View style={tw`w-48 h-1.5 bg-gray-300 rounded-full`}>
//         <View
//           style={[
//             tw`h-1.5 rounded-full`,
//             { width: "50%", backgroundColor: "#C653EF" },
//           ]}
//         />
//       </View>
//     </LinearGradient>
//   );
// };

// export default Splash;

/** @format */
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import tw from "tailwind-react-native-classnames";
import { theme } from "../utils/theme";

const Splash = () => {
  const navigation = useNavigation();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      navigation.replace("Login");
    });
  }, []);

  const widthAnim = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <LinearGradient
      colors={theme.gradients.splash} // soft pink-blue background
      start={{ x: 0.85, y: 0.1 }}
      end={{ x: 0.15, y: 0.9 }}
      style={tw`flex-1 items-center justify-center`}
    >
      {/* App Name */}
      <Text style={tw`text-2xl font-extrabold text-black mb-6`}>
        Flying Kiwi Fitness
      </Text>

      {/* Gradient Progress Bar */}
      <View
        style={[
          tw`w-48 h-1.5 bg-gray-300 rounded-full overflow-hidden`,
          { backgroundColor: "rgba(0,0,0,0.1)" },
        ]}
      >
        <Animated.View style={{ width: widthAnim, height: "100%" }}>
          <LinearGradient
            colors={[theme.colors.secondary, theme.colors.primary]} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`flex-1 rounded-full`}
          />
        </Animated.View>
      </View>

      
    </LinearGradient>
  );
};

export default Splash;
