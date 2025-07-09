import { useClerk } from "@clerk/clerk-expo";
import { Alert, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "@/assets/style/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../assets/constants/colors";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/sign-in");
          } catch (err) {
            console.error("Error signing out:", err);
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
};
