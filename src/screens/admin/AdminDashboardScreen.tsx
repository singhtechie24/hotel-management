import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, ListItem } from "react-native-elements";
import { supabase } from "../../lib/supabase";
import { Booking } from "../../types";

export const AdminDashboardScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [revenue, setRevenue] = useState(0);

  const db = {
    collection: (name: string) => ({
      get: async () => {
        const { data, error } = await supabase.from(name).select(`
            *,
            rooms (
              number,
              price
            )
          `);

        if (error) throw error;
        return {
          docs: data.map((doc: any) => ({
            id: doc.id,
            data: () => doc,
          })),
        };
      },
    }),
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bookingsSnapshot = await db.collection("bookings").get();
      const bookingsList = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(bookingsList);

      // Calculate total revenue from completed bookings
      const totalRevenue = bookingsList
        .filter((booking) => booking.payment_status === "completed")
        .reduce((sum, booking) => sum + booking.rooms.price, 0);

      setRevenue(totalRevenue);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text h4 style={styles.title}>
        Admin Dashboard
      </Text>
      <Card>
        <Card.Title>Revenue Overview</Card.Title>
        <Card.Divider />
        <Text h4>${revenue.toFixed(2)}</Text>
        <Text>Total Revenue from Completed Bookings</Text>
      </Card>

      <Card>
        <Card.Title>Recent Bookings</Card.Title>
        <Card.Divider />
        {bookings.map((booking) => (
          <ListItem key={booking.id} bottomDivider>
            <ListItem.Content>
              
              <ListItem.Title>Room {booking.rooms.number}</ListItem.Title>
              <ListItem.Subtitle>
                Check-in: {booking.check_in}
                {"\n"}
                Check-out: {booking.check_out}
              </ListItem.Subtitle>
              <Text>Status: {booking.status}</Text>
              <Text>Payment: {booking.payment_status}</Text>
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
});
