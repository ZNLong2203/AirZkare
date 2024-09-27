import { create } from 'zustand';

interface FlightSearchState {
    departure_airport: string;
    arrival_airport: string;
    departure_time: Date | null;
    arrival_time: Date | null;
    type: string;
    passengers: string;
    setFlightSearch: (searchData: Partial<FlightSearchState>) => void;
}

const useFlightSearchStore = create<FlightSearchState>((set) => ({
    departure_airport: '',
    arrival_airport: '',
    departure_time: null,
    arrival_time: null,
    type: 'roundTrip',
    passengers: '1',
    setFlightSearch: (searchData) => set((state) => ({ ...state, ...searchData })),
}));

export default useFlightSearchStore;
