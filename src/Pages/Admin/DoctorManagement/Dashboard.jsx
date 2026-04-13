import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import StatCard from "../../../Components/StatsCard/index";
import "./dashboarsstyle.css";
import { generateNextFiveYears } from "../../../Utils/helper";
import { getAll } from "../../../Services/Api";
import { Graph } from "../../../Components/Graph";
import { images } from "../../../Assets";
import { Link, useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";

const noop = () => {};

const DoctorDashboard = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  // Year selectors (per graph)
  const getCurrentYear = () => new Date().getFullYear();
  const defaultYear = String(getCurrentYear());
  const [earningsYear, setEarningsYear] = useState(defaultYear);
  const [bookingsYear, setBookingsYear] = useState(defaultYear);

  // Graph datasets (12 months each)
  const emptySeries = new Array(12).fill(0);
  const [chartdata, setChartData] = useState({
    heading: "Total Earning",
    label: "Total Earning",
    fill: true,
    data: emptySeries,
  });
  const [revenueChartdata, setRevenueChartData] = useState({
    heading: "Total Bookings",
    label: "Total Bookings",
    fill: true,
    data: emptySeries,
  });

  // Helpers
  const monthOrder = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const toSeries = (obj = {}) => monthOrder.map((m) => Number(obj?.[m]) || 0);

  // Fetch top stats
  const fetchStats = async () => {
    try {
      const res = await getAll(`/dashboard/stats/${id}`);
      const totals = res?.original?.data || res; // support both shapes
      setData([
        {
          id: 1,
          image: images.Stats1,
          number: String(totals?.total_earning ?? 0),
          text: "total earning",
          change: totals?.total_earning ?? 0,
          increase: false,
          arrowIcon: true,
          total_post: "Since last week",
          backgroundColor: "#ECE7F1",
        },
        {
          id: 5,
          image: images.Stats5,
          number: String(totals?.total_appointments ?? 0),
          text: "total Booking",
          change: totals?.total_appointments ?? 0,
          increase: false,
          arrowIcon: true,
          total_post: "Since last week",
          backgroundColor: "#FFF7CF",
        },
      ]);
    } catch (error) {
      // keep existing data if any; otherwise empty
      console.error("Error fetching dashboard stats", error);
    }
  };

  // Individual year change handlers
  const handleEarningYearChange = (value) => {
    const yr = value || defaultYear;
    setEarningsYear(yr);
    fetchEarningGraph(yr);
  };
  const handleBookingYearChange = (value) => {
    const yr = value || defaultYear;
    setBookingsYear(yr);
    fetchBookingGraph(yr);
  };

  // Graph: Earnings
  const fetchEarningGraph = async (year) => {
    try {
      const res = await getAll(`/dashboard/graph/earning/${id}`, { year });
      const series = toSeries(res?.original?.data || res?.data || res);
      setChartData({
        heading: "Total Earning",
        label: "Total Earning",
        fill: true,
        data: series,
      });
    } catch (error) {
      console.error("Error fetching earning graph", error);
      setChartData((prev) => ({ ...prev, data: emptySeries }));
    }
  };

  // Graph: Bookings
  const fetchBookingGraph = async (year) => {
    try {
      const res = await getAll(`/dashboard/graph/bookings/${id}`, { year });
      const series = toSeries(res?.original?.data || res?.data || res);
      setRevenueChartData({
        heading: "Total Bookings",
        label: "Total Bookings",
        fill: true,
        data: series,
      });
    } catch (error) {
      console.error("Error fetching bookings graph", error);
      setRevenueChartData((prev) => ({ ...prev, data: emptySeries }));
    }
  };

  const years = generateNextFiveYears();

  useEffect(() => {
    fetchStats();
    fetchEarningGraph(earningsYear);
    fetchBookingGraph(bookingsYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout pageTitle="Doctor Dashboard">
      {/* <div className="container-fluid dashCard pt-1"> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <h2 className="mainTitle mb-4">
                      <BackButton2 />
                      Doctor Dashboard
                    </h2>
                    {/* <Link to={'/admin/dashboard/app-report'} className="btn btn-primary min-width-180">Report</Link> */}
                  </div>
                </div>
              </div>
              <div className="row">
                {data?.map((stats, index) => (
                  <div
                    className="col-xxl-4 col-xl-6 mb-xl-4 mb-3"
                    key={stats.id}
                  >
                    <StatCard item={stats} index={index + 1} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12">
            <Graph
              type="line"
              item={chartdata}
              selectedValue={String(earningsYear)}
              onSelectChange={handleEarningYearChange}
              options={years}
              text="Total Earning"
              heading="Total Earning"
              backgroundColor="rgba(17, 128, 118, 0.25)"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12">
            <Graph
              type="line"
              item={revenueChartdata}
              selectedValue={String(bookingsYear)}
              onSelectChange={handleBookingYearChange}
              options={years}
              text="Total Bookings"
              heading="Total Bookings"
              backgroundColor="rgba(17, 128, 118, 0.25)"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
