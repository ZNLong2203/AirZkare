import { create } from 'zustand';
import { Airport } from '@/schemas/Airport';

interface FlightSearchState {
    departure_come_airport: Airport;
    arrival_come_airport: Airport;
    departure_come_time: Date | null;

    departure_return_airport: object;
    arrival_return_airport: object;
    departure_return_time: Date | null;

    type: string; // oneWay, roundTrip
    passengers: string;
    class: string; // economy, business
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
    setFlightSearch: (searchData) => set((state) => ({ ...state, ...searchData })),
}));

export default useFlightSearchStore;
