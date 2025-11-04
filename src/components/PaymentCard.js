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

export const PaymentCard = ({ onTokenReceived, onClose }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !cardDetails.cardNumber ||
      !cardDetails.expiryDate ||
      !cardDetails.cvv ||
      !cardDetails.name
    ) {
      Alert.alert("Error", "Please fill all card details");
      return;
    }

    setLoading(true);

    // Simulate payment processing and token generation
    setTimeout(() => {
      const mockToken = `tok_${Math.random().toString(36).substr(2, 9)}`;
      onTokenReceived(mockToken);
      setLoading(false);
    }, 2000);
  };

  return (
    <View style={[styles.container, tw`rounded-2xl p-4`]}>
      <Text style={[styles.title, tw`text-black font-semibold mb-3`]}>
        Enter Card Details
      </Text>

      <TextInput
        style={[styles.input, tw`mb-3`]}
        placeholder="Cardholder Name"
        value={cardDetails.name}
        onChangeText={(text) =>
          setCardDetails((prev) => ({ ...prev, name: text }))
        }
        placeholderTextColor="#999"
      />

      <TextInput
        style={[styles.input, tw`mb-3`]}
        placeholder="Card Number"
        value={cardDetails.cardNumber}
        onChangeText={(text) =>
          setCardDetails((prev) => ({ ...prev, cardNumber: text }))
        }
        keyboardType="numeric"
        placeholderTextColor="#999"
        maxLength={16}
      />

      <View style={tw`flex-row mb-3`}>
        <TextInput
          style={[styles.input, tw`flex-1 mr-2`]}
          placeholder="MM/YY"
          value={cardDetails.expiryDate}
          onChangeText={(text) =>
            setCardDetails((prev) => ({ ...prev, expiryDate: text }))
          }
          placeholderTextColor="#999"
          maxLength={5}
        />

        <TextInput
          style={[styles.input, tw`flex-1`]}
          placeholder="CVV"
          value={cardDetails.cvv}
          onChangeText={(text) =>
            setCardDetails((prev) => ({ ...prev, cvv: text }))
          }
          keyboardType="numeric"
          placeholderTextColor="#999"
          maxLength={3}
        />
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
            {loading ? "Processing..." : "Pay Now"}
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
