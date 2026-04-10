import { useEffect, useRef, useState } from "react";
import pri from "./assets/priyansha-2.png";
import stand from "./assets/stand.png";
import speaker from "./assets/campa.png";
import us from "./assets/us.png";
import winners from "./assets/winners.png";

const TIMELINE_EVENTS = [
    {
        year: "2021",
        label: "ORIGIN",
        title: "First Spark",
        desc: "A small gathering of 80 students in Lab Block C. No sponsors. No stage. Just ideas, caffeine, and a shared belief that HMRITM deserved something bigger.",
        img: us,
        tag: "FOUNDING",
        stat: "80 attendees",
    },
    {
        year: "2022",
        label: "IGNITION",
        title: "The First Stage",
        desc: "TechExpo found its first auditorium slot. A keynote, two workshops, and a coding contest — and for the first time, faces you didn't recognize showed up.",
        img: stand,
        tag: "GROWTH",
        stat: "300+ attendees",
    },
    {
        year: "2023",
        label: "EXPANSION",
        title: "Speakers Arrive",
        desc: "Industry voices stepped onto our stage for the first time. Panels, product demos, and a hackathon that ran through the night — TechExpo earned its name.",
        img: speaker,
        tag: "MILESTONE",
        stat: "1K+ attendees",
    },
    {
        year: "2024",
        label: "MOMENTUM",
        title: "The Breakthrough",
        desc: "Sponsors. Press. A live-streamed keynote. The hackathon prize pool hit ₹1L for the first time. This was no longer a college event — it was a movement.",
        img: us, // FIXED: Changed from undefined 'them' to 'us' (or import a new image)
        tag: "BREAKTHROUGH",
        stat: "1.5K+ attendees",
    },
    {
        year: "2025",
        label: "LEGACY",
        title: "Hall of Champions",
        desc: "Record participation. Startup expo launches. Three student ventures received seed interest from attendees. The winners walked away with more than trophies.",
        img: winners,
        tag: "RECORD",
        stat: "1.8K+ attendees",
    },
    {
        year: "2026",
        label: "NOW",
        title: "The Next Chapter",
        desc: "You're here for this one. ₹2L+ prize pool, 50+ speakers, and a community that's been building toward this moment for five years. Don't miss it.",
        img: pri,
        tag: "YOU ARE HERE",
        stat: "2K+ expected",
    },
];

export default function Timeline3D() {
    const sectionRef = useRef(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const [revealed, setRevealed] = useState([]);
    const cardRefs = useRef([]);

    // Intersection reveal per card (single observer)
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const idx = cardRefs.current.indexOf(entry.target);
                    if (idx === -1) return;
                    setRevealed((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
                    setActiveIdx(idx);
                });
            },
            { threshold: 0.45 }
        );

        cardRefs.current.forEach((el) => el && obs.observe(el));
        return () => obs.disconnect();
    }, []);

    // FIXED: Better ref handling to avoid React reconciliation issues
    const setCardRef = (el, i) => {
        if (el) cardRefs.current[i] = el;
    };

    return (
        <section className="tl-section" id="timeline" ref={sectionRef}>
            {/* Section header */}
            <div className="tl-header">
                <div className="tl-header-inner">
                    <span className="tl-index">03</span>
                    <div>
                        <h2 className="tl-title">
                            OUR
                            <br />
                            <em>JOURNEY</em>
                        </h2>
                        <p className="tl-sub">Five years of building something worth attending.</p>
                    </div>
                </div>
                {/* Floating year pill */}
                <div className="tl-year-pill">
                    <span className="tl-year-pill-num">{TIMELINE_EVENTS[activeIdx].year}</span>
                    <span className="tl-year-pill-label">{TIMELINE_EVENTS[activeIdx].label}</span>
                </div>
            </div>

            {/* Progress spine */}
            <div className="tl-spine-wrap">
                <div className="tl-spine" />
                <div
                    className="tl-spine-fill"
                    style={{ height: `${((activeIdx + 1) / TIMELINE_EVENTS.length) * 100}%` }}
                />
                {TIMELINE_EVENTS.map((ev, i) => (
                    <button
                        key={ev.year}
                        className={`tl-spine-dot ${i <= activeIdx ? "tl-spine-dot--active" : ""} ${i === activeIdx ? "tl-spine-dot--current" : ""}`}
                        style={{ top: `${(i / (TIMELINE_EVENTS.length - 1)) * 100}%` }}
                        onClick={() => {
                            cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                            setActiveIdx(i);
                        }}
                        aria-label={`Jump to ${ev.year}`}
                    >
                        <span className="tl-spine-dot-inner" />
                    </button>
                ))}
            </div>

            {/* Cards */}
            <div className="tl-cards">
                {TIMELINE_EVENTS.map((ev, i) => {
                    const isEven = i % 2 === 0;
                    const isRevealed = revealed.includes(i);
                    const isActive = i === activeIdx;
                    return (
                        <div
                            key={ev.year}
                            ref={(el) => setCardRef(el, i)} // FIXED: Using stable ref setter
                            className={`tl-card ${isEven ? "tl-card--left" : "tl-card--right"} ${isRevealed ? "tl-card--revealed" : ""} ${isActive ? "tl-card--active" : ""}`}
                        >
                            {/* Year glyph */}
                            <div className="tl-card-year">{ev.year}</div>

                            {/* Image pane */}
                            <div className="tl-img-pane">
                                <div className="tl-img-inner" style={{ backgroundImage: `url("${ev.img}")` }} />
                                <div className="tl-img-overlay" />
                                <span className="tl-img-tag">{ev.tag}</span>
                                <span className="tl-img-stat">{ev.stat}</span>
                            </div>

                            {/* Text pane */}
                            <div className="tl-text-pane">
                                <p className="tl-card-label">{ev.label}</p>
                                <h3 className="tl-card-title">{ev.title}</h3>
                                <div className="tl-card-divider" />
                                <p className="tl-card-desc">{ev.desc}</p>

                                {i === TIMELINE_EVENTS.length - 1 && (
                                    <div className="tl-card-cta-wrap">
                                        <span className="tl-card-cta-dot" />
                                        <span className="tl-card-cta-text">APRIL 2026 · NEW DELHI</span>
                                    </div>
                                )}
                            </div>

                            {/* Connector line to spine */}
                            <div className="tl-connector" />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}