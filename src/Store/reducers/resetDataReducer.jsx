
// Define initial state
const initialState = {
    data: null,
};

// Reducer for resetting data (logout)

const resetDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGOUT':
            return initialState;
        default:
            return state;
    }
};

export default resetDataReducer;
