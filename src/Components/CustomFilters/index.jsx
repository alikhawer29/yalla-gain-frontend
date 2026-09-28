import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { RiEqualizerLine } from "react-icons/ri";
import { sorting } from "../../Config/TableStatus";
import CustomButton from "../CustomButton";
import SiteInput from "../Input/input";
import { Select } from "../Select";
import "./style.css";
// import { FaFilter } from "react-icons/fa6";

import { FaFilter } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const CustomFilters = (props) => {
  const { showEntries = true, showFilter = true, showSearch = true } = props;
  const [formData, setFormData] = useState({});
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  useEffect(() => {
    setFormData(props.filters);
  }, [props.filters]);

  const debouncedSetFilters = useCallback(
    debounce((updatedFormData) => {
      props.setFilters(updatedFormData);
    }, 500),
    [props.setFilters],
  );

  const handleChange = (name, value) => {
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    if (name === "search" || name === "per_page") {
      updatedFormData.page = 1;
    }

    setFormData(updatedFormData);

    if (name === "search") {
      debouncedSetFilters(updatedFormData);
    } else if (name === "per_page") {
      props.setFilters(updatedFormData);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    handleChange(name, value);
  };

  const handleSelectChange = (name, value) => {
    handleChange(name, value);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedFormData = {
      ...formData,
      [name]: checked,
      page: 1,
    };
    setFormData(updatedFormData);
    debouncedSetFilters(updatedFormData);
  };

  const handleApply = () => {
    const updatedFormData = {
      ...formData,
      page: 1,
    };
    setFormData(updatedFormData);
    props.setFilters(updatedFormData);
    setFilterMenuOpen(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      page: 1,
      per_page: 10,
    };
    setFormData(clearedFilters);
    props.setFilters(clearedFilters);
    setFilterMenuOpen(false);
  };

  return (
    <>
      <div className="tableFilters">
        <div
          className={`d-flex ${showEntries ? "justify-content-between" : "justify-content-end"} gap-3 flex-wrap align-items-center`}
        >
          {showEntries && (
            <div className="d-flex align-items-center gap-3">
              <Select
                className="select-entries"
                value={formData?.per_page}
                name="per_page"
                label="Show"
                onChange={(value) => handleSelectChange("per_page", value)}
                labelclass="secondaryLabel mb-0"
              >
                {sorting}
              </Select>
            </div>
          )}
          <div className="d-flex align-items-center justify-content-end gap-2">
            {showSearch && (
              <div className="filterWrapper d-md-flex align-items-baseline mb-0">
                <div className="searchWrapper">
                  <SiteInput
                    type="text"
                    placeholder="Search..."
                    name="search"
                    className="filterInput searchInput form-control"
                    value={formData?.search || ""}
                    onChange={handleInputChange}
                  />
                  <button className="searchButton notButton">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>
            )}
            {showFilter && (
              <Dropdown
                className="filter-dropdown"
                show={filterMenuOpen}
                onToggle={setFilterMenuOpen}
              >
                <Dropdown.Toggle className="btn_filter">
                  {/* <FaFilter size={20} color="white" /> */}
                  <RiEqualizerLine size={24} />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <div className="border-btm py-3">
                    <h2 className="filter-title ms-3 mb-0">Filters</h2>
                  </div>
                  <div className="fiter-main">
                    {props?.dateFilters && (
                      <div className="mb-3">
                        {props?.dateFilters?.map(
                          ({ title, toTitle, fromTitle, from, to }, index) => (
                            <div className="filterWrapper mb-4" key={index}>
                              <h5 className="mb-2 fw-medium text-white">
                                Filter By{" "}
                                {title == "Date" ? "Created On Date" : title}
                              </h5>
                              {fromTitle && (
                                <label className="filterLabel w-100 mb-0 mt-2">
                                  {fromTitle}
                                </label>
                              )}
                              <input
                                type="date"
                                placeholder="From"
                                label="From"
                                name={from}
                                className="w-100 mb-3 form-control"
                                value={formData[from] || ""}
                                onChange={handleInputChange}
                              />
                              {toTitle && (
                                <label className="filterLabel w-100 mb-0">
                                  {toTitle}
                                </label>
                              )}
                              <input
                                type="date"
                                placeholder="To"
                                name={to}
                                className="w-100 form-control"
                                value={formData[to] || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                          ),
                        )}
                      </div>
                    )}
                    <div className="mb-3">
                      {/* Checkbox Filters */}
                      {props.checkboxOptions?.map((option, index) => (
                        <React.Fragment key={index}>
                          <div className="checkboxWrapper mb-3" key={index}>
                            <label className="filterLabel mb-3">{`Filter by ${option.title}`}</label>
                            {option.options.map((checkbox, idx) => (
                              <div className="form-check ps-0 mb-2" key={idx}>
                                <label className="radio-checkbox-container">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={checkbox.value}
                                    checked={formData[checkbox.value] || false}
                                    onChange={handleCheckboxChange}
                                  />
                                  <span className="custom-checkbox"></span>

                                  {checkbox.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="my-3">
                      {props?.selectOptions?.map((option, index) => (
                        <div className="my-3" key={index}>
                          {option?.main_title && (
                            <h5 className="filterLabel w-100 mb-2 fw-medium text-capitalize">
                              {option?.main_title}
                            </h5>
                          )}
                          {option ? (
                            <Select
                              name={option.title}
                              className="mainInput w-100 "
                              labelclass="mb-2 filterLabel "
                              value={formData[option.title] || ""}
                              onChange={(value) =>
                                handleChange(option.title, value)
                              }
                              label={`${option?.title}`}
                            >
                              {option?.options}
                            </Select>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-center gap-2">
                      <CustomButton
                        onClick={handleApply}
                        variant="primary flex-grow-1"
                        text="Apply"
                      />
                      <CustomButton
                        onClick={handleClear}
                        variant="secondary flex-grow-1"
                        text="Clear"
                      />
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomFilters;
