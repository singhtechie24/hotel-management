import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Button, ListItem } from "react-native-elements";
import { supabase } from "../../lib/supabase";
import { Room, Complaint } from "../../types";

export const StaffDashboardScreen = ({ navigation }: any) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const db = {
    collection: (name: string) => ({
      get: async () => {
        const { data, error } = await supabase.from(name).select("*");

        if (error) throw error;
        return {
          docs: data.map((doc: any) => ({
            id: doc.id,
            data: () => doc,
          })),
        };
      },
      doc: (id: string) => ({
        update: async (data: any) => {
          const { error } = await supabase.from(name).update(data).eq("id", id);

          if (error) throw error;
        },
      }),
    }),
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsSnapshot, complaintsSnapshot] = await Promise.all([
        db.collection("rooms").get(),
        db.collection("complaints").get(),
      ]);

      setRooms(
        roomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      setComplaints(
        complaintsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateRoomStatus = async (roomId: number, status: Room["status"]) => {
    try {
      await db.collection("rooms").doc(roomId.toString()).update({ status });
      fetchData();
    } catch (error) {
      console.error("Error updating room status:", error);
    }
  };

  const updateComplaintStatus = async (
    complaintId: number,
    status: Complaint["status"]
  ) => {
    try {
      await db
        .collection("complaints")
        .doc(complaintId.toString())
        .update({ status });
      fetchData();
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text h4 style={styles.title}>
        Staff Dashboard
      </Text>
      <Card>
        <Card.Title>Rooms</Card.Title>
        <Card.Divider />
        {rooms.map((room) => (
          <ListItem key={room.id} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Room {room.number}</ListItem.Title>
              <ListItem.Subtitle>Status: {room.status}</ListItem.Subtitle>
              <View style={styles.buttonGroup}>
                <Button
                  title="Available"
                  onPress={() => updateRoomStatus(room.id, "available")}
                  type={room.status === "available" ? "solid" : "outline"}
                  containerStyle={styles.statusButton}
                />
                <Button
                  title="Cleaning"
                  onPress={() => updateRoomStatus(room.id, "cleaning")}
                  type={room.status === "cleaning" ? "solid" : "outline"}
                  containerStyle={styles.statusButton}
                />
                <Button
                  title="DND"
                  onPress={() => updateRoomStatus(room.id, "do_not_disturb")}
                  type={room.status === "do_not_disturb" ? "solid" : "outline"}
                  containerStyle={styles.statusButton}
                />
              </View>
            </ListItem.Content>
          </ListItem>
        ))}
      </Card>

      <Card>
        <Card.Title>Complaints</Card.Title>
        <Card.Divider />
        {complaints.map((complaint) => (
          <ListItem key={complaint.id} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{complaint.title}</ListItem.Title>
              <ListItem.Subtitle>{complaint.description}</ListItem.Subtitle>
              <Text>Status: {complaint.status}</Text>
              <View style={styles.buttonGroup}>
                <Button
                  title="In Progress"
                  onPress={() =>
                    updateComplaintStatus(complaint.id, "in_progress")
                  }
                  type={
                    complaint.status === "in_progress" ? "solid" : "outline"
                  }
                  containerStyle={styles.statusButton}
                />
                <Button
                  title="Resolved"
                  onPress={() =>
                    updateComplaintStatus(complaint.id, "resolved")
                  }
                  type={complaint.status === "resolved" ? "solid" : "outline"}
                  containerStyle={styles.statusButton}
                />
              </View>
            </ListItem.Content>
          </ListItem>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    textAlign: "center",
    marginVertical: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 10,
  },
  statusButton: {
    marginHorizontal: 5,
  },
});
