const initialState = {
    data: null,
};

const logoutReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGOUT':
            return initialState; // Reset state to initial state upon logout
        default:
            return state;
    }
};

export default logoutReducer;
