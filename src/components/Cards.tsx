import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { Activity, Offer, Room } from "../types";
import { colors, radius } from "../theme";
import { GlowButton } from "./GlowButton";

export function RoomCard({ room, compact, onReserve }: { room: Room; compact?: boolean; onReserve?: () => void }) {
  return (
    <ImageBackground source={room.image} imageStyle={styles.image} style={[styles.room, compact && styles.roomCompact]}>
      <LinearGradient colors={["rgba(0,0,0,0.12)", "rgba(0,0,0,0.82)"]} style={styles.overlay}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{room.tier}</Text>
        </View>
        <View style={styles.cardBottom}>
          <Text style={styles.cardTitle}>{room.title}</Text>
          <Text style={styles.cardCopy}>{room.subtitle}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{room.capacity}</Text>
            <Text style={styles.meta}>{room.priceHint}</Text>
          </View>
          {!compact ? <GlowButton label="Reserve Room" onPress={onReserve} /> : null}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

export function ActivityCard({ activity, onReserve }: { activity: Activity; onReserve?: () => void }) {
  return (
    <View style={styles.activity}>
      <ImageBackground source={activity.image} imageStyle={styles.activityImage} style={styles.activityImageWrap}>
        <LinearGradient colors={["rgba(0,0,0,0.06)", "rgba(0,0,0,0.76)"]} style={styles.activityOverlay}>
          <Text style={styles.activityTag}>{activity.tag}</Text>
        </LinearGradient>
      </ImageBackground>
      <View style={styles.activityBody}>
        <Text style={styles.cardTitle}>{activity.title}</Text>
        <Text style={styles.cardCopy}>{activity.description}</Text>
        <GlowButton label="Reserve" onPress={onReserve} variant="ghost" />
      </View>
    </View>
  );
}

export function OfferBanner({ offer }: { offer: Offer }) {
  return (
    <ImageBackground source={offer.image} imageStyle={styles.image} style={styles.offer}>
      <LinearGradient colors={["rgba(0,0,0,0.18)", "rgba(0,0,0,0.86)"]} style={styles.overlay}>
        <View style={styles.offerMeta}>
          <Ionicons name="flash" color={colors.orange} size={14} />
          <Text style={styles.offerMetaText}>{offer.meta}</Text>
        </View>
        <Text style={styles.offerTitle}>{offer.title}</Text>
        <Text style={styles.cardCopy}>{offer.description}</Text>
      </LinearGradient>
    </ImageBackground>
  );
}

export function QuickAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quick, pressed && styles.pressed]}>
      <Ionicons name={icon} color={colors.orange} size={21} />
      <Text style={styles.quickText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  room: {
    borderRadius: radius.md,
    height: 360,
    overflow: "hidden",
  },
  roomCompact: {
    height: 240,
    width: 280,
  },
  image: {
    borderRadius: radius.md,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colors.orangeSoft,
    borderColor: "rgba(255,122,26,0.44)",
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
  },
  cardBottom: {
    gap: 10,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0,
  },
  cardCopy: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    letterSpacing: 0,
  },
  metaRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 8,
  },
  meta: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radius.sm,
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  activity: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  activityImageWrap: {
    height: 168,
  },
  activityImage: {
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  activityOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 12,
  },
  activityTag: {
    alignSelf: "flex-start",
    color: colors.orange,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  activityBody: {
    gap: 10,
    padding: 14,
  },
  offer: {
    borderRadius: radius.md,
    height: 230,
    overflow: "hidden",
  },
  offerMeta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  offerMetaText: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  offerTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0,
    maxWidth: 260,
  },
  quick: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    minHeight: 84,
    justifyContent: "center",
  },
  quickText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
