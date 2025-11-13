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

export const TokenCard = ({ token, onSuccess, onClose }) => {
  const [inputToken, setInputToken] = useState(token);
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async () => {
  //   if (!inputToken.trim()) {
  //     Alert.alert("Error", "Please enter the token");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const accessToken = await AsyncStorage.getItem("access_token");
  //     const customerId = await AsyncStorage.getItem("customer_id");

  //     const custNo = customerId || "526691";

  //     console.log("Submitting payment method:", {
  //       custNo,
  //       paymentTokenId: inputToken,
  //     });

  //     const response = await fetch(
  //       "https://bele.omnisuiteai.com/api/v1/payments/methods",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         body: JSON.stringify({
  //           custNo: custNo,
  //           paymentTokenId: inputToken,
  //         }),
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("Payment method response:", data);

  //     if (!response.ok) {
  //       throw new Error(
  //         data.message || `Failed to add payment method: ${response.status}`
  //       );
  //     }

  //     // 🔥 CAPTURE PAYMENT ID FROM RESPONSE - IT'S ALREADY THERE!
  //     const paymentId = data.data?.paymentId;
  //     const paymentMethodId = data.data?.paymentMethodId;

  //     console.log("✅ Captured paymentId:", paymentId);
  //     console.log("✅ Captured paymentMethodId:", paymentMethodId);

  //     // Store BOTH payment ID and payment method ID
  //     if (paymentId) {
  //       await AsyncStorage.setItem("payment_id", paymentId);
  //       console.log("Stored payment_id:", paymentId);
  //     }

  //     if (paymentMethodId) {
  //       await AsyncStorage.setItem("payment_method_id", paymentMethodId);
  //       console.log("Stored payment_method_id:", paymentMethodId);
  //     }

  //     Alert.alert("Success", "Payment method added successfully!");

  //     onSuccess &&
  //       onSuccess({
  //         success: true,
  //         step: "token_confirmed",
  //         token: inputToken,
  //         paymentId: paymentId, // Pass paymentId to next step
  //         paymentMethodId: paymentMethodId,
  //       });
  //   } catch (error) {
  //     console.error("Token submission error:", error);
  //     Alert.alert(
  //       "Error",
  //       error.message ||
  //         "Failed to add payment method. Please check the token and try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleSubmit = async () => {
  //   if (!inputToken.trim()) {
  //     Alert.alert("Error", "Please enter the token");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const accessToken = await AsyncStorage.getItem("access_token");
  //     const customerId = await AsyncStorage.getItem("customer_id");

  //     const custNo = customerId || "526691";

  //     console.log("Submitting payment method:", {
  //       custNo,
  //       paymentTokenId: inputToken,
  //     });

  //     const response = await fetch(
  //       "https://bele.omnisuiteai.com/api/v1/payments/methods",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         body: JSON.stringify({
  //           custNo: custNo,
  //           paymentTokenId: inputToken,
  //         }),
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("Payment method response:", data);

  //     if (!response.ok) {
  //       throw new Error(
  //         data.message || `Failed to add payment method: ${response.status}`
  //       );
  //     }

  //     // 🔥 FIX: The API returns paymentId, NOT paymentMethodId
  //     const paymentId = data.data?.paymentId;

  //     console.log("✅ Captured paymentId:", paymentId);

  //     // Store paymentId as BOTH payment_id AND payment_method_id
  //     // because the payment processing API expects paymentMethodId
  //     if (paymentId) {
  //       await AsyncStorage.setItem("payment_id", paymentId);
  //       await AsyncStorage.setItem("payment_method_id", paymentId); // Use same ID
  //       console.log("Stored payment_id and payment_method_id:", paymentId);
  //     }

  //     Alert.alert("Success", "Payment method added successfully!");

  //     onSuccess &&
  //       onSuccess({
  //         success: true,
  //         step: "token_confirmed",
  //         token: inputToken,
  //         paymentId: paymentId,
  //         paymentMethodId: paymentId, // Use same ID
  //       });
  //   } catch (error) {
  //     console.error("Token submission error:", error);
  //     Alert.alert(
  //       "Error",
  //       error.message ||
  //         "Failed to add payment method. Please check the token and try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async () => {
    if (!inputToken.trim()) {
      Alert.alert("Error", "Please enter the token");
      return;
    }

    setLoading(true);

    try {
      const accessToken = await AsyncStorage.getItem("access_token");

      // Get the customer number from props instead of AsyncStorage
      const custNo = props.custNo; // This is passed from PlansScreen

      // Validate customer number
      if (!custNo || custNo === "null" || custNo === "undefined") {
        throw new Error("Invalid customer number. Please log in again.");
      }

      console.log("Submitting payment method:", {
        custNo,
        paymentTokenId: inputToken,
      });

      const response = await fetch(
        "https://bele.omnisuiteai.com/api/v1/payments/methods",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            custNo: custNo,
            paymentTokenId: inputToken,
          }),
        }
      );

      const data = await response.json();
      console.log("Payment method response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to add payment method: ${response.status}`
        );
      }

      // Get the payment method ID from the response
      const paymentMethodId = data.data?.id || data.data?.paymentMethodId;

      if (!paymentMethodId) {
        throw new Error("No payment method ID returned from server");
      }

      console.log("✅ Payment method added successfully:", paymentMethodId);

      // Pass the payment method ID to the parent component
      onSuccess &&
        onSuccess({
          success: true,
          paymentMethodId: paymentMethodId,
        });
    } catch (error) {
      console.error("Token submission error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to add payment method. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={[styles.container, tw`rounded-2xl p-4`]}>
      <Text style={[styles.title, tw`text-black font-semibold mb-3`]}>
        Confirm Payment Token
      </Text>

      <TextInput
        style={[styles.input, tw`mb-3`]}
        placeholder="Enter payment token"
        value={inputToken}
        onChangeText={setInputToken}
        placeholderTextColor="#999"
        editable={!loading}
      />

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
          disabled={loading || !inputToken.trim()}
        >
          <Text style={styles.buttonText}>
            {loading ? "Submitting..." : "Submit Token"}
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
