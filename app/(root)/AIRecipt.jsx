import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,FlatList, RefreshControl
} from "react-native";
import AIAPIReceipt, { extractReceiptDataAPI } from "../../components/API";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { COLORS } from "../../assets/constants/colors";
import { styles } from "../../assets/style/AIRecipt";
import { API_URL } from "../../assets/constants/API";
import { Link, useRouter } from "expo-router";


const sendExtractedReceiptToAPI = async (receiptData, user, setIsLoading) => {
  console.log("Submitting extracted transaction...");

  if (!receiptData.title?.trim()) {
    Alert.alert("Error", "Missing receipt title");
    return;
  }

  if (
    !receiptData.amount ||
    isNaN(parseFloat(receiptData.amount)) ||
    parseFloat(receiptData.amount) <= 0
  ) {
    Alert.alert("Error", "Invalid or missing amount");
    return;
  }

  const amount =
    receiptData.type === "income"
      ? Math.abs(parseFloat(receiptData.amount))
      : -Math.abs(parseFloat(receiptData.amount));

  const payload = {
    user_id: user.id,
    title: receiptData.title,
    amount,
    category: "other",
    type: receiptData.type || "expense",
    timestamp: receiptData.timestamp || new Date().toISOString(),
  };

  setIsLoading(true);
  try {
    console.log("Sending extracted payload:", payload);

    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.log("Raw error response:", text);
      throw new Error("Failed to save extracted transaction");
    }

    Alert.alert("Success", "Extracted transaction saved");
  } catch (error) {
    Alert.alert("Error", error.message || "Failed to save transaction");
  } finally {
    setIsLoading(false);
  }
};

const Receipt = () => {
  const { user } = useUser();
    const router = useRouter();
  const [receipts, setReceipts] = useState([]);
  const [extractedResults, setExtractedResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadReceipts = async () => {
      try {
        const savedString = await AsyncStorage.getItem("savedReceipts");
        const saved = savedString ? JSON.parse(savedString) : [];
        setReceipts(saved);
      } catch (error) {
        console.error("Error loading receipts:", error);
      }
    };
    loadReceipts();
  }, []);

  const clearReceipts = async () => {
    try {
      await AsyncStorage.removeItem("savedReceipts");
      setReceipts([]);
      Alert.alert("Success", "All saved receipts deleted.");
    } catch (error) {
      console.error("Error clearing receipts:", error);
      Alert.alert("Error", "Failed to delete receipts.");
    }
  };

  const takePicture = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission required", "Camera access is needed.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
      const updatedReceipts = [...receipts, base64Img];
      setReceipts(updatedReceipts);
      await AsyncStorage.setItem("savedReceipts", JSON.stringify(updatedReceipts));
      Alert.alert("Saved", "Picture saved and ready for API.");
    }
  };

  const sendToAPI = async (imageUri, index) => {
    Alert.alert("Sending...", "Processing image through AI...");
    const base64Only = imageUri.replace(/^data:image\/\w+;base64,/, "");
    try {
      const result = await extractReceiptDataAPI(base64Only);
      setExtractedResults((prev) => ({ ...prev, [index]: result }));

      if (result?.title && result?.amount && result?.type) {
        await sendExtractedReceiptToAPI(result, user, setIsLoading);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to extract receipt data.");
      console.error(err);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={takePicture} style={styles.addButton}>
            <Ionicons name="scan-outline" size={20} color="#FFF" />
            <Text style={styles.ButtonText}>Scanner</Text>
          </TouchableOpacity>    
          <TouchableOpacity onPress={() => router.push("/")} style={styles.addButton}>
            <Ionicons name="chevron-back-circle-outline" size={20} color="#FFF" />
            <Text style={styles.ButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      <FlatList
  style={styles.transactionsList}
  contentContainerStyle={styles.transactionsListContent}
  data={receipts}
  keyExtractor={(_, index) => index.toString()}
  renderItem={({ item, index }) => (
    <View
      style={{
        backgroundColor: "#f8f9fa",
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
      }}
    >
      <Image
        source={{ uri: item }}
        style={{ width: "100%", height: 200, borderRadius: 10 }}
        resizeMode="cover"
      />

      <TouchableOpacity onPress={() => sendToAPI(item, index)} style={styles.addButton}>
        <Ionicons name="chevron-up-circle-outline" size={20} color="#FFF" />
        <Text style={styles.ButtonText}>Extract</Text>
      </TouchableOpacity>

      {extractedResults[index] && (
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              backgroundColor: "#e0f7fa",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 14, color: "#333" }}>
              Title: {extractedResults[index]?.title ?? "N/A"}
            </Text>
            <Text style={{ fontSize: 14, color: "#333" }}>
              Amount: ${extractedResults[index]?.amount ?? "N/A"}
            </Text>
            <Text style={{ fontSize: 14, color: "#333" }}>
              Type: {extractedResults[index]?.type ?? "N/A"}
            </Text>
            {/* <Text style={{ fontSize: 12, color: "#666" }}>
              Timestamp: {extractedResults[index]?.timestamp ?? "N/A"}
            </Text> */}
          </View>
        </View>
      )}
    </View>
  )}
  ListEmptyComponent={<AIAPIReceipt />}
  ListFooterComponent={
    receipts.length > 0 && (
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <TouchableOpacity onPress={clearReceipts} style={styles.addButton}>
          <Ionicons name="trash-outline" size={20} color="#FFF" />
          <Text style={styles.ButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    )
  }
  showsVerticalScrollIndicator={false}
/>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

export default Receipt;
