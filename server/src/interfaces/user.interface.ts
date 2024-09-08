export interface User {
    user_id: string;
    username: string;
    password: string;
    email: string;
    image?: string;
    provider?: string;
    provider_code?: string;
    role: 'user' | 'admin';
}