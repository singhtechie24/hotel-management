import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Card, Button, Text, Badge } from "react-native-elements";
import { supabase } from "../../lib/supabase";
import { Room, Booking } from "../../types";

export const RoomListScreen = ({ navigation }: any) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userBooking, setUserBooking] = useState<Booking | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      where: async (field: string, operator: string, value: any) => {
        const { data, error } = await supabase
          .from("bookings")
          .select("*, rooms(*)")
          .eq(field, value)
          .eq("status", "confirmed")
          .single();

        if (error && error.code !== "PGRST116") return null;
        return data;
      },
    }),
  };

  useEffect(() => {
    fetchRooms();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
  };

  const fetchRooms = async () => {
    try {
      const snapshot = await db.collection("rooms").get();
      const roomList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomList);

      // Get current user's booking if logged in
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        const booking = await db
          .collection("bookings")
          .where("user_id", "==", user.id);
        setUserBooking(booking);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleBookRoom = async (room: Room) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigation.navigate("Login", { returnTo: "BookRoom", room });
    } else {
      navigation.navigate("BookRoom", { room });
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "available":
        return "success";
      case "occupied":
        return "error";
      case "cleaning":
        return "warning";
      case "do_not_disturb":
        return "primary";
      default:
        return "grey";
    }
  };

  const renderRoomCard = ({ item }: { item: Room }) => (
    //@ts-ignore
    <Card>
      <Card.Title>Room {item.number}</Card.Title>
      <Card.Divider />
      <View style={styles.roomInfo}>
        <View>
          <Text>Type: {item.type}</Text>
          <Text>Price: ${item.price}/night</Text>
        </View>
        <Badge
          value={item.status.replace("_", " ").toUpperCase()}
          //@ts-ignore
          status={getStatusColor(item.status)}
          containerStyle={styles.badge}
        />
      </View>
      <Button
        title="Book Now"
        onPress={() => handleBookRoom(item)}
        disabled={item.status !== "available"}
        containerStyle={styles.button}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.headerCard}>
        <View style={styles.headerContent}>
          <Text h4>Available Rooms</Text>
          {!isLoggedIn && (
            <Button title="Login" type="clear" onPress={handleLogin} />
          )}
        </View>
      </Card>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRoomCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  roomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  badge: {
    marginBottom: 10,
  },
  headerCard: {
    marginBottom: 15,
    backgroundColor: "#e8f4f8",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
