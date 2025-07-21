const initialState = {
    images: [],
};

const imagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_IMAGE':
            const { name, dataURL } = action.payload;
            return {
                ...state,
                images: {
                    ...state.images,
                    [name]: dataURL,
                },
            };
        case 'DELETE_ALL_IMAGES':
            sessionStorage.removeItem('images'); // Clear sessionStorage
            return {
                ...state,
                images: {},
            };
        default:
            return state;
    }
};

export default imagesReducer;