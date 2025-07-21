import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create a Context
const TableControlsContext = createContext();

// Create a Provider component
export const TableControlsProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [showFilter, setShowFilter] = useState(false);
    const [showItem, setShowItem] = useState(10);
    const [filterSort, setFilterSort] = useState(false);
    const [filterSortValue, setFilterSortValue] = useState("");
    const [filterSortValues, setFilterSortValues] = useState([]);
    const [filterSearch, setFilterSearch] = useState(false);
    const [filterSearchValue, setFilterSearchValue] = useState("");
    const [dateFilter, setDateFilter] = useState(false);
    const [filterFrom, setFilterFrom] = useState("");
    const [filterTo, setFilterTo] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showData, setShowData] = useState();
    const [selectedEntries, setSelectedEntries] = useState("10");
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedValueTwo, setSelectedValueTwo] = useState("");
    const [selectedValueThree, setSelectedValueThree] = useState("");
    const [selectedValueFour, setSelectedValueFour] = useState("");
    const [notificationCountData, setNotificationCountData] = useState([]);
    const [selectedGender, setSelectedGender] = useState([]);
    const [selectedSports, setSelectedSports] = useState([]);
    const [selectedStrategy, setSelectedStrategy] = useState([]);
    const [loading, setLoading] = useState(true);

    const clearFilters = useCallback(() => {
        setSearchValue("");
        setSelectedEntries("");
        setFilterFrom("");
        setFilterTo("");
        setSelectedValue("");
        setSelectedValueTwo("");
        setSelectedValueThree("");
    }, []);

    return (
        <TableControlsContext.Provider value={{
            cartCount,
            setCartCount,
            showFilter,
            setShowFilter,
            showItem,
            setShowItem,
            filterSort,
            setFilterSort,
            filterSortValue,
            setFilterSortValue,
            filterSortValues,
            setFilterSortValues,
            filterSearch,
            setFilterSearch,
            filterSearchValue,
            setFilterSearchValue,
            dateFilter,
            setDateFilter,
            filterFrom,
            setFilterFrom,
            filterTo,
            setFilterTo,
            searchValue,
            setSearchValue,
            currentPage,
            setCurrentPage,
            totalRecords,
            setTotalRecords,
            totalPages,
            setTotalPages,
            showData,
            setShowData,
            selectedEntries,
            setSelectedEntries,
            selectedValue,
            setSelectedValue,
            selectedValueTwo,
            setSelectedValueTwo,
            selectedValueThree,
            setSelectedValueThree,
            selectedValueFour,
            setSelectedValueFour,
            notificationCountData,
            setNotificationCountData,
            selectedGender,
            setSelectedGender,
            selectedSports,
            setSelectedSports,
            selectedStrategy,
            setSelectedStrategy,
            loading,
            setLoading,
            clearFilters
        }}>
            {children}
        </TableControlsContext.Provider>
    );
};

export const useTableControls = () => {
    return useContext(TableControlsContext);
};
