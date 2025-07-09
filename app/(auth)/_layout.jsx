import { Redirect } from "expo-router";
import { useAuth , ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const {isSignedIn} = useAuth ()

  if (isSignedIn){
    return <Redirect href={'/'} />
  }

  return <Stack screenOptions={{ headerShown: false}} />
}



















// app/(app)/_layout.jsx
// import { useAuth, ClerkProvider } from "@clerk/clerk-expo";
// import { Redirect, Stack } from "expo-router";
// import React from "react";
// import { Button } from "react-native";

// export default function AppLayout() {

//   const { isSignedIn } = useAuth();

//     if ( isSignedIn) return <Redirect href={"/"}/>;
//   return < Stack screenOptions={{ headerShown: false}} />
// }