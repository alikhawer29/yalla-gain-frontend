import { useState } from "react";

const UseTableControls = () => {
  const [cartCount, setCartCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [showItem, setShowItem] = useState(10);
  const [filterSort, setFilterSort] = useState(false);
  const [filterSortValue, setFilterSortValue] = useState("");
  const [filterSortValues, setFilterSortValues] = useState([]);
  const [filterSearch, setFilterSearch] = useState(false);
  const [paginateFilter, setPaginateFilter] = useState(false);
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
  return {
    loading,
    setLoading,
    selectedValueFour,
    setSelectedValueFour,
    cartCount,
    setCartCount,
    selectedGender,
    setSelectedGender,
    selectedSports,
    setSelectedSports,
    selectedStrategy,
    setSelectedStrategy,
    notificationCountData,
    setNotificationCountData,
    selectedValueTwo,
    setSelectedValueTwo,
    selectedValueThree,
    setSelectedValueThree,
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
    filterTo,
    setFilterTo,
    setPaginateFilter,
    paginateFilter,
    searchValue,
    setSearchValue,
    currentPage,
    setCurrentPage,
    totalRecords,
    setTotalRecords,
    totalPages,
    setTotalPages,
    selectedValue,
    setSelectedValue,
    selectedEntries,
    setSelectedEntries,
    filterFrom,
    setFilterFrom,
    showData,
    setShowData,
  };
};

export default UseTableControls;
