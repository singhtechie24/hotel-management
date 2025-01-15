import React from "react";
import { Button } from "react-native-elements";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";

export const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    const auth = {
      signOut: async () => {
        return supabase.auth.signOut();
      },
    };

    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" as never }],
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return <Button title="Logout" type="clear" onPress={handleLogout} />;
};
