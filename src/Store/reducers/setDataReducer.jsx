
// Define initial state
const initialState = {
    data: null,
};

// Reducer for setting data
const setDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return {
                ...state,
                data: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                data: null, // Reset data state to null upon logout
            };
        default:
            return state;
    }
};

export default setDataReducer;
