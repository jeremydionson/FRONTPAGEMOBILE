// app/test.tsx
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, Text, View } from "react-native";

export default function Test() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>This is a Test Page</Text>

      <Button
        title="Go Back Home"
        onPress={() => navigation.navigate("index" as never)}
      />
    </View>
  );
}
