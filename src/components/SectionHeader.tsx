import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";

type Props = {
  eyebrow?: string;
  title: string;
};

export function SectionHeader({ eyebrow, title }: Props) {
  return (
    <View style={styles.wrap}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4,
  },
  eyebrow: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  title: {
    color: colors.white,
    ...typography.h2,
  },
});
