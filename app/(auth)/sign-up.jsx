// app/(auth)/sign-up.jsx
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { styles as Styles } from "../../assets/style/auth.styles";
import worker from "../../assets/images/worker.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
        Alert.alert("Invalid email", "Please enter a valid email address.");
        return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.create({
        emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(app)");
      } else {
        // This can happen in other edge cases, but not for verification.
        console.log(JSON.stringify(result, null, 2));
      }

    } catch (err) {
      // Handle errors (e.g., email already exists)
      console.error("Sign-up error:", JSON.stringify(err, null, 2));
      const firstError = err?.errors?.[0];
      Alert.alert("Error", firstError?.longMessage || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={39}
    >
      <View style={Styles.container}>
        <Image source={worker} style={Styles.illustration} />

        <Text style={Styles.title}>Create Account</Text>

        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email Address"
          onChangeText={setEmailAddress}
          style={Styles.input}
        />
        <TextInput
          value={password}
          placeholder="Password"
          secureTextEntry={false}
          onChangeText={setPassword}
          style={Styles.input}
        />

        <TouchableOpacity style={Styles.button} onPress={onSignUpPress}>
          <Text style={Styles.buttonText}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View style={Styles.footerContainer}>
          <Text style={Styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
            <Text style={Styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}