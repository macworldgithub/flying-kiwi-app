import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { API_BASE_URL } from "../utils/config";

export const PaymentProcessCard = ({
  custNo: propCustNo,
  amount: propAmount,
  email: propEmail,
  token,
  plan,
  onProcessed,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      const formData = {
        custNo: propCustNo || "",
        amount: propAmount ? `${propAmount}` : "",
        paymentId: token || "",
        email: propEmail || "",
        comment: `Plan: ${plan?.planName || plan?.name || ""}`,
      };

      if (!formData.amount || !formData.paymentId || !formData.email) {
        const error = new Error("Missing required payment information");
        handlePaymentError(error);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}api/v1/payments/process`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log("[PaymentProcessCard] Payment processing response", data);

        if (!response.ok) {
          throw new Error(data.message || "Payment processing failed");
        }

        const result = {
          success: true,
          message: "Payment processed successfully!",
        };

        // Small delay to show loading indicator
        setTimeout(() => {
          onProcessed(result);
        }, 1000);
      } catch (error) {
        handlePaymentError(error);
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [propCustNo, propAmount, propEmail, token, plan, onProcessed]);

  const handlePaymentError = (error) => {
    console.error("Payment processing error:", error);
    const result = {
      success: false,
      message: error.message || "Payment processing failed",
    };
    onProcessed(result);
  };

  // Only show loading indicator, no form UI
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: "100%",
    elevation: 5,
  },
  title: {
    fontSize: 16,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
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
    backgroundColor: "#10B981",
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
