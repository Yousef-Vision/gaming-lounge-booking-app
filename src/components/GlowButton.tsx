import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius } from "../theme";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "ghost";
  style?: ViewStyle;
  disabled?: boolean;
};

export function GlowButton({ label, onPress, variant = "primary", style, disabled }: Props) {
  if (variant === "ghost") {
    return (
      <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.ghost, disabled && styles.disabled, pressed && styles.pressed, style]}>
        <Text style={[styles.ghostText, disabled && styles.disabledText]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.shadow, disabled && styles.disabledShadow, pressed && styles.pressed, style]}>
      <LinearGradient colors={disabled ? ["#2A2A2A", "#222222"] : ["#FF9A3D", colors.orange, "#D84F00"]} style={styles.primary}>
        <Text style={[styles.primaryText, disabled && styles.disabledText]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: radius.md,
    shadowColor: colors.orange,
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  primary: {
    alignItems: "center",
    borderRadius: radius.md,
    minHeight: 50,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  primaryText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  ghost: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16,
  },
  ghostText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    backgroundColor: "#242424",
    borderColor: "rgba(255,255,255,0.06)",
  },
  disabledShadow: {
    shadowOpacity: 0,
  },
  disabledText: {
    color: colors.dim,
  },
});
