import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Input, Button, Text, Card } from "react-native-elements";
import { supabase } from "../../lib/supabase";
import { Room } from "../../types";

export const BookRoomScreen = ({ route, navigation }: any) => {
  const { room }: { room: Room } = route.params;
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [cardNumber, setCardNumber] = useState("");
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

  //stripe integration

  const handlePayment = () => {
    if (cardNumber.length !== 16) {
      Alert.alert("Error", "Invalid card number");
      return false;
    }
    return true;
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !cardNumber) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const user = (await supabase.auth.getUser()).data.user;
    try {
      setLoading(true);

      if (!handlePayment()) {
        return;
      }

      const booking = {
        user_id: user.id,
        room_id: room.id,
        check_in: checkIn,
        check_out: checkOut,

        //stripe status
        status: "confirmed",
        payment_status: "completed",
      };

      await db.collection("bookings").add(booking);

      Alert.alert("Success", "Room booked successfully!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>Room {room.number}</Card.Title>
        <Card.Divider />
        <Text>Type: {room.type}</Text>
        <Text>Price: ${room.price}/night</Text>
      </Card>

      <Input
        placeholder="Check-in date (YYYY-MM-DD)"
        value={checkIn}
        onChangeText={setCheckIn}
      />
      <Input
        placeholder="Check-out date (YYYY-MM-DD)"
        value={checkOut}
        onChangeText={setCheckOut}
      />
      <Input
        placeholder="Card number"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
        maxLength={16}
      />
      <Button
        title="Book Now"
        onPress={handleBooking}
        loading={loading}
        containerStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    marginTop: 20,
  },
});
