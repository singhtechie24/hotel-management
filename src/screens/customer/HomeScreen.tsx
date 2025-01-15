import React from "react";
import { RoomListScreen } from "./RoomListScreen";
import { LogoutButton } from "../../components/LogoutButton";

export const HomeScreen = ({ navigation }: any) => {
  return <RoomListScreen navigation={navigation} />;
};
