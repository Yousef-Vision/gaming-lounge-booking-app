import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { floorAreas } from "../data/lounge";
import type { FloorArea } from "../types";
import { colors, radius } from "../theme";
import { GlowButton } from "./GlowButton";

type Props = {
  selectedAreaId?: string;
  onReserve?: (area: FloorArea) => void;
};

export function FloorMap({ selectedAreaId, onReserve }: Props) {
  const [selected, setSelected] = useState<FloorArea | null>(null);
  const mapAreas = floorAreas.filter((area) => area.type !== "Drift Sim");
  const leftDriftAreas = floorAreas.filter((area) => area.id === "drift-1" || area.id === "drift-2");
  const rightDriftAreas = floorAreas.filter((area) => area.id === "drift-3" || area.id === "drift-4");

  const reserveSelected = () => {
    if (selected) {
      onReserve?.(selected);
      setSelected(null);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.blueprintTitle}>
        <Text style={styles.floorTitle}>First Floor</Text>
        <Text style={styles.floorSubtitle}>All rooms are bookable</Text>
      </View>

      <View style={styles.map}>
        <GridLines />
        <View style={styles.floorOutlineLeft} />
        <View style={styles.floorOutlineRight} />
        <View style={styles.centerGlow} />
        <DriftPlatform
          areas={leftDriftAreas}
          selectedAreaId={selectedAreaId}
          style={styles.leftDriftPlatform}
          onPress={setSelected}
        />
        <DriftPlatform
          areas={rightDriftAreas}
          selectedAreaId={selectedAreaId}
          style={styles.rightDriftPlatform}
          onPress={setSelected}
        />
        {mapAreas.length ? (
          mapAreas.map((area) => (
            <AreaBlock
              key={area.id}
              area={area}
              selected={area.id === selectedAreaId}
              onPress={() => setSelected(area)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="map" color={colors.orange} size={28} />
            <Text style={styles.emptyTitle}>Floor map unavailable</Text>
            <Text style={styles.emptyCopy}>Availability will appear here once map inventory is loaded.</Text>
          </View>
        )}
      </View>

      <View style={styles.legend}>
        <LegendDot color="#42F584" label="Available" />
        <LegendDot color="#FF4E4E" label="Reserved" />
      </View>

      <Modal transparent animationType="slide" visible={!!selected} onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelected(null)}>
          <Pressable style={styles.sheet}>
            <View style={styles.sheetHandle} />
            {selected ? (
              <>
                <View style={styles.sheetTop}>
                  <View>
                    <Text style={styles.sheetKicker}>{selected.type}</Text>
                    <Text style={styles.sheetTitle} numberOfLines={2}>{selected.name}</Text>
                  </View>
                  <StatusBadge status={selected.status} />
                </View>
                <DetailRow label="Capacity" value={selected.capacity} />
                <DetailRow label="Price" value={selected.priceHint} />
                <DetailRow label="Status" value={selected.status === "available" ? "Available now" : "Reserved"} />
                <Text style={styles.sheetNote}>{getSheetNote(selected)}</Text>
                <GlowButton
                  label={getActionLabel(selected)}
                  disabled={!isReservable(selected)}
                  onPress={isReservable(selected) ? reserveSelected : undefined}
                />
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function DriftPlatform({
  areas,
  selectedAreaId,
  style,
  onPress,
}: {
  areas: FloorArea[];
  selectedAreaId?: string;
  style: object;
  onPress: (area: FloorArea) => void;
}) {
  return (
    <View style={[styles.driftPlatform, style]}>
      {areas.map((area) => (
        <DriftCard key={area.id} area={area} selected={selectedAreaId === area.id} onPress={() => onPress(area)} />
      ))}
    </View>
  );
}

function DriftCard({ area, selected, onPress }: { area: FloorArea; selected: boolean; onPress: () => void }) {
  const available = area.status === "available";
  const statusColor = available ? "#42F584" : "#FF4E4E";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.driftCard,
        selected && styles.areaSelected,
        { borderColor: selected ? colors.orange : "rgba(255,255,255,0.12)" },
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient colors={["rgba(255,255,255,0.09)", "rgba(255,255,255,0.025)", "rgba(0,0,0,0.2)"]} style={styles.driftCardFill}>
        <View style={[styles.inlineStatusPill, { backgroundColor: available ? "rgba(66,245,132,0.13)" : "rgba(255,78,78,0.13)" }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{available ? "Open" : "Reserved"}</Text>
        </View>
        <Ionicons name="speedometer-outline" color="rgba(245,245,245,0.68)" size={11} />
        <Text style={styles.driftName} numberOfLines={2}>{area.name}</Text>
        <Text style={styles.driftMeta} numberOfLines={1}>{area.capacity}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function isReservable(area: FloorArea) {
  return area.status === "available";
}

function getActionLabel(area: FloorArea) {
  if (area.status === "reserved") {
    return "Reserved";
  }
  return "Reserve This Area";
}

function getSheetNote(area: FloorArea) {
  if (area.status === "reserved") {
    return "This area is already reserved for the selected schedule.";
  }
  return "Selecting this area will prefill the reservation form below.";
}

function AreaBlock({ area, selected, onPress }: { area: FloorArea; selected: boolean; onPress: () => void }) {
  const available = area.status === "available";
  const statusColor = available ? "#42F584" : "#FF4E4E";
  const drift = area.type === "Drift Sim";
  const billiards = area.type === "Billiards";
  const displayPrice = drift ? area.priceHint.replace(" / hour", "") : area.priceHint;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.area,
        {
          left: `${area.x}%`,
          top: `${area.y}%`,
          width: `${area.width}%`,
          height: `${area.height}%`,
          borderColor: selected ? colors.orange : "rgba(255,255,255,0.12)",
          shadowColor: selected ? colors.orange : "#000000",
          backgroundColor: "rgba(20,20,20,0.78)",
        },
        drift && styles.driftArea,
        billiards && styles.billiardsArea,
        selected && styles.areaSelected,
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={billiards ? ["rgba(255,122,26,0.13)", "rgba(255,255,255,0.045)", "rgba(0,0,0,0.2)"] : ["rgba(255,255,255,0.09)", "rgba(255,255,255,0.025)", "rgba(0,0,0,0.2)"]}
        style={[styles.areaFill, drift && styles.driftFill, billiards && styles.billiardsFill]}
        >
        <View style={[styles.statusPill, drift && styles.driftStatusPill, { backgroundColor: available ? "rgba(66,245,132,0.13)" : "rgba(255,78,78,0.13)" }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{available ? "Open" : "Reserved"}</Text>
        </View>
        {drift ? <Ionicons name="speedometer-outline" color="rgba(245,245,245,0.68)" size={14} /> : null}
        {billiards ? <Ionicons name="ellipse-outline" color={colors.orange} size={24} /> : null}
        <Text style={[styles.areaName, drift && styles.driftName, billiards && styles.billiardsName]} numberOfLines={2}>{area.name}</Text>
        {!drift ? <Text style={styles.areaCapacity} numberOfLines={1}>{area.capacity}</Text> : null}
        <Text style={[styles.areaPrice, drift && styles.driftPrice]} numberOfLines={1}>{displayPrice}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function GridLines() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={`h-${index}`} style={[styles.hLine, { top: `${(index + 1) * 14}%` }]} />
      ))}
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={`v-${index}`} style={[styles.vLine, { left: `${(index + 1) * 16}%` }]} />
      ))}
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color, shadowColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: FloorArea["status"] }) {
  const available = status === "available";
  return (
    <View style={[styles.badge, { borderColor: available ? "#42F584" : "#FF4E4E" }]}>
      <Ionicons name={available ? "checkmark-circle" : "close-circle"} color={available ? "#42F584" : "#FF4E4E"} size={15} />
      <Text style={[styles.badgeText, { color: available ? "#42F584" : "#FF4E4E" }]}>{available ? "Available" : "Reserved"}</Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
    marginHorizontal: -18,
  },
  blueprintTitle: {
    alignItems: "center",
    gap: 1,
  },
  floorTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  floorSubtitle: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  legend: {
    alignSelf: "center",
    backgroundColor: "rgba(22,22,22,0.88)",
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  legendDot: {
    borderRadius: 5,
    height: 8,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    width: 8,
  },
  legendText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  map: {
    alignSelf: "center",
    aspectRatio: 1,
    backgroundColor: "#0C0C0C",
    borderColor: "rgba(255,122,26,0.2)",
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    shadowColor: colors.orange,
    shadowOpacity: 0.16,
    shadowRadius: 26,
    width: "100%",
  },
  hLine: {
    backgroundColor: "rgba(255,255,255,0.008)",
    height: 1,
    position: "absolute",
    width: "100%",
  },
  vLine: {
    backgroundColor: "rgba(255,255,255,0.008)",
    height: "100%",
    position: "absolute",
    width: 1,
  },
  floorOutlineLeft: {
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: radius.sm,
    borderWidth: 1,
    bottom: "4%",
    left: "1.5%",
    position: "absolute",
    top: "4%",
    width: "35.5%",
  },
  floorOutlineRight: {
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: radius.sm,
    borderWidth: 1,
    bottom: "4%",
    position: "absolute",
    right: "1.5%",
    top: "4%",
    width: "35.5%",
  },
  centerGlow: {
    backgroundColor: "rgba(255,122,26,0.035)",
    borderRadius: 999,
    height: "44%",
    left: "34%",
    position: "absolute",
    top: "29%",
    width: "32%",
  },
  leftDriftPlatform: {
    left: "3.8%",
  },
  rightDriftPlatform: {
    right: "3.8%",
  },
  driftPlatform: {
    backgroundColor: "rgba(255,255,255,0.035)",
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    height: "20%",
    padding: 9,
    position: "absolute",
    top: "73%",
    width: "32%",
  },
  area: {
    borderRadius: radius.sm,
    borderWidth: 1,
    minHeight: 52,
    overflow: "hidden",
    position: "absolute",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  driftArea: {
    borderRadius: radius.md,
    shadowOpacity: 0.26,
  },
  driftCard: {
    backgroundColor: "rgba(20,20,20,0.78)",
    borderRadius: radius.sm,
    borderWidth: 1,
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  driftCardFill: {
    alignItems: "center",
    flex: 1,
    gap: 4,
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  billiardsArea: {
    borderColor: "rgba(255,122,26,0.45)",
    shadowColor: colors.orange,
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  areaSelected: {
    borderWidth: 1.5,
  },
  areaFill: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    gap: 5,
    paddingBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 23,
    position: "relative",
  },
  driftFill: {
    gap: 2,
    paddingBottom: 5,
    paddingHorizontal: 6,
    paddingTop: 18,
  },
  billiardsFill: {
    paddingTop: 24,
  },
  areaName: {
    color: colors.white,
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0,
    textAlign: "center",
    textTransform: "uppercase",
  },
  driftName: {
    color: colors.white,
    fontSize: 8.2,
    fontWeight: "800",
    lineHeight: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  driftMeta: {
    color: colors.muted,
    fontSize: 7,
    fontWeight: "700",
    lineHeight: 8,
    textAlign: "center",
    textTransform: "uppercase",
  },
  billiardsName: {
    fontSize: 14,
  },
  areaCapacity: {
    color: colors.muted,
    fontSize: 8.5,
    fontWeight: "700",
    textAlign: "center",
    textTransform: "uppercase",
  },
  areaPrice: {
    color: colors.orange,
    fontSize: 8.5,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "uppercase",
  },
  driftPrice: {
    fontSize: 7,
    lineHeight: 8,
    textAlign: "center",
  },
  centerText: {
    textAlign: "center",
  },
  statusPill: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    position: "absolute",
    right: 8,
    top: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  inlineStatusPill: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  driftStatusPill: {
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    right: 6,
    top: 6,
  },
  statusDot: {
    borderRadius: 3,
    height: 5,
    width: 5,
  },
  statusText: {
    fontSize: 6.8,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  modalBackdrop: {
    backgroundColor: "rgba(0,0,0,0.58)",
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#101010",
    borderColor: "rgba(255,122,26,0.24)",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    gap: 13,
    padding: 18,
    paddingBottom: 34,
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    height: 4,
    width: 44,
  },
  sheetTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  sheetKicker: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  sheetTitle: {
    color: colors.white,
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 0,
  },
  badge: {
    alignItems: "center",
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "900",
  },
  detailRow: {
    alignItems: "center",
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 10,
  },
  detailLabel: {
    color: colors.dim,
    fontSize: 13,
    fontWeight: "800",
  },
  detailValue: {
    color: colors.white,
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "right",
  },
  sheetNote: {
    backgroundColor: "rgba(255,122,26,0.08)",
    borderColor: "rgba(255,122,26,0.16)",
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    padding: 11,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    left: "12%",
    position: "absolute",
    right: "12%",
    top: "38%",
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "center",
  },
});
