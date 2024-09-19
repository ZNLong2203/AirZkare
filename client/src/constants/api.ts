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
}

export default API;
