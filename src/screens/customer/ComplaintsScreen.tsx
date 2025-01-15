import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Button, Text, ListItem } from "react-native-elements";
import { supabase } from "../../lib/supabase";
import { Complaint } from "../../types";

export const ComplaintsScreen = ({ navigation }: any) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", user?.id);

      if (!error && data) {
        setComplaints(data);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleNewComplaint = () => {
    navigation.navigate("Complaint");
  };

  return (
    <ScrollView style={styles.container}>
      <Button
        title="New Complaint"
        onPress={handleNewComplaint}
        containerStyle={styles.button}
      />
      {complaints.map((complaint) => (
        <Card key={complaint.id}>
          <Card.Title>{complaint.title}</Card.Title>
          <Card.Divider />
          <Text style={styles.description}>{complaint.description}</Text>
          <ListItem>
            <ListItem.Content>
              <ListItem.Subtitle>
                Status: {complaint.status.replace("_", " ").toUpperCase()}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </Card>
      ))}
      {complaints.length === 0 && (
        <Text style={styles.noComplaints}>No complaints found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    marginBottom: 20,
  },
  description: {
    marginBottom: 10,
  },
  noComplaints: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
