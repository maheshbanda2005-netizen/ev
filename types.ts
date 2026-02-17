
export interface UserVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  batteryCapacity: number; // kWh
  plugType: 'Type1' | 'Type2' | 'CCS' | 'CHAdeMO' | 'Tesla';
}

export interface ChargingSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  slots: ChargingSlot[];
  rating: number;
  image: string;
  powerOutput: number; // kW
  amenities: string[];
}

export interface Booking {
  id: string;
  stationId: string;
  slotId: string;
  userId: string;
  vehicleId: string;
  date: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
}

export type ViewState = 'HOME' | 'DASHBOARD' | 'VEHICLES' | 'STATIONS' | 'ROADMAP' | 'ADMIN';

export interface AppState {
  user: { id: string; name: string; email: string; role: 'user' | 'admin' } | null;
  vehicles: UserVehicle[];
  stations: ChargingStation[];
  bookings: Booking[];
}
