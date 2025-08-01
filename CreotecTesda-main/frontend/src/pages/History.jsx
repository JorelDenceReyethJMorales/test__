import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Scroll arrow component
function ScrollArrow({ direction = "right", onClick, visible }) {
  const [hover, setHover] = useState(false);
  const baseStyle = {
    background: "transparent",
    border: "none",
    color: "#a361ef",
    cursor: "pointer",
    fontSize: "2.2rem",
    userSelect: "none",
    padding: "0 0.5rem",
    transition: "color 0.3s ease, transform 0.2s ease, opacity 0.3s ease",
    outline: "none",
    position: "absolute",
    top: "50%",
    transform: hover ? "translateY(-50%) scale(1.3)" : "translateY(-50%) scale(1)",
    opacity: visible ? (hover ? 1 : 0.7) : 0,
    zIndex: 10,
    pointerEvents: visible ? "auto" : "none",
    [direction === "left" ? "left" : "right"]: 10,
  };

  return (
    <button
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
    >
      {direction === "left" ? <FaChevronLeft /> : <FaChevronRight />}
    </button>
  );
}

function History() {
  const certScrollRef = useRef(null);
  const tesdaScrollRef = useRef(null);

  const [certificates, setCertificates] = useState([]);
  const [tesdaRecords, setTesdaRecords] = useState([]);

  const [showCertLeft, setShowCertLeft] = useState(false);
  const [showCertRight, setShowCertRight] = useState(false);
  const [showTesdaLeft, setShowTesdaLeft] = useState(false);
  const [showTesdaRight, setShowTesdaRight] = useState(false);

  const [hoverCert, setHoverCert] = useState(false);
  const [hoverTesda, setHoverTesda] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const scroll = (ref, direction) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: 200 * direction, behavior: "smooth" });
  };

  const downloadFile = async (filename) => {
  try {
    const res = await fetch(`http://localhost:5000/static/generated/${filename}`);
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    // 👇 Determine file type based on extension
    const filetype = filename.endsWith(".pptx") ? "certificate" : "tesda";

    // ✅ Track both certificate and TESDA downloads
    await fetch("http://localhost:5000/api/download-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, filetype }),
    });
  } catch (e) {
    console.error("Download failed:", e);
  }
};

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const certRes = await fetch("http://localhost:5000/api/certificates");
        const certData = await certRes.json();
        setCertificates(Array.isArray(certData) ? certData : []);

        const tesdaRes = await fetch("http://localhost:5000/api/tesda");
        const tesdaData = await tesdaRes.json();
        setTesdaRecords(Array.isArray(tesdaData) ? tesdaData : []);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchData();
  }, []);

  // Handle scroll arrow visibility
  useEffect(() => {
    const el = certScrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      setShowCertLeft(el.scrollLeft > 0);
      setShowCertRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };
    handleScroll();
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [certificates]);

  useEffect(() => {
    const el = tesdaScrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      setShowTesdaLeft(el.scrollLeft > 0);
      setShowTesdaRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };
    handleScroll();
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [tesdaRecords]);

  const containerStyle = {
    backgroundColor: "#696b6c",
    color: "white",
    margin: "2rem auto",
    padding: "1rem",
    width: "calc(100% - 256px)",
    marginLeft: "256px",
    boxShadow: "0 5px 7px #0000004d",
  };

  const scrollWrapperStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const scrollContainerStyle = {
    display: "flex",
    overflowX: "auto",
    scrollBehavior: "smooth",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    flexGrow: 1,
    padding: "0 2rem",
    margin: "0 1rem",
  };

  const itemStyle = {
    flex: "0 0 auto",
    backgroundColor: "#4c3a91",
    margin: "0 0.5rem",
    padding: "1rem",
    borderRadius: "4px",
    minWidth: "150px",
    height: "58px",
    textAlign: "center",
    boxShadow: "0 3px 5px #00000066",
    opacity: 0.85,
    transition: "transform 0.2s ease, opacity 0.2s ease",
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const sectionTitleStyle = {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#f3eaff",
    borderBottom: "2px solid #a361ef",
    paddingBottom: "0.5rem",
  };

  const renderRecords = (data, ref, hoverState, setHoverState, showLeft, showRight) => (
    <div
      style={scrollWrapperStyle}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
      <ScrollArrow direction="left" onClick={() => scroll(ref, -1)} visible={hoverState && showLeft} />
      <div ref={ref} style={scrollContainerStyle} className="scroll-container">
        {data.length === 0 ? (
          <div style={{ color: "#ddd" }}>No records found.</div>
        ) : (
          data.map((item, index) => (
            <div key={index} style={itemStyle} className="scroll-item" onClick={() => downloadFile(item)}>
              {item}
            </div>
          ))
        )}
      </div>
      <ScrollArrow direction="right" onClick={() => scroll(ref, 1)} visible={hoverState && showRight} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#1f1f1f] text-white">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button
            className="rounded-md bg-red-600 text-white px-3 py-1 hover:bg-red-700"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        <div style={containerStyle}>
          <h2 style={sectionTitleStyle}>Recently Made Certificates</h2>
          {renderRecords(certificates, certScrollRef, hoverCert, setHoverCert, showCertLeft, showCertRight)}
        </div>

        <div style={containerStyle}>
          <h2 style={sectionTitleStyle}>TESDA Records</h2>
          {renderRecords(tesdaRecords, tesdaScrollRef, hoverTesda, setHoverTesda, showTesdaLeft, showTesdaRight)}
        </div>

        <style>{`
          .scroll-container::-webkit-scrollbar {
            display: none;
          }

          .scroll-item:hover {
            transform: scale(1.05);
            height: 70px;
            opacity: 1;
          }
        `}</style>
      </div>
    </div>
  );
}

export default History;
