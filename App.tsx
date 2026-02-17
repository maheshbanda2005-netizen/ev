
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AppState, ViewState, Booking, UserVehicle, ChargingStation } from './types';
import { MOCK_STATIONS, MOCK_VEHICLES } from './constants';
import Layout from './components/Layout';
import { chatWithAi } from './services/geminiService';

// --- View Components ---

const HomeView: React.FC<{ stations: ChargingStation[], onBook: (s: ChargingStation) => void }> = ({ stations, onBook }) => {
  const [filter, setFilter] = useState('');
  const filtered = stations.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.city.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <input 
          type="text" 
          placeholder="Search by city or station name..." 
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select className="px-4 py-3 rounded-xl border border-gray-200 bg-white">
          <option>All Types</option>
          <option>Fast Charging (>100kW)</option>
          <option>Standard Charging</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(station => (
          <div key={station.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
            <div className="relative h-48 overflow-hidden">
              <img src={station.image} alt={station.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600">
                {station.powerOutput} kW
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800">{station.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{station.address}, {station.city}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-yellow-500">
                  <span className="font-bold mr-1">{station.rating}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <div className="flex space-x-1">
                  {station.amenities.slice(0, 2).map(a => (
                    <span key={a} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{a}</span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => onBook(station)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardView: React.FC<{ bookings: Booking[], stations: ChargingStation[] }> = ({ bookings, stations }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Energy Consumed</p>
          <p className="text-3xl font-bold text-indigo-600">452 kWh</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Active Bookings</p>
          <p className="text-3xl font-bold text-green-600">{bookings.filter(b => b.status === 'confirmed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <p className="text-3xl font-bold text-gray-800">$128.50</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">Booking History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Station</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No bookings found</td>
                </tr>
              ) : (
                bookings.map(b => {
                  const station = stations.find(s => s.id === b.stationId);
                  const slot = station?.slots.find(sl => sl.id === b.slotId);
                  return (
                    <tr key={b.id}>
                      <td className="px-6 py-4 font-medium text-gray-800">{station?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-500">{b.date}</td>
                      <td className="px-6 py-4 text-gray-500">{slot?.startTime} - {slot?.endTime}</td>
                      <td className="px-6 py-4 text-gray-800 font-semibold">${b.totalPrice}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const VehicleView: React.FC<{ vehicles: UserVehicle[], onAdd: (v: UserVehicle) => void }> = ({ vehicles, onAdd }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Garage</h2>
        <button 
          onClick={() => onAdd({ id: Date.now().toString(), make: 'New', model: 'EV', year: 2024, batteryCapacity: 60, plugType: 'CCS' })}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
        >
          + Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map(v => (
          <div key={v.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.091-1.124l-.32-5.115a3.375 3.375 0 00-3.285-3.137l-1.42-.099m-1.47 1.47l-1.47-1.49a9.035 9.035 0 01-1.124 1.124l1.49 1.47m1.47-1.47a9.035 9.035 0 01-1.124 1.124l-1.49-1.47m0 0l-1.47 1.49a9.035 9.035 0 01-1.124-1.124l1.49-1.47m0 0l-1.47 1.49a9.035 9.035 0 01-1.124-1.124l1.49-1.47" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">{v.make} {v.model}</h3>
              <p className="text-gray-500 text-sm">{v.year} • {v.batteryCapacity} kWh • {v.plugType}</p>
              <div className="mt-4 flex space-x-2">
                <button className="text-xs font-semibold text-gray-400 hover:text-indigo-600">Edit</button>
                <button className="text-xs font-semibold text-red-400 hover:text-red-600">Remove</button>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Active</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoadmapView: React.FC<{ vehicles: UserVehicle[], stations: ChargingStation[], onStationClick: (s: ChargingStation) => void }> = ({ vehicles, stations, onStationClick }) => {
  const [source, setSource] = useState('San Francisco');
  const [dest, setDest] = useState('San Jose');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  
  const tripDistance = 55; // Placeholder distance in miles

  const selectedVehicle = useMemo(() => vehicles.find(v => v.id === selectedVehicleId), [vehicles, selectedVehicleId]);

  const tripAnalysis = useMemo(() => {
    if (!selectedVehicle) return { energyNeeded: 0, estCost: 0 };
    const energyNeeded = tripDistance * 0.3;
    const allSlots = stations.flatMap(s => s.slots);
    const avgPricePerSlot = allSlots.length > 0 
      ? allSlots.reduce((acc, s) => acc + s.price, 0) / allSlots.length 
      : 15;
    const costPerKWh = 0.5;
    const estCost = energyNeeded * costPerKWh;
    return { energyNeeded, estCost };
  }, [selectedVehicle, stations, tripDistance]);

  const routeStations = useMemo(() => {
    // Dynamically pick some stations to show on the route
    return stations.slice(0, 2);
  }, [stations]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold">Plan Your Trip</h2>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Select Vehicle</label>
            <select 
              value={selectedVehicleId} 
              onChange={e => setSelectedVehicleId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.make} {v.model}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Start Location</label>
            <input type="text" value={source} onChange={e => setSource(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Destination</label>
            <input type="text" value={dest} onChange={e => setDest(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200" />
          </div>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            Calculate Roadmap
          </button>
        </div>

        <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <h3 className="text-lg font-bold mb-2">Trip Summary</h3>
          <div className="space-y-3 text-sm opacity-90">
            <div className="flex justify-between">
              <span>Distance</span>
              <span className="font-bold">{tripDistance} miles</span>
            </div>
            <div className="flex justify-between">
              <span>Energy Est.</span>
              <span className="font-bold">{tripAnalysis.energyNeeded.toFixed(1)} kWh</span>
            </div>
            <div className="flex justify-between text-green-400">
              <span className="text-white">Est. Cost</span>
              <span className="font-bold text-lg">${tripAnalysis.estCost.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between">
              <span>Stations Found</span>
              <span className="font-bold">{routeStations.length}</span>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-20 transform rotate-12">
             <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-1 h-full bg-gray-100 absolute left-1/2 -translate-x-1/2"></div>
        <div className="flex flex-col items-center space-y-16 relative z-10 w-full">
           <div className="bg-white border-4 border-indigo-600 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg">S</div>
           
           {routeStations.map((station, idx) => (
             <button 
                key={station.id}
                onClick={() => onStationClick(station)}
                className={`bg-green-100 p-4 rounded-xl border border-green-200 flex items-center space-x-3 w-64 shadow-sm transition-transform hover:scale-105 ${idx % 2 === 0 ? 'ml-32' : '-ml-32'}`}
             >
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shrink-0">{idx + 1}</div>
                <div className="text-left overflow-hidden">
                  <p className="font-bold text-sm truncate">{station.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{station.powerOutput}kW • Rec. Stop</p>
                  <p className="text-[10px] text-indigo-600 font-bold mt-1">View Details</p>
                </div>
             </button>
           ))}

           <div className="bg-white border-4 border-red-600 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg">D</div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('HOME');
  const [state, setState] = useState<AppState>({
    user: { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'user' },
    vehicles: MOCK_VEHICLES,
    stations: MOCK_STATIONS,
    bookings: []
  });
  
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  
  // Chat State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hi! I\'m Eva, your EV assistant. Ask me anything about your vehicles, trips, or where to find the best charging stations.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isAiLoading]);

  const handleBook = (station: ChargingStation) => {
    setSelectedStation(station);
  };

  const confirmBooking = (slotId: string) => {
    if (!selectedStation) return;
    const slot = selectedStation.slots.find(s => s.id === slotId);
    if (!slot) return;

    const newBooking: Booking = {
      id: Date.now().toString(),
      stationId: selectedStation.id,
      slotId: slotId,
      userId: state.user?.id || 'guest',
      vehicleId: state.vehicles[0]?.id || 'v1',
      date: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      totalPrice: slot.price
    };

    setState(prev => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings]
    }));
    setSelectedStation(null);
    setActiveView('DASHBOARD');
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isAiLoading) return;

    const message = userInput.trim();
    setUserInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: message }]);
    setIsAiLoading(true);

    const response = await chatWithAi(message, chatHistory, state);
    setChatHistory(prev => [...prev, { role: 'model', text: response || "I'm sorry, I encountered an error." }]);
    setIsAiLoading(false);
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView} userRole={state.user?.role || 'user'}>
      
      {/* Dynamic Views */}
      {activeView === 'HOME' && <HomeView stations={state.stations} onBook={handleBook} />}
      {activeView === 'DASHBOARD' && <DashboardView bookings={state.bookings} stations={state.stations} />}
      {activeView === 'VEHICLES' && <VehicleView vehicles={state.vehicles} onAdd={(v) => setState(p => ({...p, vehicles: [...p.vehicles, v]}))} />}
      {activeView === 'ROADMAP' && <RoadmapView vehicles={state.vehicles} stations={state.stations} onStationClick={handleBook} />}

      {/* Booking / Details Modal */}
      {selectedStation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">{selectedStation.name}</h2>
                <p className="text-sm text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {selectedStation.address}, {selectedStation.city}
                </p>
              </div>
              <button onClick={() => setSelectedStation(null)} className="text-gray-400 hover:text-gray-800 p-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Specs Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-2xl flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Output</p>
                      <p className="text-lg font-bold text-indigo-900">{selectedStation.powerOutput} kW</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-2xl flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-yellow-600 uppercase font-bold tracking-wider">Rating</p>
                      <p className="text-lg font-bold text-yellow-900">{selectedStation.rating}</p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStation.amenities.map(a => (
                      <span key={a} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Slots Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Available Slots</h3>
                  <div className="space-y-3">
                    {selectedStation.slots.map(slot => (
                      <button 
                        key={slot.id}
                        disabled={!slot.isAvailable}
                        onClick={() => confirmBooking(slot.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          slot.isAvailable 
                          ? 'border-gray-100 hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer shadow-sm hover:shadow-md' 
                          : 'bg-gray-50 border-transparent opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${slot.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-300'}`}></div>
                          <div>
                            <p className="font-bold text-gray-800">{slot.startTime} - {slot.endTime}</p>
                            <p className="text-[10px] text-gray-400">Next Slot Available</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-indigo-600 font-bold text-lg">${slot.price}</span>
                          <p className="text-[10px] text-indigo-400">Total Price</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 text-center shrink-0 border-t border-gray-100">
               <p className="text-xs text-gray-400">Instant confirmation upon slot selection</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Floating Button */}
      <div className="fixed bottom-24 md:bottom-8 right-8 z-50">
         <button 
          onClick={() => setIsAiOpen(!isAiOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${isAiOpen ? 'bg-red-500 rotate-90' : 'bg-indigo-600'}`}
         >
           {isAiOpen ? (
             <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           ) : (
             <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
           )}
         </button>
      </div>

      {/* AI Chat Modal */}
      {isAiOpen && (
        <div className="fixed bottom-40 md:bottom-24 right-4 md:right-8 z-[70] w-[calc(100%-2rem)] md:w-96 flex flex-col h-[60vh] max-h-[600px] animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full border border-indigo-50">
            {/* Header */}
            <div className="p-4 bg-indigo-600 text-white flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h2 className="font-bold">Eva Assistant</h2>
                <p className="text-[10px] text-indigo-100 uppercase tracking-widest">Always Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100 shadow-lg' 
                    : 'bg-white text-gray-700 border border-indigo-50 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-indigo-50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask Eva anything..."
                  className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!userInput.trim() || isAiLoading}
                  className="bg-indigo-600 text-white p-2 rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default App;
