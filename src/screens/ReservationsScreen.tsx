import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { timeSlots } from "../data/lounge";
import type { FloorArea, ReservationRequest } from "../types";
import { colors, radius } from "../theme";
import { GlowButton } from "../components/GlowButton";
import { Screen } from "../components/Screen";
import { SectionHeader } from "../components/SectionHeader";
import { FloorMap } from "../components/FloorMap";

const storageKey = "the-gaming-lounge-jo:reservations";
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarDay = {
  key: string;
  label: string;
  value: string;
  disabled: boolean;
  empty?: boolean;
};

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function buildCalendarDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const days: CalendarDay[] = [];

  for (let index = 0; index < monthStart.getDay(); index += 1) {
    days.push({ key: `empty-${index}`, label: "", value: "", disabled: true, empty: true });
  }

  for (let day = 1; day <= monthEnd.getDate(); day += 1) {
    const date = new Date(year, month, day);
    days.push({
      key: toDateValue(date),
      label: `${day}`,
      value: toDateValue(date),
      disabled: date < today,
    });
  }

  return {
    monthLabel: today.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    todayValue: toDateValue(today),
    days,
  };
}

export function ReservationsScreen() {
  const calendar = useMemo(() => buildCalendarDays(), []);
  const [date, setDate] = useState(calendar.todayValue);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [time, setTime] = useState(timeSlots[3]);
  const [people, setPeople] = useState(4);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [floorArea, setFloorArea] = useState<FloorArea | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const canSubmit = useMemo(() => Boolean(floorArea) && name.trim().length > 1 && phone.trim().length > 6, [floorArea, name, phone]);

  const selectFloorArea = (area: FloorArea) => {
    if (area.status === "reserved") {
      setMessage({ type: "error", text: `${area.name} is reserved. Choose a green available area on the map.` });
      return;
    }
    setFloorArea(area);
    setMessage(null);
  };

  const submit = async () => {
    setMessage(null);
    if (!floorArea) {
      setMessage({ type: "error", text: "Select an available area on the floor map before sending the request." });
      return;
    }
    if (!canSubmit) {
      setMessage({ type: "error", text: "Enter a customer name and a reachable phone number to continue." });
      return;
    }

    setIsSubmitting(true);
    try {
      const reservation: ReservationRequest = {
        roomId: floorArea.roomId ?? floorArea.id,
        floorAreaId: floorArea.id,
        activityId: floorArea.activityId ?? floorArea.type,
        date,
        time,
        people,
        name: name.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };
      const existing = await AsyncStorage.getItem(storageKey);
      const list = existing ? (JSON.parse(existing) as ReservationRequest[]) : [];
      await AsyncStorage.setItem(storageKey, JSON.stringify([reservation, ...list]));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMessage({ type: "success", text: `Request saved for ${floorArea.name} on ${formatDisplayDate(date)} at ${time}. The team can connect this to a live backend next.` });
      setNotes("");
    } catch {
      setMessage({ type: "error", text: "The request could not be saved on this device. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <SectionHeader eyebrow="Reservations" title="Request a premium session" />
      <Text style={styles.copy}>Select an area from the map, then choose the date, time, and guest details.</Text>

      <View style={styles.mapSection}>
        <SectionHeader eyebrow="Floor Map" title="Select a first-floor area" />
        <FloorMap selectedAreaId={floorArea?.id} onReserve={selectFloorArea} />
      </View>

      <View style={[styles.selectedCard, !floorArea && styles.emptyCard]}>
        <Text style={styles.selectedLabel}>Selected Area</Text>
        {floorArea ? (
          <>
            <View style={styles.selectedTop}>
              <Text style={styles.selectedTitle}>{floorArea.name}</Text>
              <Text style={styles.selectedStatus}>Available</Text>
            </View>
            <Text style={styles.selectedMeta}>{floorArea.type} | {floorArea.capacity} | {floorArea.priceHint}</Text>
          </>
        ) : (
          <Text style={styles.emptyText}>No area selected yet. Tap a green room, billiards block, or drift simulator on the map.</Text>
        )}
      </View>

      <CalendarPicker
        date={date}
        monthLabel={calendar.monthLabel}
        days={calendar.days}
        open={calendarOpen}
        onToggle={() => setCalendarOpen((value) => !value)}
        onSelect={(value) => {
          setDate(value);
          setCalendarOpen(false);
        }}
      />

      <PickerGroup label="Time">
        {timeSlots.map((item) => (
          <Chip key={item} label={item} selected={time === item} onPress={() => setTime(item)} />
        ))}
      </PickerGroup>

      <View style={styles.counter}>
        <Text style={styles.label}>People</Text>
        <View style={styles.counterControls}>
          <CounterButton label="-" onPress={() => setPeople((value) => Math.max(1, value - 1))} />
          <Text style={styles.people}>{people}</Text>
          <CounterButton label="+" onPress={() => setPeople((value) => Math.min(12, value + 1))} />
        </View>
      </View>

      <View style={styles.form}>
        <Field label="Customer name" value={name} onChangeText={setName} placeholder="Full name" />
        <Field label="Phone number" value={phone} onChangeText={setPhone} placeholder="Jordan mobile number" keyboardType="phone-pad" />
        <Field label="Notes" value={notes} onChangeText={setNotes} placeholder="Preferred setup or occasion" multiline />
      </View>

      {message ? <Text style={[styles.message, message.type === "success" ? styles.success : styles.error]}>{message.text}</Text> : null}

      <View style={styles.submitWrap}>
        <GlowButton label={isSubmitting ? "Saving Request..." : "Submit Reservation Request"} onPress={submit} disabled={isSubmitting} />
        {isSubmitting ? <ActivityIndicator color={colors.orange} style={styles.loader} /> : null}
      </View>
    </Screen>
  );
}

function PickerGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function CalendarPicker({
  date,
  monthLabel,
  days,
  open,
  onToggle,
  onSelect,
}: {
  date: string;
  monthLabel: string;
  days: CalendarDay[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>Date</Text>
      <Pressable onPress={onToggle} style={({ pressed }) => [styles.dateField, pressed && styles.pressed]}>
        <View style={styles.dateCopy}>
          <Text style={styles.dateValue}>{formatDisplayDate(date)}</Text>
          <Text style={styles.dateHint}>Choose a day through {monthLabel}</Text>
        </View>
        <Text style={styles.dateAction}>{open ? "Close" : "Calendar"}</Text>
      </Pressable>

      {open ? (
        <View style={styles.calendar}>
          <Text style={styles.calendarTitle}>{monthLabel}</Text>
          <View style={styles.weekRow}>
            {dayLabels.map((day) => (
              <Text key={day} style={styles.weekLabel}>{day}</Text>
            ))}
          </View>
          <View style={styles.dayGrid}>
            {days.map((day) => (
              <Pressable
                key={day.key}
                disabled={day.disabled}
                onPress={() => onSelect(day.value)}
                style={({ pressed }) => [
                  styles.dayCell,
                  day.empty && styles.dayEmpty,
                  day.value === date && styles.daySelected,
                  day.disabled && !day.empty && styles.dayDisabled,
                  pressed && !day.disabled && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    day.value === date && styles.dayTextSelected,
                    day.disabled && !day.empty && styles.dayTextDisabled,
                  ]}
                >
                  {day.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function CounterButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.counterButton, pressed && styles.pressed]}>
      <Text style={styles.counterLabel}>{label}</Text>
    </Pressable>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "phone-pad";
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={colors.dim}
        style={[styles.input, props.multiline && styles.inputTall]}
        textAlignVertical={props.multiline ? "top" : "center"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  group: {
    gap: 10,
  },
  label: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chipSelected: {
    backgroundColor: colors.orangeSoft,
    borderColor: colors.orange,
  },
  chipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
  },
  chipTextSelected: {
    color: colors.orange,
  },
  dateField: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateCopy: {
    flex: 1,
    gap: 3,
  },
  dateValue: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
  dateHint: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
  dateAction: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  calendar: {
    backgroundColor: "#121212",
    borderColor: "rgba(255,122,26,0.28)",
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 12,
    padding: 12,
  },
  calendarTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
  weekRow: {
    flexDirection: "row",
  },
  weekLabel: {
    color: colors.orange,
    flex: 1,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
  },
  dayCell: {
    alignItems: "center",
    aspectRatio: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: "center",
    width: "14.2857%",
  },
  dayEmpty: {
    borderColor: "transparent",
    opacity: 0,
  },
  daySelected: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
    shadowColor: colors.orange,
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  dayDisabled: {
    backgroundColor: "rgba(255,255,255,0.03)",
    opacity: 0.36,
  },
  dayText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
  },
  dayTextSelected: {
    color: colors.black,
  },
  dayTextDisabled: {
    color: colors.dim,
  },
  counter: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
  counterControls: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  counterButton: {
    alignItems: "center",
    backgroundColor: colors.panelStrong,
    borderRadius: radius.sm,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  counterLabel: {
    color: colors.orange,
    fontSize: 22,
    fontWeight: "900",
  },
  people: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    minWidth: 24,
    textAlign: "center",
  },
  form: {
    gap: 14,
  },
  mapSection: {
    gap: 8,
  },
  selectedCard: {
    backgroundColor: "rgba(255,122,26,0.1)",
    borderColor: "rgba(255,122,26,0.28)",
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  emptyCard: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
  },
  selectedLabel: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  selectedTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  selectedTitle: {
    color: colors.white,
    flex: 1,
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0,
  },
  selectedStatus: {
    color: "#42F584",
    fontSize: 12,
    fontWeight: "900",
  },
  selectedMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
  message: {
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
    padding: 12,
  },
  success: {
    backgroundColor: "rgba(66,245,132,0.1)",
    borderColor: "rgba(66,245,132,0.26)",
    color: "#42F584",
  },
  error: {
    backgroundColor: "rgba(255,78,78,0.1)",
    borderColor: "rgba(255,78,78,0.26)",
    color: "#FF8A8A",
  },
  submitWrap: {
    gap: 10,
  },
  loader: {
    alignSelf: "center",
  },
  fieldWrap: {
    gap: 8,
  },
  input: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
    minHeight: 52,
    paddingHorizontal: 14,
  },
  inputTall: {
    minHeight: 96,
    paddingTop: 14,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
