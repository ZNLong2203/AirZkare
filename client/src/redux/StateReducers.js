import { reducerCases } from "./ReducerCases";

export const initialState = {
    userInfo: undefined,
};

export const reducer = (state, action) => {
    switch (action.type) {
        case reducerCases.SET_USER:
            return {
                ...state,
                userInfo: action.payload,
            };
        case reducerCases.CLEAR_USER:
            return {
                ...state,
                userInfo: undefined,
            };
        default:
            return state;
    }
}
