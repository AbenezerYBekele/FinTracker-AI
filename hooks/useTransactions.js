import { useCallback, useState } from "react";
import { Alert } from "react-native";
import{ API_URL } from "../assets/constants/API"


// const API_URL = "https://aireceiptscanner.onrender.com";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch transactions: ${response.status} - ${text}`);
      }
      const data = await response.json();
      setTransactions(data);
      console.log("Fetched transactions:", data);
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch summary: ${response.status} - ${text}`);
      }
      const data = await response.json();
      setSummary(data);
      console.log("Fetched summary:", data);
    } catch (error) {
      console.error("Error fetching summary:", error.message);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete transaction: ${response.status} - ${text}`);
      }
      await loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
