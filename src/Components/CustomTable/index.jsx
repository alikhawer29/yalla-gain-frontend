import React from "react";
import CustomFilters from "../CustomFilters";
import CustomPagination from "../CustomPagination";
import LoadingSpinner from "../Loader";
import "./style.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CustomTable = (props) => {
  return (
    <>
      <CustomFilters
        filters={props?.filters}
        setFilters={props?.setFilters}
        selectOptions={props?.selectOptions}
        dateFilters={props?.dateFilters}
        showEntries={props?.showEntries}
        showSearch={props?.showSearch}
        showFilter={props?.showFilter}
      />
      <div className="customTable position-relative">
        {props?.loading ? (
          <table>
            <thead>
              <tr>
                {props?.headers.map((header, index) => (
                  <th key={index}>
                    <Skeleton height={20} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {props?.headers.map((_, colIndex) => (
                    <td key={colIndex}>
                      <Skeleton height={20} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                {props?.headers.map((header) => (
                  <th key={header?.key} className="sorting">
                    {header?.title}
                  </th>
                ))}
              </tr>
            </thead>

            {props?.children?.props?.children?.length === 0 ? (
              <tbody>
                <tr>
                  <td
                    colSpan={props?.headers?.length}
                    style={{ textAlign: "center" }}
                  >
                    No Records Found
                  </td>
                </tr>
              </tbody>
            ) : (
              props?.children
            )}
          </table>
        )}
      </div>

      <CustomPagination
        pagination={props?.pagination}
        setFilters={props?.setFilters}
      />
    </>
  );
};

export default CustomTable;
