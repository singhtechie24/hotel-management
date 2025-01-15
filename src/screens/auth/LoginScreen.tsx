import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { supabase } from "../../lib/supabase";

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = {
    signInWithEmailAndPassword: async (email: string, password: string) => {
      return supabase.auth.signInWithPassword({ email, password });
    },
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await auth.signInWithEmailAndPassword(email, password);

      if (error) throw error;

      // Check user role from metadata
      const role = user?.user_metadata?.role || "customer";

      // Navigate based on role
      switch (role) {
        case "admin":
          navigation.replace("AdminDashboard");
          break;
        case "staff":
          navigation.replace("StaffDashboard");
          break;
        default:
          navigation.replace("CustomerTabs");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        Hotel Management
      </Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Login"
        onPress={handleLogin}
        loading={loading}
        containerStyle={styles.button}
      />
      <Button
        title="Register"
        type="clear"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
  },
});
