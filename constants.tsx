
import React from 'react';
import { ChargingStation, UserVehicle } from './types';

export const MOCK_STATIONS: ChargingStation[] = [
  {
    id: 'st-1',
    name: 'VoltStream Central',
    address: '123 Energy Way',
    city: 'San Francisco',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    powerOutput: 150,
    rating: 4.8,
    image: 'https://picsum.photos/seed/volt/400/300',
    amenities: ['Cafe', 'WiFi', 'Restroom'],
    slots: [
      { id: 's1', startTime: '09:00', endTime: '10:00', isAvailable: true, price: 15 },
      { id: 's2', startTime: '10:00', endTime: '11:00', isAvailable: false, price: 15 },
      { id: 's3', startTime: '11:00', endTime: '12:00', isAvailable: true, price: 20 },
    ]
  },
  {
    id: 'st-2',
    name: 'GreenDrive Express',
    address: '456 Eco Blvd',
    city: 'Oakland',
    coordinates: { lat: 37.8044, lng: -122.2712 },
    powerOutput: 50,
    rating: 4.5,
    image: 'https://picsum.photos/seed/green/400/300',
    amenities: ['Shopping', 'Park'],
    slots: [
      { id: 's4', startTime: '08:00', endTime: '09:00', isAvailable: true, price: 10 },
      { id: 's5', startTime: '12:00', endTime: '13:00', isAvailable: true, price: 12 },
    ]
  },
  {
    id: 'st-3',
    name: 'ThunderCharge Hub',
    address: '789 Lightning Rd',
    city: 'San Jose',
    coordinates: { lat: 37.3382, lng: -121.8863 },
    powerOutput: 250,
    rating: 4.9,
    image: 'https://picsum.photos/seed/thunder/400/300',
    amenities: ['Lounge', 'Coffee'],
    slots: [
      { id: 's6', startTime: '14:00', endTime: '15:00', isAvailable: true, price: 25 },
    ]
  }
];

export const MOCK_VEHICLES: UserVehicle[] = [
  { id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, batteryCapacity: 75, plugType: 'Tesla' },
  { id: 'v2', make: 'Hyundai', model: 'Ioniq 5', year: 2022, batteryCapacity: 77, plugType: 'CCS' }
];

export const ICONS = {
  Charging: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  Location: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Car: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.091-1.124l-.32-5.115a3.375 3.375 0 00-3.285-3.137l-1.42-.099m-1.47 1.47l-1.47-1.49a9.035 9.035 0 01-1.124 1.124l1.49 1.47m1.47-1.47a9.035 9.035 0 01-1.124 1.124l-1.49-1.47m0 0l-1.47 1.49a9.035 9.035 0 01-1.124-1.124l1.49-1.47m0 0l-1.47 1.49a9.035 9.035 0 01-1.124-1.124l1.49-1.47" />
    </svg>
  ),
  Route: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-10.5v.75m0 0v1.5m0-1.5h.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H15m0-1.5V6a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6v2.25a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 002.25-2.25V6.75m0 0V15m0 0l-3-3m3 3l3-3" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Admin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774a1.125 1.125 0 01.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.894.149c.542.09.94.56.94 1.11v1.094c0 .55-.398 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738a1.125 1.125 0 01-.12 1.45l-.773.773a1.125 1.125 0 01-1.45.12l-.737-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.149a1.125 1.125 0 01-.94-1.11v-1.093c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.808.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};
