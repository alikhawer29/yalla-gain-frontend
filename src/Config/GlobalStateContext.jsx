// GlobalStateContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTableControls } from './TableControlsContext';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const { clearFilters } = useTableControls();
    const location = useLocation();

    useEffect(() => {
        clearFilters();
    }, [location.pathname, clearFilters]);

    return (
        <GlobalStateContext.Provider value={{}}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => {
    return useContext(GlobalStateContext);
};