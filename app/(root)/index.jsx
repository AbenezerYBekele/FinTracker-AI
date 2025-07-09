import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text,Alert, View, Image, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import { SignOutButton } from "../../components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import { styles } from "../../assets/style/home.styles";
import PageLoader from "../../components/PageLoader";
import icons from "../../assets/images/icons.png";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import {TransactionItem} from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound"

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false)


  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user?.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]); 

  // Define the handleDelete function
  const handleDelete = (id) => {
    Alert.alert("delete Transaction", "are you sure want to delete this transaction?", [
      { text: "cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  };

  if (isLoading && !refreshing) {
    return <PageLoader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={icons}
              style={styles.headerLogo}
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                Welcome
              </Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <SignOutButton />
            <TouchableOpacity style={styles.Button} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={() => router.push("/AIRecipt")}>
              <Ionicons name="scan" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Scanner</Text>
            </TouchableOpacity>
            
          </View>
        </View>
        <BalanceCard summary={summary} />
      </View>

      {/* Corrected FlatList implementation */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}