const BE = "https://airzkare.up.railway.app/api";

const API = {
    BE: `https://airzkare.up.railway.app`,
    LOGIN: `${BE}/auth/login`,
    REGISTER: `${BE}/auth/register`,
    LOGOUT: `${BE}/auth/logout`,
    GOOGLE_AUTH: `${BE}/auth/google`,
    PASSENGER: `${BE}/passenger`,
    AIRPORT: `${BE}/airport`,
    AIRPLANE: `${BE}/airplane`,
    FLIGHT: `${BE}/flight`,
    BOOKING: `${BE}/booking`,
    BOOKINGPASSENGER: `${BE}/booking/passenger`,
    BOOKINGFLIGHT: `${BE}/booking/flight`,
    BOOKINGHISTORY: `${BE}/booking/history`,
    BOOKINGHOLDSEAT: `${BE}/booking/hold_seat`,
    PAYMENTSTRIPE: `${BE}/payment/stripe`,
    PAYMENTZALOPAY: `${BE}/payment/zalopay`,
    DASHBOARDLINECHART: `${BE}/dashboard/linechart`,
    DASHBOARDPIECHART: `${BE}/dashboard/piechart`,
}

export default API;
