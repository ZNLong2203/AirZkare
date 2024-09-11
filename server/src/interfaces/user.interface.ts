export interface User {
    user_id: string;
    username: string;
    password: string;
    email: string;
    provider: string | null;
    provider_code: string | null;
    role: 'user' | 'admin' | null;
    image: string | null; 
}

