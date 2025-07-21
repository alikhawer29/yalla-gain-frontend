// Define initial state
const initialState = {
    token: null,
};

// Reducer for setting data
const tokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.payload,
            };
        default:
            return state;
    }
};

export default tokenReducer;