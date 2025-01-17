import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { supabase } from "../../lib/supabase";
import { Booking } from "../../types";

export const MyRoomScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Fetching bookings for user:", user.id);

      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          id,
          check_in,
          check_out,
          status,
          payment_status,
          room:rooms (
            id,
            number,
            type,
            price
          )
        `
        )
        .eq("user_id", user.id)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        return;
      }

      console.log("Fetched bookings:", data);
      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.error("Error in fetchBookings:", error);
    }
  };

  const handleComplaint = () => {
    navigation.navigate("Complaint");
  };

  if (bookings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noBooking}>No active bookings found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {bookings.map((booking) => (
        <Card key={booking.id} containerStyle={styles.card}>
          <Card.Title>Room {booking.room.number}</Card.Title>
          <Card.Divider />
          <Text>Type: {booking.room.type}</Text>
          <Text>Check-in: {booking.check_in}</Text>
          <Text>Check-out: {booking.check_out}</Text>
          <Text>Status: {booking.status}</Text>
          <Button
            title="Raise Complaint"
            onPress={handleComplaint}
            containerStyle={styles.button}
          />
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "#e8f4f8",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  noBooking: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
