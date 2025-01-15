import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { HomeScreen } from "../screens/customer/HomeScreen";
import { MyRoomScreen } from "../screens/customer/MyRoomScreen";
import { ComplaintsScreen } from "../screens/customer/ComplaintsScreen";
import { LogoutButton } from "../components/LogoutButton";

const Tab = createBottomTabNavigator();

export const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "My Room") {
            iconName = "hotel";
          } else if (route.name === "Complaints") {
            iconName = "report-problem";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerRight: () => <LogoutButton />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="My Room"
        component={MyRoomScreen}
        options={{ title: "My Room" }}
      />
      <Tab.Screen
        name="Complaints"
        component={ComplaintsScreen}
        options={{ title: "My Complaints" }}
      />
    </Tab.Navigator>
  );
};
