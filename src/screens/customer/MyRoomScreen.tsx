import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { supabase } from "../../lib/supabase";
import { Booking } from "../../types";

export const MyRoomScreen = ({ navigation }: any) => {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      const { data, error } = await supabase
        .from("bookings")
        .select("*, rooms(*)")
        .eq("user_id", user?.id)
        .eq("status", "confirmed")
        .single();

      if (!error) {
        setBooking(data);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  const handleComplaint = () => {
    navigation.navigate("Complaint");
  };

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.noBooking}>No active bookings found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title>My Room</Card.Title>
        <Card.Divider />
        <Text>Room: {booking.rooms.number}</Text>
        <Text>Check-in: {booking.check_in}</Text>
        <Text>Check-out: {booking.check_out}</Text>
        <Button
          title="Raise Complaint"
          onPress={handleComplaint}
          containerStyle={styles.button}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "#e8f4f8",
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
