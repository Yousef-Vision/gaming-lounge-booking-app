import type { ImageSourcePropType } from "react-native";

export type RoomTier = "Regular" | "VIP" | "VVIP";

export type Room = {
  id: string;
  tier: RoomTier;
  title: string;
  subtitle: string;
  capacity: string;
  priceHint: string;
  image: ImageSourcePropType;
  features: string[];
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  tag: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  meta: string;
};

export type AvailabilityStatus = "available" | "reserved";

export type FloorArea = {
  id: string;
  name: string;
  type: "Regular Room" | "Luxury Room" | "VIP Room" | "VVIP Room" | "Billiards" | "Drift Sim";
  status: AvailabilityStatus;
  capacity: string;
  priceHint: string;
  roomId?: string;
  activityId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ReservationRequest = {
  roomId: string;
  floorAreaId?: string;
  activityId: string;
  date: string;
  time: string;
  people: number;
  name: string;
  phone: string;
  notes: string;
  createdAt: string;
};

export type RootTabParamList = {
  Home: undefined;
  Reservations: undefined;
  Deals: undefined;
  About: undefined;
};
