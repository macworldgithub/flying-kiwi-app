// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const PaymentProcessCard = ({ onProcessed, onClose }) => {
//   const [formData, setFormData] = useState({
//     custNo: "526691", // This should come from your state
//     amount: "",
//     paymentId: "",
//     email: "",
//     comment: "",
//   });
//   const [loading, setLoading] = useState(false);

//   // const handleSubmit = async () => {
//   //   if (!formData.amount) {
//   //     Alert.alert("Error", "Please enter amount");
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     const token = await AsyncStorage.getItem("access_token");
//   //     const paymentMethodId = await AsyncStorage.getItem("payment_method_id");
//   //     const customerId = await AsyncStorage.getItem("customer_id");

//   //     console.log("Processing payment with:", {
//   //       custNo: customerId || formData.custNo,
//   //       amount: formData.amount,
//   //       paymentMethodId,
//   //     });

//   //     // Use the correct customer ID
//   //     const custNo = customerId || formData.custNo;

//   //     const response = await fetch(
//   //       "https://bele.omnisuiteai.com/api/v1/payments/process",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //         body: JSON.stringify({
//   //           custNo: custNo,
//   //           amount: formData.amount,
//   //           paymentMethodId: paymentMethodId,
//   //         }),
//   //       }
//   //     );

//   //     const data = await response.json();
//   //     console.log("Payment processing response:", data);

//   //     if (!response.ok) {
//   //       throw new Error(
//   //         data.message || `Payment processing failed: ${response.status}`
//   //       );
//   //     }

//   //     // Store payment ID for activation - handle potential undefined
//   //     const paymentId = data.data?.paymentId || data.paymentId;
//   //     if (paymentId) {
//   //       await AsyncStorage.setItem("payment_id", paymentId);
//   //       console.log("Stored payment_id:", paymentId);
//   //     }

//   //     Alert.alert("Success", "Payment processed successfully!");

//   //     onProcessed &&
//   //       onProcessed({
//   //         success: true,
//   //         paymentId: paymentId,
//   //         message: "Payment processed successfully",
//   //       });
//   //   } catch (error) {
//   //     console.error("Payment processing error:", error);
//   //     Alert.alert("Error", error.message || "Payment processing failed");

//   //     onProcessed &&
//   //       onProcessed({
//   //         success: false,
//   //         message: error.message || "Payment processing failed",
//   //       });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleSubmit = async () => {
//     if (!formData.amount) {
//       Alert.alert("Error", "Please enter amount");
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = await AsyncStorage.getItem("access_token");
//       const paymentMethodId = await AsyncStorage.getItem("payment_method_id");
//       const customerId = await AsyncStorage.getItem("customer_id");

//       console.log("Processing payment with:", {
//         custNo: customerId || formData.custNo,
//         amount: formData.amount,
//         paymentMethodId,
//       });

//       const custNo = customerId || formData.custNo;

//       const response = await fetch(
//         "https://bele.omnisuiteai.com/api/v1/payments/process",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             custNo: custNo,
//             amount: formData.amount,
//             paymentMethodId: paymentMethodId,
//           }),
//         }
//       );

//       const data = await response.json();
//       console.log("Payment processing response:", data);

//       if (!response.ok) {
//         throw new Error(
//           data.message || `Payment processing failed: ${response.status}`
//         );
//       }

//       // 🔥 FIX: Get payment ID from the correct response field
//       const paymentId = data.data?.paymentId || data.paymentId || data.id;

//       if (paymentId) {
//         await AsyncStorage.setItem("payment_id", paymentId);
//         console.log("✅ Stored payment_id for activation:", paymentId);
//       } else {
//         console.warn("⚠️ No paymentId found in response, checking data:", data);
//         // Try to find payment ID in different response formats
//         const possiblePaymentId =
//           data.data?.id || data.transactionId || data.reference;
//         if (possiblePaymentId) {
//           await AsyncStorage.setItem("payment_id", possiblePaymentId);
//           console.log("✅ Stored alternative payment_id:", possiblePaymentId);
//         }
//       }

//       Alert.alert("Success", "Payment processed successfully!");

//       onProcessed &&
//         onProcessed({
//           success: true,
//           paymentId: paymentId,
//           message: "Payment processed successfully",
//         });
//     } catch (error) {
//       console.error("Payment processing error:", error);
//       Alert.alert("Error", error.message || "Payment processing failed");

//       onProcessed &&
//         onProcessed({
//           success: false,
//           message: error.message || "Payment processing failed",
//         });
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <View style={[styles.container, tw`rounded-2xl p-4`]}>
//       <Text style={[styles.title, tw`text-black font-semibold mb-3`]}>
//         Process Payment
//       </Text>

//       <TextInput
//         style={[styles.input, tw`mb-3`]}
//         placeholder="Customer Number"
//         value={formData.custNo}
//         onChangeText={(text) => handleChange("custNo", text)}
//         placeholderTextColor="#999"
//         editable={!loading}
//       />

//       <TextInput
//         style={[styles.input, tw`mb-3`]}
//         placeholder="Amount"
//         value={formData.amount}
//         onChangeText={(text) => handleChange("amount", text)}
//         keyboardType="numeric"
//         placeholderTextColor="#999"
//         editable={!loading}
//       />

//       <TextInput
//         style={[styles.input, tw`mb-3`]}
//         placeholder="Payment ID"
//         value={formData.paymentId}
//         onChangeText={(text) => handleChange("paymentId", text)}
//         placeholderTextColor="#999"
//         editable={!loading}
//       />

//       <TextInput
//         style={[styles.input, tw`mb-3`]}
//         placeholder="Email"
//         value={formData.email}
//         onChangeText={(text) => handleChange("email", text)}
//         keyboardType="email-address"
//         placeholderTextColor="#999"
//         editable={!loading}
//       />

//       <TextInput
//         style={[styles.input, tw`mb-3`]}
//         placeholder="Comment"
//         value={formData.comment}
//         onChangeText={(text) => handleChange("comment", text)}
//         placeholderTextColor="#999"
//         editable={!loading}
//       />

//       <View style={tw`flex-row justify-between`}>
//         <TouchableOpacity
//           style={[styles.button, styles.cancelButton, tw`flex-1 mr-2`]}
//           onPress={onClose}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>Cancel</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, styles.submitButton, tw`flex-1 ml-2`]}
//           onPress={handleSubmit}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? "Processing..." : "Submit Payment"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "white",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 16,
//   },
//   input: {
//     backgroundColor: "#f5f5f5",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 14,
//     color: "#000",
//   },
//   button: {
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   submitButton: {
//     backgroundColor: "#2bb673",
//   },
//   cancelButton: {
//     backgroundColor: "#ccc",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PaymentProcessCard = ({ onProcessed, onClose }) => {
  const [formData, setFormData] = useState({
    amount: "", // Only amount should be entered by user
    email: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async () => {
  //   if (!formData.amount) {
  //     Alert.alert("Error", "Please enter amount");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const token = await AsyncStorage.getItem("access_token");
  //     const paymentMethodId = await AsyncStorage.getItem("payment_method_id");
  //     const customerId = await AsyncStorage.getItem("customer_id");
  //     const paymentId = await AsyncStorage.getItem("payment_id"); // Get stored payment ID

  //     console.log("Processing payment with stored data:", {
  //       custNo: customerId,
  //       amount: formData.amount,
  //       paymentMethodId,
  //       paymentId, // This should already be available
  //     });

  //     if (!paymentId) {
  //       throw new Error(
  //         "Payment ID not found. Please restart the payment process."
  //       );
  //     }

  //     const response = await fetch(
  //       "https://bele.omnisuiteai.com/api/v1/payments/process",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           custNo: customerId,
  //           amount: formData.amount,
  //           paymentMethodId: paymentMethodId,
  //           paymentId: paymentId, // Use the stored payment ID
  //         }),
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("Payment processing response:", data);

  //     if (!response.ok) {
  //       throw new Error(
  //         data.message || `Payment processing failed: ${response.status}`
  //       );
  //     }

  //     Alert.alert("Success", "Payment processed successfully!");

  //     onProcessed &&
  //       onProcessed({
  //         success: true,
  //         paymentId: paymentId,
  //         message: "Payment processed successfully",
  //       });
  //   } catch (error) {
  //     console.error("Payment processing error:", error);
  //     Alert.alert("Error", error.message || "Payment processing failed");

  //     onProcessed &&
  //       onProcessed({
  //         success: false,
  //         message: error.message || "Payment processing failed",
  //       });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async () => {
    if (!formData.amount) {
      Alert.alert("Error", "Please enter amount");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      const paymentId = await AsyncStorage.getItem("payment_id"); // Get stored payment ID
      const customerId = await AsyncStorage.getItem("customer_id");

      console.log("Processing payment with stored data:", {
        custNo: customerId,
        amount: formData.amount,
        paymentId, // This should already be available
      });

      if (!paymentId) {
        throw new Error(
          "Payment ID not found. Please restart the payment process."
        );
      }

      // 🔥 CORRECT PAYLOAD - Match web version exactly
      const payload = {
        custNo: customerId,
        amount: formData.amount,
        paymentId: paymentId, // Use paymentId directly (not paymentMethodId)
        email: formData.email || "", // Include optional fields
        comment: formData.comment || "", // Include optional fields
      };

      console.log("🔍 Sending payload to API:", payload);

      const response = await fetch(
        "https://bele.omnisuiteai.com/api/v1/payments/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload), // Send exact same structure as web
        }
      );

      const data = await response.json();
      console.log("Payment processing response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || `Payment processing failed: ${response.status}`
        );
      }

      Alert.alert("Success", "Payment processed successfully!");

      onProcessed &&
        onProcessed({
          success: true,
          paymentId: paymentId,
          message: "Payment processed successfully",
        });
    } catch (error) {
      console.error("Payment processing error:", error);
      Alert.alert("Error", error.message || "Payment processing failed");

      onProcessed &&
        onProcessed({
          success: false,
          message: error.message || "Payment processing failed",
        });
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={[styles.container, tw`rounded-2xl p-4`]}>
      <Text style={[styles.title, tw`text-black font-semibold mb-3`]}>
        Process Payment
      </Text>

      {/* 🔥 REMOVED Customer Number field - use stored value */}
      {/* 🔥 REMOVED Payment ID field - use stored value */}

      <TextInput
        style={[styles.input, tw`mb-3`]}
        placeholder="Amount"
        value={formData.amount}
        onChangeText={(text) => handleChange("amount", text)}
        keyboardType="numeric"
        placeholderTextColor="#999"
        editable={!loading}
      />

      <TextInput
        style={[styles.input, tw`mb-3`]}
        placeholder="Email (optional)"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        placeholderTextColor="#999"
        editable={!loading}
      />

      <TextInput
        style={[styles.input, tw`mb-3`]}
        placeholder="Comment (optional)"
        value={formData.comment}
        onChangeText={(text) => handleChange("comment", text)}
        placeholderTextColor="#999"
        editable={!loading}
      />

      {/* Show stored payment info for transparency */}
      <View style={[styles.infoContainer, tw`mb-3`]}>
        <Text style={styles.infoText}>
          Payment will be processed using your stored card details
        </Text>
      </View>

      <View style={tw`flex-row justify-between`}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton, tw`flex-1 mr-2`]}
          onPress={onClose}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton, tw`flex-1 ml-2`]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Processing..." : "Submit Payment"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 16,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#000",
  },
  infoContainer: {
    backgroundColor: "#e8f5e8",
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2bb673",
  },
  infoText: {
    fontSize: 12,
    color: "#2d5016",
    fontStyle: "italic",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#2bb673",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
