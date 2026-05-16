import { StyleSheet, Text } from "react-native";
import { offers } from "../data/lounge";
import { colors } from "../theme";
import { OfferBanner } from "../components/Cards";
import { Screen } from "../components/Screen";
import { SectionHeader } from "../components/SectionHeader";

export function DealsScreen() {
  return (
    <Screen>
      <SectionHeader eyebrow="Deals" title="Offers and packages" />
      <Text style={styles.copy}>Mock offers are centralized in data so the lounge can update banners quickly when a backend or CMS is added.</Text>
      {offers.map((offer) => (
        <OfferBanner key={offer.id} offer={offer} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
});
