import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { supabase } from "../../lib/supabase";

export const ComplaintScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const db = {
    collection: (name: string) => ({
      add: async (data: any) => {
        const { data: result, error } = await supabase
          .from(name)
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return result;
      },
    }),
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const user = (await supabase.auth.getUser()).data.user;
    try {
      setLoading(true);

      const complaint = {
        user_id: user.id,
        title,
        description,
        status: "open",
      };

      await db.collection("complaints").add(complaint);

      Alert.alert("Success", "Complaint submitted successfully!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>
        Submit a Complaint
      </Text>
      <Input placeholder="Title" value={title} onChangeText={setTitle} />
      <Input
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <Button
        title="Submit"
        onPress={handleSubmit}
        loading={loading}
        containerStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});
