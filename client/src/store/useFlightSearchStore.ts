import { create } from 'zustand';

interface FlightSearchState {
    departure_come_airport: string;
    arrival_come_airport: string;
    departure_come_time: Date | null;

    departure_return_airport: string;
    arrival_return_airport: string;
    departure_return_time: Date | null;

    type: string; // oneWay, roundTrip
    passengers: string;
    setFlightSearch: (searchData: Partial<FlightSearchState>) => void;
}

const useFlightSearchStore = create<FlightSearchState>((set) => ({
    departure_come_airport: '',
    arrival_come_airport: '',
    departure_come_time: null,

    departure_return_airport: '',
    arrival_return_airport: '',
    departure_return_time: null,

    type: 'roundTrip',
    passengers: '1',
    setFlightSearch: (searchData) => set((state) => ({ ...state, ...searchData })),
}));

export default useFlightSearchStore;
