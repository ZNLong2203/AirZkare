import { create } from "zustand";
import { Airport } from "@/schemas/Airport";
import { Airplane } from "@/schemas/Airplane";
import { FlightWithDA } from "@/schemas/Flight";

const defaultAirport: Airport = {
  airport_id: "",
  code: "",
  name: "",
  location: "",
};

const defaultAirplane: Airplane = {
  airplane_id: "",
  name: "",
  model: "",
  total_business: 0,
  total_economy: 0,
};

const defaultFlightWithDA: FlightWithDA = {
  airplane_id: "",
  code: "",
  type: "non-stop",
  price_business: 0,
  price_economy: 0,
  departure_airport: "",
  arrival_airport: "",
  departure_time: new Date(),
  arrival_time: new Date(),
  status: "on-time",
  flight_id: "",
  availableEconomySeats: 0,
  availableBusinessSeats: 0,
  airplane: defaultAirplane,
  airport_flight_departure_airportToairport: defaultAirport,
  airport_flight_arrival_airportToairport: defaultAirport,
};

interface FlightSearchState {
  // Outbound flight
  departure_come_airport: Airport;
  arrival_come_airport: Airport;
  departure_come_time: Date | null;
  arrival_come_time: Date | null;
  class_come: string; // economy, business
  airplane_come: Airplane;
  flight_come: FlightWithDA;
  flight_come_id: string;

  // Inbound flight
  departure_return_airport: Airport;
  arrival_return_airport: Airport;
  departure_return_time: Date | null;
  arrival_return_time: Date | null;
  class_return: string; // economy, business
  airplane_return: Airplane;
  flight_return: FlightWithDA;
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
  resetFlightData: () => void;
  saveToLocalStorage: () => void;
}

const useFlightSearchStore = create<FlightSearchState>((set, get) => ({
  departure_come_airport: defaultAirport,
  arrival_come_airport: defaultAirport,
  departure_come_time: null,
  arrival_come_time: null,
  class_come: "",
  airplane_come: defaultAirplane,
  flight_come: defaultFlightWithDA,
  flight_come_id: "",

  departure_return_airport: defaultAirport,
  arrival_return_airport: defaultAirport,
  departure_return_time: null,
  arrival_return_time: null,
  class_return: "",
  airplane_return: defaultAirplane,
  flight_return: defaultFlightWithDA,
  flight_return_id: "",

  type: "roundTrip",
  passengers: 1,

  isSearching: false,

  total_price: 0,

  setPassengers: (passengers: number) =>
    set((state) => ({ ...state, passengers })),
  setFlightSearch: (searchData) =>
    set((state) => ({ ...state, ...searchData })),
  resetFlightData: () =>
    set({
      departure_come_airport: defaultAirport,
      arrival_come_airport: defaultAirport,
      departure_come_time: null,
      arrival_come_time: null,
      class_come: "",
      airplane_come: defaultAirplane,
      flight_come: defaultFlightWithDA,
      flight_come_id: "",

      departure_return_airport: defaultAirport,
      arrival_return_airport: defaultAirport,
      departure_return_time: null,
      arrival_return_time: null,
      class_return: "",
      airplane_return: defaultAirplane,
      flight_return: defaultFlightWithDA,
      flight_return_id: "",

      type: "roundTrip",
      passengers: 1,

      isSearching: false,

      total_price: 0,
    }),

  saveToLocalStorage: () => {
    const state = get();

    const serializedState = JSON.stringify(state, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });

    localStorage.setItem("flightSearchState", serializedState);
  }
}));

export default useFlightSearchStore;
