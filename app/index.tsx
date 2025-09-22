// app/index.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to FRONT PAGE!</Text>

      {/* Navigate to Login page */}
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate("login" as never)}
      />

      <View style={{ height: 20 }} />

      {/* Navigate to Test page */}
      <Button
        title="Go to Test"
        onPress={() => navigation.navigate("test" as never)}
      />
    </View>
  );
}
