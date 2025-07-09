// app/(auth)/sign-in.jsx
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, Button, Text, Alert, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles as Styles } from "../../assets/style/auth.styles";
import money2 from "../../assets/images/money2.png"; 

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(app)"); // Navigate to the main app screen
      } else {
        Alert.alert("Error", "Could not sign in.");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors?.[0]?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView style={{ flex:1}} 
         contentContainerStyle= {{ flexGrow: 1}}
         enableOnAndroid= {true}
         enableAutomaticScroll={true}
         extraScrollHeight={39}
         >
            <View style={Styles.container}>
            <Image
                source={money2}
                style={Styles.illustration}
                />
      <Text style={Styles.title}>Sign In</Text>
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
        secureTextEntry = {false}
        onChangeText={setPassword}
        style={Styles.input}
      />
      
      <TouchableOpacity
        style={Styles.button}
        onPress={() => {onSignInPress()}} >
            <Text style={Styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

      <View style={Styles.footerContainer}>
        <Text style={Styles.footerText}> Don't have an account? </Text>
         <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
          <Text style={Styles.link}>Sign Up</Text>
         </TouchableOpacity>
      </View>
    </View>
        </KeyboardAwareScrollView>
  );
}