import { useState, useCallback } from 'react';
import { useTableControls } from '../Config/TableControlsContext';

const useTableFilter = (fetchData, filterKey = 'status') => {

    const {
        searchValue,
        setSearchValue,
        filterFrom,
        setFilterFrom,
        filterTo,
        setFilterTo,
        selectedValue,
        setSelectedValue,
        selectedValueTwo,
        setSelectedValueTwo
    } = useTableControls();


    const applyFilter = useCallback(() => {
        let filter = `&${filterKey}=${selectedValue}&fromDate=${filterFrom}&toDate=${filterTo}`;
        if (selectedValueTwo) {
            filter += `&type=${selectedValueTwo}`;
        }
        fetchData(filter);
    }, [searchValue, selectedValue, selectedValueTwo, filterFrom, filterTo, fetchData]);

    const clearFilters = useCallback(() => {
        setSearchValue("");
        setSelectedValue("");
        setSelectedValueTwo("");
        setFilterFrom("");
        setFilterTo("");
        fetchData("");
    }, [fetchData]);

    return {
        searchValue,
        setSearchValue,
        selectedValue,
        setSelectedValue,
        selectedValueTwo,
        setSelectedValueTwo,
        filterFrom,
        setFilterFrom,
        filterTo,
        setFilterTo,
        applyFilter,
        clearFilters,
    };
};

export default useTableFilter;
