import { ImageBackground, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { activities, brand } from "../data/lounge";
import type { RootTabParamList } from "../types";
import { colors, radius } from "../theme";
import { GlowButton } from "../components/GlowButton";
import { Screen } from "../components/Screen";
import { SectionHeader } from "../components/SectionHeader";
import { ActivityCard } from "../components/Cards";

const mapImage = require("../../assets/lounge/reception.jpg");

type Props = BottomTabScreenProps<RootTabParamList, "About">;

export function AboutScreen({ navigation }: Props) {
  return (
    <Screen>
      <SectionHeader eyebrow="Visit Us" title="Location and contact" />
      <ImageBackground source={mapImage} imageStyle={styles.mapImage} style={styles.map}>
        <LinearGradient colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.84)"]} style={styles.mapShade}>
          <Text style={styles.address}>{brand.address}</Text>
          <Text style={styles.copy}>Open maps to get directions to The Gaming Lounge JO in Amman.</Text>
          <GlowButton label="Open Location" onPress={() => Linking.openURL(brand.mapsUrl)} />
        </LinearGradient>
      </ImageBackground>

      <View style={styles.actions}>
        <ContactAction icon="location" title="Location" value={brand.address} onPress={() => Linking.openURL(brand.mapsUrl)} />
        <ContactAction icon="call" title="Call" value={brand.phoneDisplay} onPress={() => Linking.openURL(brand.phoneUrl)} />
        <ContactAction icon="logo-instagram" title="Instagram" value={brand.handle} onPress={() => Linking.openURL(brand.instagramUrl)} />
        <ContactAction icon="logo-whatsapp" title="WhatsApp" value="Message the lounge" onPress={() => Linking.openURL(brand.whatsappUrl)} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Opening hours</Text>
        {brand.hours.map((line) => (
          <Text key={line} style={styles.copy}>{line}</Text>
        ))}
        <Text style={styles.addressLine}>{brand.address}</Text>
      </View>

      <SectionHeader eyebrow="About Us" title="About The Gaming Lounge" />
      <View style={styles.panel}>
        <Text style={styles.copy}>
          A premium dark-luxury gaming lounge in Amman built around private rooms, PS5 sessions, billiards, drift simulators, and group nights.
        </Text>
      </View>

      <SectionHeader eyebrow="Play" title="Games & Activities" />
      <View style={styles.activities}>
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} onReserve={() => navigation.navigate("Reservations")} />
        ))}
      </View>
    </Screen>
  );
}

function ContactAction({ icon, title, value, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} color={colors.orange} size={20} />
      </View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.copy}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" color={colors.dim} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  map: {
    borderRadius: radius.md,
    height: 300,
    overflow: "hidden",
  },
  mapImage: {
    borderRadius: radius.md,
  },
  mapShade: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 10,
    padding: 16,
  },
  address: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0,
  },
  copy: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  actions: {
    gap: 10,
  },
  activities: {
    gap: 12,
  },
  action: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 68,
    padding: 12,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.orangeSoft,
    borderRadius: radius.sm,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  actionText: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  panelTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
  },
  addressLine: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
