import { create } from 'zustand';
import { Airport } from '@/schemas/Airport';

interface FlightSearchState {
    // Outbound flight
    departure_come_airport: Airport;
    arrival_come_airport: Airport;
    departure_come_time: Date | null;
    class_come: string; // economy, business
    flight_come_id: string;

    // Inbound flight
    departure_return_airport: Airport;
    arrival_return_airport: Airport;
    departure_return_time: Date | null;
    class_return: string; // economy, business
    flight_return_id: string;

    // Flight type
    type: string; // oneWay, roundTrip
    passengers: number;

    // Check doing flight search
    isSearching: boolean;

    // Total price
    total_price: number;

    setPassengers: (passengers: number) => void;
    setFlightSearch: (searchData: Partial<FlightSearchState>) => void;
}

const useFlightSearchStore = create<FlightSearchState>((set) => ({
    departure_come_airport: { airport_id: '', code: '', name: '', location: '' },
    arrival_come_airport: { airport_id: '', code: '', name: '', location: '' },
    departure_come_time: null,
    class_come: '',
    flight_come_id: '',

    departure_return_airport: { airport_id: '', code: '', name: '', location: '' },
    arrival_return_airport: { airport_id: '', code: '', name: '', location: '' },
    departure_return_time: null,
    class_return: '',
    flight_return_id: '',

    type: 'roundTrip',
    passengers: 1,

    isSearching: false,

    total_price: 0,
    
    setPassengers: (passengers: number) => set((state) => ({ ...state, passengers })),
    setFlightSearch: (searchData) => set((state) => ({ ...state, ...searchData })),
}));

export default useFlightSearchStore;
