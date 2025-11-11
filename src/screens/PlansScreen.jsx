import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/Feather";
import { API_BASE_URL } from "../utils/config";
import { theme } from "../utils/theme";
import axios from "axios";
import { Alert } from "react-native";

export default function PlansScreen() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { customerNo } = route.params || {};
  // Add this useEffect to debug the incoming params
  useEffect(() => {
    console.log("Customer No from params:", customerNo);
    console.log("Current plan:", currentPlan);
    console.log("All plans:", plans);
  }, [customerNo, currentPlan, plans]);
  const fetchCurrentPlan = async (customerNo) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}api/v1/customers/${customerNo}/services`,
        { headers: { accept: "application/json" } }
      );
      const service = response.data?.data?.services?.serviceDetails?.[0];
      if (service) {
        setCurrentPlan({
          planNo: service.planNo,
          planName: service.planName,
        });
      }
      return service?.planNo;
    } catch (error) {
      console.error("Error fetching current plan:", error);
      return null;
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get the current plan using customer number
      const currentPlanNo = await fetchCurrentPlan(customerNo);

      // Then fetch all plans
      const response = await axios.get(`${API_BASE_URL}api/v1/orders/plans`);
      if (response.data?.data?.groupPlan) {
        setPlans(response.data.data.groupPlan);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError("Failed to load plans. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPlans();
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const renderPlanItem = ({ item }) => {
    const isCurrentPlan =
      currentPlan && item.planNo.toString() === currentPlan.planNo.toString();

    return (
      <View
        style={[
          styles.planCard,
          isCurrentPlan && styles.currentPlan,
          isCurrentPlan && styles.disabledPlan,
        ]}
      >
        <View style={tw`flex-1`}>
          <View style={tw`flex-row justify-between items-start`}>
            <Text
              style={[
                tw`text-lg font-semibold`,
                isCurrentPlan && { color: theme.colors.primary },
              ]}
            >
              {item.planName}
            </Text>
            {isCurrentPlan && (
              <View style={styles.currentBadge}>
                <Text style={tw`text-white text-xs font-medium`}>
                  Current Plan
                </Text>
              </View>
            )}
          </View>
          <View style={tw`mt-2`}>
            <Text style={tw`text-gray-600 text-sm`}>
              Plan No: {item.planNo}
            </Text>
            <Text style={tw`text-gray-500 text-sm`}>
              Usage Type: {item.usageType}
            </Text>
          </View>
        </View>
        {!isCurrentPlan ? (
          <TouchableOpacity
            style={[
              styles.upgradeButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => {
              Alert.alert("Upgrade Plan", `You've selected ${item.planName}`);
            }}
          >
            <Text style={tw`text-white font-medium`}>Upgrade</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.upgradeButton, { backgroundColor: "#e5e7eb" }]}>
            <Text style={tw`text-gray-500 font-medium`}>Current Plan</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[tw`flex-1 bg-gray-50`, styles.container]}>
        <View style={tw`p-4 border-b border-gray-200 bg-white`}>
          <Text style={tw`text-xl font-bold`}>Available Plans</Text>
        </View>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={tw`mt-4 text-gray-600`}>Loading plans...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[tw`flex-1 bg-gray-50`, styles.container]}>
      <View style={tw`p-4 border-b border-gray-200 bg-white`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-4`}
          >
            <Icon name="arrow-left" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold text-gray-900`}>
            Available Plans
          </Text>
        </View>
      </View>

      {error ? (
        <View style={tw`flex-1 justify-center items-center p-6`}>
          <Icon
            name="alert-circle"
            size={48}
            color={theme.colors.danger}
            style={tw`mb-4`}
          />
          <Text style={tw`text-center text-gray-700 text-base mb-6`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchPlans}
            style={[styles.retryButton, { borderColor: theme.colors.primary }]}
          >
            <Text style={[tw`font-medium`, { color: theme.colors.primary }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // <FlatList
        //   data={plans}
        //   renderItem={renderPlanItem}
        //   keyExtractor={(item) => item.planNo.toString()}
        //   contentContainerStyle={tw`p-4`}
        //   showsVerticalScrollIndicator={false}
        //   refreshing={refreshing}
        //   onRefresh={onRefresh}
        //   ListEmptyComponent={
        //     <View style={tw`flex-1 items-center justify-center p-8`}>
        //       <Icon
        //         name="package"
        //         size={48}
        //         color={theme.colors.gray}
        //         style={tw`mb-4`}
        //       />
        //       <Text style={tw`text-center text-gray-500`}>
        //         No plans available at the moment.
        //       </Text>
        //     </View>
        //   }
        // />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-10`}
        >
          {currentPlan && (
            <View
              style={[
                tw`mx-4 my-3 p-4 rounded-xl`,
                {
                  backgroundColor: "white",
                  borderWidth: 1.5,
                  borderColor: theme.colors.primary,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                },
              ]}
            >
              <Text style={[tw`text-base font-semibold text-gray-900 mb-1`]}>
                Current Plan
              </Text>
              <Text style={[tw`text-lg font-bold text-blue-600`]}>
                {currentPlan.planName}
              </Text>
              <Text style={[tw`text-gray-700 text-sm mt-1`]}>
                Plan No: {currentPlan.planNo}
              </Text>
              <Text style={[tw`text-gray-500 text-sm`]}>
                Usage Type:{" "}
                {plans.find(
                  (p) => p.planNo.toString() === currentPlan.planNo.toString()
                )?.usageType || "N/A"}
              </Text>
            </View>
          )}

          <FlatList
            data={plans.filter(
              (p) => p.planNo.toString() !== currentPlan?.planNo?.toString()
            )}
            renderItem={renderPlanItem}
            keyExtractor={(item) => item.planNo.toString()}
            contentContainerStyle={tw`p-4`}
            scrollEnabled={false}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  planCard: [
    tw`bg-white p-5 rounded-xl mb-4 border border-gray-200`,
    {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
  ],
  currentPlan: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    backgroundColor: "rgba(59, 130, 246, 0.03)",
  },
  disabledPlan: {
    opacity: 0.7,
  },
  currentBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  upgradeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
  },
};
