import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { RootTabParamList } from "../types";
import { colors } from "../theme";
import { HomeScreen } from "../screens/HomeScreen";
import { ReservationsScreen } from "../screens/ReservationsScreen";
import { DealsScreen } from "../screens/DealsScreen";
import { AboutScreen } from "../screens/AboutScreen";

const Tab = createBottomTabNavigator<RootTabParamList>();

const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  Reservations: "calendar",
  Deals: "pricetag",
  About: "information-circle",
};

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.dim,
        tabBarStyle: {
          backgroundColor: "rgba(10, 10, 10, 0.96)",
          borderTopColor: colors.line,
          height: 64,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 8,
          fontWeight: "800",
          letterSpacing: 0,
        },
        tabBarIcon: ({ color, focused }) => <Ionicons name={icons[route.name]} color={color} size={focused ? 19 : 17} />,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Reservations" component={ReservationsScreen} options={{ title: "Reserve", tabBarLabel: "Reserve" }} />
      <Tab.Screen name="Deals" component={DealsScreen} options={{ tabBarLabel: "Offers" }} />
      <Tab.Screen name="About" component={AboutScreen} options={{ title: "About Us", tabBarLabel: "About Us" }} />
    </Tab.Navigator>
  );
}
