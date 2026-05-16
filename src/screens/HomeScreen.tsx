import { useEffect, useRef } from "react";
import { Animated, ImageBackground, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { brand, hero, offers, rooms, activities } from "../data/lounge";
import type { RootTabParamList } from "../types";
import { colors, typography } from "../theme";
import { GlowButton } from "../components/GlowButton";
import { QuickAction, RoomCard, OfferBanner, ActivityCard } from "../components/Cards";
import { Screen } from "../components/Screen";
import { SectionHeader } from "../components/SectionHeader";

type Props = BottomTabScreenProps<RootTabParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.035, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  return (
    <Screen>
      <ImageBackground source={hero.image} imageStyle={styles.heroImage} style={styles.hero}>
        <LinearGradient colors={["rgba(10,10,10,0.08)", "rgba(10,10,10,0.38)", "#0A0A0A"]} style={styles.heroShade}>
          <Text style={styles.handle}>{brand.handle}</Text>
          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>{hero.kicker}</Text>
            <Text style={styles.title}>{hero.title}</Text>
            <Text style={styles.body}>{hero.body}</Text>
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <GlowButton label="Reserve Now" onPress={() => navigation.navigate("Reservations")} />
            </Animated.View>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.quickGrid}>
        <QuickAction icon="calendar" label="Reserve" onPress={() => navigation.navigate("Reservations")} />
        <QuickAction icon="call" label="Call" onPress={() => Linking.openURL(brand.phoneUrl)} />
        <QuickAction icon="logo-instagram" label="Instagram" onPress={() => Linking.openURL(brand.instagramUrl)} />
        <QuickAction icon="location" label="Location" onPress={() => Linking.openURL(brand.mapsUrl)} />
      </View>

      <SectionHeader eyebrow="Private rooms" title="Featured VIP spaces" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
        {rooms.slice(1).map((room) => (
          <RoomCard key={room.id} room={room} compact onReserve={() => navigation.navigate("Reservations")} />
        ))}
      </ScrollView>

      <SectionHeader eyebrow="Offers" title="Current lounge highlights" />
      <OfferBanner offer={offers[0]} />

      <SectionHeader eyebrow="Popular" title="Games and activities" />
      <View style={styles.activities}>
        {activities.slice(0, 2).map((activity) => (
          <ActivityCard key={activity.id} activity={activity} onReserve={() => navigation.navigate("Reservations")} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 560,
    marginHorizontal: -18,
    marginTop: -8,
  },
  heroImage: {
    resizeMode: "cover",
  },
  heroShade: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 28,
    paddingTop: 18,
  },
  handle: {
    alignSelf: "flex-start",
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    opacity: 0.82,
  },
  heroCopy: {
    gap: 14,
  },
  kicker: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  title: {
    color: colors.white,
    ...typography.title,
  },
  body: {
    color: colors.muted,
    ...typography.body,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  horizontal: {
    gap: 12,
    paddingRight: 18,
  },
  activities: {
    gap: 14,
  },
});
