import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import StatCard from "../../../Components/StatsCard/index";
import "./style.css";
import { generateNextFiveYears } from "../../../Utils/helper";
import { getAll } from "../../../Services/Api";
import { Graph } from "../../../Components/Graph";
import { images } from "../../../Assets";

const STAT_CARD_COUNT = 5;
const GRAPH_BLOCK_COUNT = 5;

const statSkeletonProps = {
    baseColor: "rgba(255, 255, 255, 0.14)",
    highlightColor: "rgba(255, 255, 255, 0.22)",
};

const graphSkeletonProps = {
    baseColor: "rgba(255, 255, 255, 0.12)",
    highlightColor: "rgba(255, 255, 255, 0.2)",
};

const DashboardStatCardSkeleton = () => (
    <div className="stats_card dashboard-stat-skeleton px-xxl-4 px-3 px-sm-4 px-lg-2">
        <div className="dashboard-skeleton-row">
            <div className="flex-grow-1">
                <Skeleton circle width={50} height={50} {...statSkeletonProps} />
                <div className="mt-xl-3 mt-2">
                    <Skeleton width={120} height={36} {...statSkeletonProps} />
                </div>
            </div>
            <Skeleton width={100} height={56} {...statSkeletonProps} />
        </div>
        <Skeleton width="70%" height={20} {...statSkeletonProps} className="mt-2" />
    </div>
);

const DashboardGraphSkeleton = () => (
    <div className="graphCard dashboard-graph-skeleton">
        <div className="dashboard-graph-skeleton-head">
            <Skeleton width={200} height={28} {...graphSkeletonProps} />
            <Skeleton width={120} height={44} borderRadius={10} {...graphSkeletonProps} />
        </div>
        <div className="dashboard-graph-skeleton-chart">
            <Skeleton height={400} {...graphSkeletonProps} />
        </div>
    </div>
);

export const Dashboard = () => {
    // Top stats cards
    const [data, setData] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [graphsLoading, setGraphsLoading] = useState(true);

    // Year selectors (per graph)
    const getCurrentYear = () => new Date().getFullYear();
    const defaultYear = String(getCurrentYear());
    const [earningsYear, setEarningsYear] = useState(defaultYear);
    const [bookingsYear, setBookingsYear] = useState(defaultYear);
    const [usersYear, setUsersYear] = useState(defaultYear);
    const [doctorsYear, setDoctorsYear] = useState(defaultYear);
    const [trainersYear, setTrainersYear] = useState(defaultYear);

    // Graph datasets (12 months each)
    const emptySeries = new Array(12).fill(0);
    const [chartdata, setChartData] = useState({ heading: "Total Earning", label: "Total Earning", fill: true, data: emptySeries });
    const [revenueChartdata, setRevenueChartData] = useState({ heading: "New Bookings", label: "New Bookings", fill: true, data: emptySeries });
    const [userdata, setNewUsersData] = useState({ heading: "Total Users", label: "Total Users", fill: true, data: emptySeries });
    const [doctorData, setDoctorData] = useState({ heading: "Total Doctors", label: "Total Doctors", fill: true, data: emptySeries });
    const [trainerData, setTrainerData] = useState({ heading: "Total Trainers", label: "Total Trainers", fill: true, data: emptySeries });

    // Helpers
    const monthOrder = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const toSeries = (obj = {}) => monthOrder.map((m) => Number(obj?.[m]) || 0);

    // Fetch top stats
    const fetchStats = async () => {
        try {
            const res = await getAll("/dashboard/stats");
            const totals = res?.original?.data || res; // support both shapes
            setData([
                { id: 1, image: images.Stats1, number: String(totals?.total_earning ?? 0), text: "total earning", change: totals?.total_earning ?? 0, increase: false, arrowIcon: true, total_post: "Since last week", backgroundColor: "#ECE7F1" },
                { id: 2, image: images.Stats2, number: String(totals?.total_users ?? 0), text: "Total Users", change: totals?.total_users ?? 0, increase: true, arrowIcon: true, total_post: "Since last week", backgroundColor: "#E8F3F0" },
                { id: 3, image: images.Stats3, number: String(totals?.total_doctors ?? 0), text: "Total Doctors", change: totals?.total_doctors ?? 0, increase: true, arrowIcon: true, total_post: "Since last week", backgroundColor: "#E2F1FB" },
                { id: 4, image: images.Stats4, number: String(totals?.total_trainers ?? 0), text: "Total Trainers", change: totals?.total_trainers ?? 0, increase: false, arrowIcon: true, total_post: "Since last week", backgroundColor: "#FFF7CF" },
                { id: 5, image: images.Stats5, number: String(totals?.total_appointments ?? 0), text: "New Booking", change: totals?.total_appointments ?? 0, increase: false, arrowIcon: true, total_post: "Since last week", backgroundColor: "#FFF7CF" },
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
    const handleUsersYearChange = (value) => {
        const yr = value || defaultYear;
        setUsersYear(yr);
        fetchUsersGraph(yr);
    };
    const handleDoctorsYearChange = (value) => {
        const yr = value || defaultYear;
        setDoctorsYear(yr);
        fetchDoctorsGraph(yr);
    };
    const handleTrainersYearChange = (value) => {
        const yr = value || defaultYear;
        setTrainersYear(yr);
        fetchTrainersGraph(yr);
    };

    // Graph: Earnings
    const fetchEarningGraph = async (year) => {
        try {
            const res = await getAll("/dashboard/graph/earning", { year });
            const series = toSeries(res?.original?.data || res?.data || res);
            setChartData({ heading: "Total Earning", label: "Total Earning", fill: true, data: series });
        } catch (error) {
            console.error("Error fetching earning graph", error);
            setChartData((prev) => ({ ...prev, data: emptySeries }));
        }
    };

    // Graph: Bookings
    const fetchBookingGraph = async (year) => {
        try {
            const res = await getAll("/dashboard/graph/bookings", { year });
            const series = toSeries(res?.original?.data || res?.data || res);
            setRevenueChartData({ heading: "New Bookings", label: "New Bookings", fill: true, data: series });
        } catch (error) {
            console.error("Error fetching bookings graph", error);
            setRevenueChartData((prev) => ({ ...prev, data: emptySeries }));
        }
    };

    // Graph: Users
    const fetchUsersGraph = async (year) => {
        try {
            const res = await getAll("/dashboard/graph/users", { year });
            const series = toSeries(res?.original?.data || res?.data || res);
            setNewUsersData({ heading: "Total Users", label: "Total Users", fill: true, data: series });
        } catch (error) {
            console.error("Error fetching users graph", error);
            setNewUsersData((prev) => ({ ...prev, data: emptySeries }));
        }
    };

    // Graph: Doctors
    const fetchDoctorsGraph = async (year) => {
        try {
            const res = await getAll("/dashboard/graph/doctors", { year });
            const series = toSeries(res?.original?.data || res?.data || res);
            setDoctorData({ heading: "Total Doctors", label: "Total Doctors", fill: true, data: series });
        } catch (error) {
            console.error("Error fetching doctors graph", error);
            setDoctorData((prev) => ({ ...prev, data: emptySeries }));
        }
    };

    // Graph: Trainers
    const fetchTrainersGraph = async (year) => {
        try {
            const res = await getAll("/dashboard/graph/trainers", { year });
            const series = toSeries(res?.original?.data || res?.data || res);
            setTrainerData({ heading: "Total Trainers", label: "Total Trainers", fill: true, data: series });
        } catch (error) {
            console.error("Error fetching trainers graph", error);
            setTrainerData((prev) => ({ ...prev, data: emptySeries }));
        }
    };

    const years = generateNextFiveYears();

    useEffect(() => {
        let active = true;
        setStatsLoading(true);
        setGraphsLoading(true);

        (async () => {
            try {
                await fetchStats();
            } finally {
                if (active) setStatsLoading(false);
            }
        })();

        (async () => {
            try {
                await Promise.all([
                    fetchEarningGraph(earningsYear),
                    fetchBookingGraph(bookingsYear),
                    fetchUsersGraph(usersYear),
                    fetchDoctorsGraph(doctorsYear),
                    fetchTrainersGraph(trainersYear),
                ]);
            } finally {
                if (active) setGraphsLoading(false);
            }
        })();

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DashboardLayout pageTitle="Dashboard">
                {/* <div className="container-fluid dashCard pt-1"> */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                            <h2 className="mainTitle text-white mb-3">Dashboard</h2>
                                            {/* <Link to={'/admin/dashboard/app-report'} className="btn btn-primary min-width-180">Report</Link> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {statsLoading
                                        ? Array.from({ length: STAT_CARD_COUNT }, (_, i) => (
                                            <div className="col-xxl-4 col-xl-6 mb-xl-4 mb-3" key={`stat-sk-${i}`}>
                                                <DashboardStatCardSkeleton />
                                            </div>
                                        ))
                                        : data?.map((stats, index) => (
                                            <div className="col-xxl-4 col-xl-6 mb-xl-4 mb-3" key={stats.id}>
                                                <StatCard item={stats} index={index + 1} />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {graphsLoading
                        ? Array.from({ length: GRAPH_BLOCK_COUNT }, (_, i) => (
                            <div className="row mb-3" key={`graph-sk-${i}`}>
                                <div className="col-12">
                                    <DashboardGraphSkeleton />
                                </div>
                            </div>
                        ))
                        : (
                            <>
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
                                            text="New Bookings"
                                            heading="New Bookings"
                                            backgroundColor="rgba(17, 128, 118, 0.25)"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <Graph
                                            type="line"
                                            item={userdata}
                                            selectedValue={String(usersYear)}
                                            onSelectChange={handleUsersYearChange}
                                            options={years}
                                            text="Total Users"
                                            heading="Total Users"
                                            backgroundColor="rgba(17, 128, 118, 0.25)"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <Graph
                                            type="line"
                                            item={doctorData}
                                            selectedValue={String(doctorsYear)}
                                            onSelectChange={handleDoctorsYearChange}
                                            options={years}
                                            text="Total Doctors"
                                            heading="Total Doctors"
                                            backgroundColor="rgba(17, 128, 118, 0.25)"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <Graph
                                            type="line"
                                            item={trainerData}
                                            selectedValue={String(trainersYear)}
                                            onSelectChange={handleTrainersYearChange}
                                            options={years}
                                            text="Total Trainer"
                                            heading="Total Trainer"
                                            backgroundColor="rgba(17, 128, 118, 0.25)"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                </div>
            </DashboardLayout>
        </>
    );
};
