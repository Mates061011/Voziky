import { useState } from "react";
import { useDateContext } from "../../context/DateContext"; // Update the path as necessary
import calendarLogoLeft from "../../assets/calendar-icon-left.svg";
import calendarLogoRight from "../../assets/calendar-icon-right.svg";
import Calendar from "../calendar/Calendar";
import "./resbar.css";
import { useNavigate } from "react-router-dom";

const ResBar = () => {
    const [showSection4, setShowSection4] = useState(false);
    const { dates } = useDateContext(); // Access dates from context
    const navigate = useNavigate();

    const toggleSection4 = () => {
        setShowSection4((prevState) => !prevState);
    };
    
    const handleSubmit = () => {
        if (dates[0] && dates[1]) {
        navigate("/Objednat", { state: { startDate: dates[0], endDate: dates[1] } });
        } else {
        alert("Vyberte prosím platné datumy před pokračováním.");
        }
    };
    const [startDate, endDate] = dates;

  return (
    <div className="bar-part2">
      <div className="bar-part-bg2">
        <button className="datum-pujceni2" onClick={toggleSection4}>
          <img src={calendarLogoRight} alt="Calendar logo for start date" />
          <p>{startDate ? startDate.toLocaleDateString() : "Datum vyzvednutí"}</p>
        </button>
        <button className="datum-vraceni2">
          <img src={calendarLogoLeft} alt="Calendar logo for end date" />
          <p>{endDate ? endDate.toLocaleDateString() : "Datum vrácení"}</p>
        </button>
        <button className="overit-dostupnost2" onClick={handleSubmit} >Rezervovat</button>
      </div>
      <div className={`section4-container ${showSection4 ? "visible" : ""}`}>
        <Calendar />
      </div>
    </div>
  );
};

export default ResBar;
