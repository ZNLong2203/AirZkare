export const initialState = {
    userInfo: null,
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER_INFO":
            return {
                ...state,
                userInfo: action.userInfo,
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
