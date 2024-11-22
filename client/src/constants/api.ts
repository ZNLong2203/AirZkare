const BE = "http://localhost:2222/api";

const API = {
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
    PAYMENTSTRIPE: `${BE}/payment/stripe`,
    PAYMENTZALOPAY: `${BE}/payment/zalopay`,
}

export default API;
