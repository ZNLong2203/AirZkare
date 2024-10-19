import { create } from 'zustand';
import { Airport } from '@/schemas/Airport';

interface FlightSearchState {
    // Outbound flight
    departure_come_airport: Airport;
    arrival_come_airport: Airport;
    departure_come_time: Date | null;

    // Inbound flight
    departure_return_airport: object;
    arrival_return_airport: object;
    departure_return_time: Date | null;

    // Flight type
    type: string; // oneWay, roundTrip
    passengers: string;
    class: string; // economy, business

    // Check doing flight search
    isSearching: boolean;
    setFlightSearch: (searchData: Partial<FlightSearchState>) => void;
}

const useFlightSearchStore = create<FlightSearchState>((set) => ({
    departure_come_airport: { airport_id: '', code: '', name: '', location: '' },
    arrival_come_airport: { airport_id: '', code: '', name: '', location: '' },
    departure_come_time: null,

    departure_return_airport: {},
    arrival_return_airport: {},
    departure_return_time: null,

    type: 'roundTrip',
    passengers: '1',
    class: '',

    isSearching: false,
    setFlightSearch: (searchData) => set((state) => ({ ...state, ...searchData })),
}));

export default useFlightSearchStore;
