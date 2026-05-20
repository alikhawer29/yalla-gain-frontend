import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { translateHeaders } from "../../Utils/i18nHelpers";
import CustomFilters from "../CustomFilters";
import CustomPagination from "../CustomPagination";
import LoadingSpinner from "../Loader";
import "./style.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const tableSkeletonProps = {
  height: 20,
  baseColor: "#6a6666",
  highlightColor: "#ebebeb",
};

const CustomTable = (props) => {
  const { t, i18n } = useTranslation();
  const headers = useMemo(
    () => translateHeaders(props?.headers, t),
    [props?.headers, t, i18n.language]
  );

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
                {headers.map((header, index) => (
                  <th key={index}>
                    <Skeleton {...tableSkeletonProps} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((_, colIndex) => (
                    <td key={colIndex}>
                      <Skeleton {...tableSkeletonProps} />
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
                {headers.map((header) => (
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
                    colSpan={headers?.length}
                    style={{ textAlign: "center" }}
                  >
                    {t("table_ui.no_records")}
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
