import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Timeline3D from "./Timeline3D";
import "./App.css";
import "./Timeline3D.css";

const REGISTER_URL = "https://docs.google.com/forms/d/e/1FAIpQLScXicE-7HV5GJJQSt-sS-va-td7oyLxwXlf3v2XMeUm5FDv2A/viewform?usp=publish-editor";
const NAV_LINKS = ["About", "Events", "Schedule", "Timeline", "Register"];

// Event schedule data - Day 1 & Day 2
const SCHEDULE_DATA = [
  {
    day: "DAY 1",
    date: "APRIL 18, 2026",
    events: [
      { time: "09:00 AM", title: "Registration & Check-in", venue: "Main Lobby", type: "logistics" },
      { time: "10:00 AM", title: "Opening Ceremony", venue: "Main Auditorium", type: "main" },
      { time: "10:30 AM", title: "Keynote: The Future of AI", venue: "Main Auditorium", type: "talk" },
      { time: "12:00 PM", title: "Hackathon Kickoff", venue: "Innovation Labs", type: "build" },
      { time: "12:30 PM", title: "Lunch Break", venue: "Food Court", type: "break" },
      { time: "02:00 PM", title: "Coding Contest Round 1", venue: "Lab Block C", type: "competition" },
      { time: "03:00 PM", title: "Workshop: Web3 Basics", venue: "Seminar Hall 1", type: "workshop" },
      { time: "04:00 PM", title: "Workshop: AI/ML Pipeline", venue: "Seminar Hall 2", type: "workshop" },
      { time: "05:00 PM", title: "Panel: Startup Ecosystem", venue: "Forum Hall", type: "talk" },
      { time: "06:00 PM", title: "Networking Mixer", venue: "Open Terrace", type: "networking" },
      { time: "08:00 PM", title: "Dinner", venue: "Food Court", type: "break" },
      { time: "09:00 PM", title: "Hackathon Continues", venue: "Innovation Labs", type: "build" },
    ]
  },
  {
    day: "DAY 2",
    date: "APRIL 19, 2026",
    events: [
      { time: "09:00 AM", title: "Breakfast", venue: "Food Court", type: "break" },
      { time: "10:00 AM", title: "Workshop: Cloud Native Dev", venue: "Seminar Hall 1", type: "workshop" },
      { time: "11:00 AM", title: "Panel: Future of Work", venue: "Forum Hall", type: "talk" },
      { time: "12:00 PM", title: "Hackathon Mid-Review", venue: "Innovation Labs", type: "build" },
      { time: "12:30 PM", title: "Lunch Break", venue: "Food Court", type: "break" },
      { time: "02:00 PM", title: "Design Sprint Finals", venue: "Studio", type: "competition" },
      { time: "03:00 PM", title: "Startup Expo Opens", venue: "Innovation Hall", type: "demo" },
      { time: "04:00 PM", title: "Tech Quiz Finals", venue: "Main Auditorium", type: "competition" },
      { time: "05:00 PM", title: "Hackathon Submission", venue: "Innovation Labs", type: "build" },
      { time: "06:00 PM", title: "Judging Begins", venue: "All Venues", type: "main" },
      { time: "07:00 PM", title: "Closing Ceremony", venue: "Main Auditorium", type: "main" },
      { time: "09:00 PM", title: "After Party", venue: "Lawns", type: "networking" },
    ]
  }
];

function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) => setPos({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    };
    window.addEventListener("mousemove", move);
    let raf;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px)`;
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}

/* ── QR MODAL ── */
function QRModal({ onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="qr-backdrop" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <button className="qr-close" onClick={onClose}>✕</button>
        <p className="qr-eyebrow">SCAN TO REGISTER</p>
        <div className="qr-code-wrap">
          <div className="qr-corner qr-corner--tl" />
          <div className="qr-corner qr-corner--tr" />
          <div className="qr-corner qr-corner--bl" />
          <div className="qr-corner qr-corner--br" />
          <QRCodeSVG value={REGISTER_URL} size={220} bgColor="#0a0a0a" fgColor="#e8ff47" level="H" includeMargin={false} />
        </div>
        <p className="qr-title">TechExpo 2026</p>
        <p className="qr-sub">Can't scan? Click the link below</p>
        <a className="qr-link" href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
          <span className="qr-link-icon">↗</span>
          <span>Open Registration Form</span>
        </a>
        <p className="qr-url-text">{REGISTER_URL.slice(0, 60)}…</p>
      </div>
    </div>
  );
}

/* ── NAVBAR ── */
function Navbar({ scrolled, onRegister }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="nav-logo">
        <span className="logo-mark">◈</span>
        <span className="logo-text">TECHEXPO</span>
      </div>
      <ul className="nav-links">
        {NAV_LINKS.filter(l => l !== "Register").map((l) => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
              <span className="nav-link-inner">{l}</span>
            </a>
          </li>
        ))}
      </ul>
      <button className="nav-cta desktop-only" onClick={onRegister}>REGISTER</button>
      <button className="hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
        <span className={`ham-line ${menuOpen ? "ham-open" : ""}`} />
        <span className={`ham-line ${menuOpen ? "ham-open" : ""}`} />
        <span className={`ham-line ${menuOpen ? "ham-open" : ""}`} />
      </button>
      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        {NAV_LINKS.filter(l => l !== "Register").map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{l}</a>
        ))}
        <button className="mobile-register-btn" onClick={() => { setMenuOpen(false); onRegister(); }}>REGISTER NOW</button>
      </div>
    </nav>
  );
}

/* ── HERO ── */
function Hero({ mouse, onRegister }) {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCan = () => setLoaded(true);
    v.addEventListener("canplay", onCan);
    return () => v.removeEventListener("canplay", onCan);
  }, []);

  return (
    <section className="hero" id="about">
      <div className="video-wrap">
        <video ref={videoRef} className={`bg-video ${loaded ? "bg-video--loaded" : ""}`}
          src="/bg.mov" autoPlay loop muted playsInline />
        <div className="video-overlay" />
        <div className="video-scanlines" />
        <div className="video-vignette" />
      </div>
      <div className="grid-layer" style={{ transform: `translate(${mouse.x * -12}px,${mouse.y * -12}px)` }} />
      <div className="orb orb-1" style={{ transform: `translate(${mouse.x * 20}px,${mouse.y * 15}px)` }} />
      <div className="orb orb-2" style={{ transform: `translate(${mouse.x * -15}px,${mouse.y * 20}px)` }} />
      <div className="hero-content">
        <br /><br /><br /><br />
        <div className="hero-label">
          <span className="label-line" />
          THE FUTURE IS NOW · DELHI
          <span className="label-line" />
        </div>
        <h1 className="hero-title">
          <span className="title-line line-1">
            {"TECH".split("").map((c, i) => (
              <span key={i} className="char" style={{ "--i": i }}>{c}</span>
            ))}
          </span>
          <span className="title-line line-2">
            {"EXPO".split("").map((c, i) => (
              <span key={i} className="char" style={{ "--i": i + 4 }}>{c}</span>
            ))}
          </span>
        </h1>
        <div className="hero-year">
          <span className="year-slash">/</span>
          <span className="year-num">2026</span>
          <span className="year-slash">/</span>
        </div>
        <p className="hero-sub">
          Where technology meets tomorrow.<br />
          Innovate · Collaborate · Elevate.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={onRegister}>
            <span>REGISTER NOW</span>
            <div className="btn-bg" />
          </button>
          <a href="#events" className="btn-ghost">EXPLORE EVENTS</a>
        </div>
      </div>
      <div className="hud hud-tl"><span>LAT 28.6139°N</span><span>LON 77.2090°E</span></div>
      <div className="hud hud-tr"><span className="hud-dot" /><span>LIVE</span></div>
      <div className="hud hud-br"><span>APR 2026</span><span>NEW DELHI</span></div>
      <div className="scroll-indicator"><div className="scroll-line" /><span>SCROLL</span></div>
    </section>
  );
}

/* ── MARQUEE ── */
function MarqueeBar() {
  const items = ["INNOVATION","◈","TECHNOLOGY","◈","NETWORKING","◈","WORKSHOPS","◈","HACKATHON","◈","KEYNOTES","◈"];
  return (
    <div className="marquee-bar">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ── ABOUT SECTION ── */
function AboutSection() {
  return (
    <section className="about-section" id="about-detail">
      <div className="about-inner">
        <div className="about-left">
          <div className="section-header">
            <span className="section-index">01</span>
            <h2 className="section-title">ABOUT<br /><em>TECHEXPO</em></h2>
          </div>
          <div className="about-body">
            <p className="about-lead">
              TechExpo 2026 is HMRITM's flagship technology festival — a two-day immersive experience built for builders, dreamers, and the boldly curious.
            </p>
            <p className="about-para">
              Held at the heart of New Delhi in April 2026, TechExpo brings together students, industry leaders, startup founders, and innovators under one roof. Whether you're pitching your first idea or shipping production-grade code, there's a space for you here.
            </p>
            <p className="about-para">
              From high-octane hackathons and immersive workshops to inspiring keynote sessions and a buzzing startup expo — TechExpo is where technology gets human.
            </p>
            <div className="about-tags">
              {["AI & ML","Web3","Robotics","Cloud","Cybersecurity","Open Source"].map(t => (
                <span key={t} className="about-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="about-right">
          <div className="about-visual">
            <div className="about-card about-card--1">
              <span className="about-card-icon">◈</span>
              <h4>Our Mission</h4>
              <p>Bridge the gap between academia and industry through real-world technology experiences.</p>
            </div>
            <div className="about-card about-card--2">
              <span className="about-card-icon">⬡</span>
              <h4>Our Vision</h4>
              <p>Create the most impactful student-led tech event in Northern India.</p>
            </div>
            <div className="about-card about-card--3">
              <span className="about-card-icon">◻</span>
              <h4>The Venue</h4>
              <p>HMRITM Campus, Hamidpur, New Delhi — fully equipped with labs, auditoriums & open spaces.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── EVENT DETAIL MODAL ── */
function EventModal({ event, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const esc = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  return (
    <div className={`event-backdrop ${visible ? "event-backdrop--in" : ""}`} onClick={handleClose}>
      <div className={`event-modal ${visible ? "event-modal--in" : ""}`} onClick={e => e.stopPropagation()}>
        <button className="event-modal-close" onClick={handleClose}>✕</button>
        <div className="event-modal-header">
          <span className="event-modal-id">{event.id}</span>
          <span className="event-modal-tag">{event.tag}</span>
        </div>
        <h2 className="event-modal-title">{event.title}</h2>
        <p className="event-modal-sub">{event.sub}</p>
        <div className="event-modal-divider" />
        <p className="event-modal-desc">{event.description}</p>
        <div className="event-modal-details">
          {event.details.map((d, i) => (
            <div key={i} className="event-detail-row">
              <span className="event-detail-label">{d.label}</span>
              <span className="event-detail-val">{d.value}</span>
            </div>
          ))}
        </div>
        {event.highlights && (
          <div className="event-highlights">
            <p className="event-highlights-title">HIGHLIGHTS</p>
            <ul className="event-highlights-list">
              {event.highlights.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
        )}
        <button className="event-modal-register" onClick={() => window.open(REGISTER_URL, "_blank")}>
          <span>REGISTER FOR THIS EVENT</span>
          <div className="btn-bg" />
        </button>
      </div>
    </div>
  );
}

/* ── EVENTS SECTION ── */
const ALL_EVENTS = [
  {
    id: "01", title: "HACKNOVATE", sub: "Industry leaders · Main Stage", tag: "TALK",
    description: "Visionary talks from top minds in technology, entrepreneurship, and research. Our keynote speakers have built products used by millions and led teams at the frontier of innovation.",
    details: [
      { label: "Date", value: "Day 1 — April 18, 2026" },
      { label: "Time", value: "10:30 AM – 12:00 PM" },
      { label: "Venue", value: "Main Auditorium" },
      { label: "Capacity", value: "500 seats" },
    ],
    highlights: ["5 keynote speakers", "Live Q&A sessions", "Recorded & streamed online", "Exclusive meet-and-greet after"],
  },
  {
    id: "02", title: "TECH QUIZ", sub: "36-hr build challenge · Labs", tag: "BUILD",
    description: "36 hours. One problem statement. Unlimited creativity. The TechExpo Hackathon is where ideas become prototypes and prototypes become products. Open to teams of 2–4.",
    details: [
      { label: "Start", value: "Day 1 — April 18, 12:00 PM" },
      { label: "End", value: "Day 2 — April 19, 12:00 PM" },
      { label: "Venue", value: "Innovation Labs, Block B" },
      { label: "Prize Pool", value: "₹2,00,000+" },
    ],
    highlights: ["Team size: 2–4 members", "Mentors on-site all night", "Judged by industry experts", "Cash + internship prizes"],
  },
  {
    id: "03", title: "CYBER GAMES", sub: "Hands-on learning · All levels", tag: "LEARN",
    description: "Parallel-track workshops running across both days covering the hottest topics in tech. Each session is capped at 40 participants for an intimate learning experience.",
    details: [
      { label: "Tracks", value: "AI/ML, Web3, DevOps, Robotics" },
      { label: "Duration", value: "2 hrs each session" },
      { label: "Level", value: "Beginner to Advanced" },
      { label: "Seats", value: "40 per workshop" },
    ],
    highlights: ["10+ workshop tracks", "Certificate of completion", "Free resource kits", "Industry-led sessions"],
  },
  {
    id: "04", title: "STARTUP EXPO", sub: "Demo booths · Innovation Hall", tag: "DEMO",
    description: "Browse 30+ student and early-stage startup demo booths in the Innovation Hall. Pitch to investors, network with founders, and discover products being built right here in Delhi.",
    details: [
      { label: "Date", value: "Both days" },
      { label: "Venue", value: "Innovation Hall, Ground Floor" },
      { label: "Booths", value: "30+ startups" },
      { label: "Investors", value: "10+ VCs attending" },
    ],
    highlights: ["Live product demos", "Investor speed-dating", "Pitch competition", "Best Startup award ₹50,000"],
  },
  {
    id: "05", title: "PANEL DISCUSSIONS", sub: "Expert roundtables · Forum Hall", tag: "TALK",
    description: "Deep-dive discussions on the future of AI regulation, the open-source movement, climate tech, and the next wave of Indian startups. Moderated by journalists and researchers.",
    details: [
      { label: "Date", value: "Day 2 — April 19, 2026" },
      { label: "Time", value: "11:00 AM – 1:00 PM" },
      { label: "Venue", value: "Forum Hall" },
      { label: "Panelists", value: "4 per session" },
    ],
    highlights: ["3 panel tracks", "Open audience Q&A", "Live social commentary", "Post-panel networking"],
  },
  {
    id: "06", title: "CODING CONTEST", sub: "Competitive programming · Leaderboard", tag: "BUILD",
    description: "A timed competitive programming contest with problems ranging from easy warm-ups to expert-level algorithmic challenges. Compete solo for glory and prizes.",
    details: [
      { label: "Date", value: "Day 1 — April 18, 2026" },
      { label: "Time", value: "2:00 PM – 5:00 PM" },
      { label: "Platform", value: "CodeChef / HackerRank" },
      { label: "Prize", value: "₹25,000 for top 3" },
    ],
    highlights: ["Solo competition", "5 difficulty tiers", "Live leaderboard", "Swag for top 10"],
  },
  {
    id: "07", title: "DESIGN SPRINT", sub: "UI/UX challenge · Studio", tag: "CREATE",
    description: "A rapid 4-hour design challenge where teams ideate, prototype, and present a solution to a real product brief. Judged on creativity, usability, and presentation.",
    details: [
      { label: "Date", value: "Day 2 — April 19, 2026" },
      { label: "Time", value: "9:00 AM – 1:00 PM" },
      { label: "Tools", value: "Figma (provided)" },
      { label: "Team Size", value: "2–3 members" },
    ],
    highlights: ["Real-world brief", "Figma Pro access", "Mentored by designers", "Portfolio-ready output"],
  },
  {
    id: "08", title: "CLOSING CEREMONY", sub: "Awards & networking · Main Stage", tag: "EVENT",
    description: "Celebrate two days of innovation at the grand closing ceremony. Awards across all competitions, final keynote, and an open networking mixer with food and music.",
    details: [
      { label: "Date", value: "Day 2 — April 19, 2026" },
      { label: "Time", value: "6:00 PM – 9:00 PM" },
      { label: "Venue", value: "Main Auditorium + Lawns" },
      { label: "Dress Code", value: "Smart Casual" },
    ],
    highlights: ["All prize distributions", "Closing keynote", "Live music & food stalls", "Open to all registered attendees"],
  },
];

const INITIAL_COUNT = 4;

function EventsSection() {
  const [showAll, setShowAll] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const visibleEvents = showAll ? ALL_EVENTS : ALL_EVENTS.slice(0, INITIAL_COUNT);

  return (
    <section className="work-section" id="events">
      <div className="section-header">
        <span className="section-index">02</span>
        <h2 className="section-title">FEATURED<br /><em>EVENTS</em></h2>
      </div>
      <div className="work-grid">
        {visibleEvents.map((w, idx) => (
          <div
            className={`work-card ${showAll && idx >= INITIAL_COUNT ? "work-card--new" : ""}`}
            key={w.id}
            onClick={() => setSelectedEvent(w)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && setSelectedEvent(w)}
          >
            <div className="work-card-inner">
              <div className="work-card-bg" />
              <div className="work-meta">
                <span className="work-id">{w.id}</span>
                <span className="work-tag">{w.tag}</span>
              </div>
              <h3 className="work-title">{w.title}</h3>
              <p className="work-sub">{w.sub}</p>
              <div className="work-arrow">→</div>
              <p className="work-hint">CLICK TO EXPLORE</p>
            </div>
          </div>
        ))}
      </div>

      <div className="show-more-wrap">
        <button className="show-more-btn" onClick={() => setShowAll(v => !v)}>
          <span>{showAll ? "SHOW LESS ↑" : `SHOW MORE EVENTS (${ALL_EVENTS.length - INITIAL_COUNT}+) ↓`}</span>
          <div className="show-more-bg" />
        </button>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}

/* ── STATS ── */
const STATS = [
  { val: "50+", label: "Speakers" },
  { val: "2K+", label: "Attendees" },
  { val: "36H", label: "Hackathon" },
  { val: "₹2L+", label: "Prize Pool" },
];

function StatsSection() {
  return (
    <section className="stats-section" id="about-stats">
      <div className="stats-bg-text">2026</div>
      <div className="stats-grid">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-val">{s.val}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── SCROLLING SCHEDULE SECTION ── */
function ScheduleSection() {
  const [activeDay, setActiveDay] = useState(0);
  const scrollRef = useRef(null);

  const scrollToDay = (index) => {
    setActiveDay(index);
    if (scrollRef.current) {
      const dayWidth = scrollRef.current.scrollWidth / SCHEDULE_DATA.length;
      scrollRef.current.scrollTo({
        left: dayWidth * index,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const dayWidth = scrollRef.current.scrollWidth / SCHEDULE_DATA.length;
        const newIndex = Math.round(scrollLeft / dayWidth);
        if (newIndex !== activeDay) {
          setActiveDay(newIndex);
        }
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeDay]);

  const getEventTypeColor = (type) => {
    const colors = {
      main: "#e8ff47",
      talk: "#00d4ff",
      workshop: "#ff6b6b",
      build: "#4ecdc4",
      competition: "#ffe66d",
      demo: "#a8e6cf",
      networking: "#ff8b94",
      break: "#888888",
      logistics: "#c7c7c7"
    };
    return colors[type] || "#ffffff";
  };

  return (
    <section className="schedule-section" id="schedule">
      <div className="section-header schedule-header">
        <span className="section-index">04</span>
        <h2 className="section-title">EVENT<br /><em>SCHEDULE</em></h2>
      </div>
      
      <div className="schedule-day-tabs">
        {SCHEDULE_DATA.map((day, idx) => (
          <button
            key={day.day}
            className={`schedule-tab ${activeDay === idx ? 'schedule-tab--active' : ''}`}
            onClick={() => scrollToDay(idx)}
          >
            <span className="schedule-tab-day">{day.day}</span>
            <span className="schedule-tab-date">{day.date}</span>
          </button>
        ))}
      </div>

      <div className="schedule-scroll-container" ref={scrollRef}>
        <div className="schedule-days-wrapper">
          {SCHEDULE_DATA.map((day, dayIdx) => (
            <div key={day.day} className="schedule-day-column">
              <div className="schedule-timeline">
                {day.events.map((event, eventIdx) => (
                  <div 
                    key={`${day.day}-${eventIdx}`} 
                    className="schedule-item"
                    style={{ 
                      '--delay': `${eventIdx * 0.1}s`,
                      '--glow-color': getEventTypeColor(event.type)
                    }}
                  >
                    <div className="schedule-time-marker">
                      <span className="schedule-time">{event.time}</span>
                      <div className="schedule-dot" style={{ backgroundColor: getEventTypeColor(event.type) }} />
                      <div className="schedule-line" />
                    </div>
                    <div className="schedule-card">
                      <div className="schedule-card-glow" style={{ backgroundColor: getEventTypeColor(event.type) }} />
                      <div className="schedule-card-content">
                        <span 
                          className="schedule-type-badge" 
                          style={{ 
                            color: getEventTypeColor(event.type),
                            borderColor: getEventTypeColor(event.type)
                          }}
                        >
                          {event.type}
                        </span>
                        <h4 className="schedule-event-title">{event.title}</h4>
                        <div className="schedule-venue">
                          <span className="schedule-venue-icon">◈</span>
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="schedule-scroll-hint">
        <span className="schedule-scroll-line" />
        <span>SCROLL TO SWITCH DAYS</span>
        <span className="schedule-scroll-line" />
      </div>
    </section>
  );
}

/* ── REGISTER CTA SECTION ── */
function RegisterSection({ onRegister }) {
  return (
    <section className="contact-section" id="register">
      <div className="contact-inner">
        <p className="contact-pre">LIMITED SEATS AVAILABLE</p>
        <h2 className="contact-title">JOIN<br /><span className="contact-accent">TECHEXPO 2026</span></h2>
        <button className="contact-btn-btn" onClick={onRegister}>
          <span>REGISTER NOW →</span>
          <div className="contact-btn-bg" />
        </button>
        <p className="register-note">Scan the QR or click the button above to fill the registration form</p>
      </div>
      <footer className="footer">
        <span>© 2026 TECHEXPO</span>
        <span>HMRITM · NEW DELHI</span>
      </footer>
    </section>
  );
}

/* ── APP ── */
export default function App() {
  const mouse = useMouseParallax();
  const [scrolled, setScrolled] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (showQR) document.body.style.overflow = "hidden";
    else if (!document.querySelector(".event-backdrop--in")) {
      document.body.style.overflow = "";
    }
  }, [showQR]);

  return (
    <>
      <Cursor />
      <Navbar scrolled={scrolled} onRegister={() => setShowQR(true)} />
      {showQR && <QRModal onClose={() => setShowQR(false)} />}
      <main>
        <Hero mouse={mouse} onRegister={() => setShowQR(true)} />
        <MarqueeBar />
        <AboutSection />
        <StatsSection />
        <EventsSection />
        <ScheduleSection />
        <Timeline3D />
        <RegisterSection onRegister={() => setShowQR(true)} />
      </main>
    </>
  );
}