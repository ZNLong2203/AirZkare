interface UserInfo {
    name: string;
    email: string;
}

interface State {
    userInfo: UserInfo | null;
}

export interface Action {
    type: string;
    userInfo?: UserInfo;
}

export const initialState: State = {
    userInfo: null,
};

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_USER_INFO":
            return {
                ...state,
                userInfo: action.userInfo || null,
            };
        case "CLEAR_USER_INFO":
            return {
                ...state,
                userInfo: null,
            };
        default:
            return state;
    }
}
