import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import withModal from "../../../HOC/withModal";
import { dateFormat } from "../../../Utils/helper";
import "./style.css";
import { images } from "../../../Assets";
import { getAll } from "../../../Services/Api";

const sampleFaqs = [
    {
        id: 1,
        question: "What is Yalla and how does it work?",
        answer:
            "Yalla is a wellness platform connecting users with experts. You can browse content, book sessions, and track your progress.",
        updated_at: new Date().toISOString(),
        status: 1,
        media: [],
    },
    {
        id: 2,
        question: "How do I reset my password?",
        answer:
            "Go to the login screen and choose ‘Forgot Password’. Follow the instructions sent to your email to reset your password securely.",
        updated_at: new Date().toISOString(),
        status: 1,
        media: [],
    },
    {
        id: 3,
        question: "Can I cancel a booking?",
        answer:
            "Yes, bookings can be cancelled from your appointments page subject to provider policy and timing constraints.",
        updated_at: new Date().toISOString(),
        status: 0,
        media: [
            {
                type: "image",
                url: images.placeholder,
            },
            // When API provides video, render it automatically
            // { type: "video", url: "/media/sample.mp4", poster: images.placeholder },
        ],
    },
];

const FAQsManagement = ({ showModal }) => {
    const navigate = useNavigate();
    const [faqs, setFaqs] = useState([{ id: 1, question: "Loading...", answer: "Loading...", updated_at: "", media: [] }]);
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await getAll(`/faqs`);
                const list = Array.isArray(res?.data) ? res.data : [];
                const normalized = list.map((f) => ({
                    id: f.id,
                    question: f.question ?? "",
                    answer: f.answer ?? "",
                    updated_at: f.created_at ?? "",
                    media: [
                        ...(f.image ? [{ type: "image", url: f.image }] : []),
                        ...(f.video ? [{ type: "video", url: f.video }] : []),
                    ],
                }));
                setFaqs(normalized);
            } catch (e) {
                console.error("Failed to load FAQs:", e);
                setFaqs([]);
            }
        };
        fetchFaqs();
    }, []);

    // status toggle removed in list view per final design

    const rows = useMemo(() => faqs, [faqs]);

    return (
        <DashboardLayout pageTitle="FAQs Management">
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mainTitle mb-0">FAQs Management</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/admin/faqs-management/add")}
                        >
                            Add FAQs
                        </button>
                    </div>

                    <div className="faq-list">
                        {rows.map((item, idx) => (
                            <div className="faq-item" key={item.id}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h5 className="faq-label mb-0">{`Question # ${String(idx + 1).padStart(2, "0")}`}</h5>
                                    <Link className="btn btn-secondary" to={`/admin/faqs-management/${item.id}/edit`}>
                                        Edit
                                    </Link>
                                </div>

                                <div className="faq-field mb-3">{item.question}</div>

                                {item?.answer && <div className="faq-field-answer mb-3 text-light">Answer :{item.answer}</div>}

                                {!!item.media?.length && (
                                    <div className="faq-media">
                                        {item.media.map((m, i) => (
                                            <div className="faq-media-tile" key={i}>
                                                {m.type === "video" ? (
                                                    <video controls poster={m.poster || undefined} src={m.url} />
                                                ) : (
                                                    <img src={m.url} alt={`media-${i}`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default withModal(FAQsManagement);
