import React, { useMemo, useState } from "react";
import { CChart } from "@coreui/react-chartjs";
import { useTranslation } from "react-i18next";
import { Select } from "../Select";
import { generateNextFiveYears } from "../../Utils/helper";

const MONTH_KEYS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

export const Graph = (props) => {
  const { t, i18n } = useTranslation();
  const monthLabels = useMemo(
    () => MONTH_KEYS.map((key) => t(`dashboard.months.${key}`)),
    [t, i18n.language]
  );
  const [selectedValue, setSelectedValue] = useState(props.selectedValue);
  const [selectedValueTwo, setSelectedValueTwo] = useState(
    props.selectedValueTwo
  );
  const [yearlState, setYearState] = useState(false);

  const handleSelectChange = (e) => {
    const value = e;
    const heading = props.item.heading;
    setSelectedValue(value);
    props.onSelectChange(value, heading);
    if (value === "yearly") {
      setYearState(true);
    } else {
      setYearState(false);
    }
  };

  const handleSelectChangeTwo = (e) => {
    const value = e;
    setSelectedValueTwo(value);
    props.onSelectYear(value);
  };

  const getCurrentMonth = () => {
    const month = new Date().getMonth() + 1; // getMonth() returns month from 0-11
    return month < 10 ? `0${month}` : month; // Add leading zero if needed
  };
  const years = generateNextFiveYears(); // Generate the next five years

  return (
    <div className="graphCard">
      <div className="d-sm-flex justify-content-between ">
        <h3 className="sub-title text-white">{props?.heading}</h3>

        <Select
          className="dropdown-graph mainInput w-auto"
          wrapperClass="w-auto"
          onChange={handleSelectChange}
          value={selectedValue}
        >
          {/* {years} */}
          {props.options}
        </Select>
      </div>

      <div
        className="graph-wrapper"
        style={{ minHeight: "400px", height: "100%" }}
      >
        <CChart
          key={i18n.language}
          type={props.type}
          height={90}
          options={{
            plugins: {
              legend: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                title: {
                  display: true,
                  text: props?.text,
                  color: "#fff",
                  font: { size: 16, weight: 700 },
                },
                font: {
                  size: 16,
                  weight: "bold",
                },
              },
              x: {
                title: {
                  display: true,
                  text: t("dashboard.months_title"),
                  color: "#fff", // white color
                  font: {
                    size: 16, // Font size 16px
                    weight: "bold", // Font weight bold
                  },
                },
              },
            },
          }}
          style={{ height: "400px" }}
          data={{
            labels: Array.isArray(props?.chartLabels)
              ? props.chartLabels
              : monthLabels,

            tension: "0.5",
            datasets: [
              {
                label: props.item.label,
                fill: props.item.fill,
                backgroundColor: props.backgroundColor, // Adjust for the fill color
                ...(props.borderColor && { borderColor: props.borderColor }),
                pointBackgroundColor: "#fff",
                borderWidth: 4,
                pointBorderColor: "#118076",
                data: props.item.data,
                tension: 0.5,
                barPercentage: 0.5, // Adjust this value to reduce the bar width
                categoryPercentage: 0.5,
              },
            ],
          }}
        />
      </div>
    </div>
  );
};
