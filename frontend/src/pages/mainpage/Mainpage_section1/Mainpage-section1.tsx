import { useDateContext } from "../../../context/DateContext";
import "./mainpage-section1.css";
import { useScrollContext } from "../../../context/ScrollContext";
import { useState } from "react";
import { Helmet } from 'react-helmet';

// Import images to ensure correct bundling
import Vozik from "../../../assets/Vozik4xCuted-min.webp";
import calendarLogoLeft from "../../../assets/calendar-icon-left.svg";
import calendarLogoRight from "../../../assets/calendar-icon-right.svg";
import thuleLogo from "../../../assets/thule-logo.svg";

export default function Section1() {
  const ref = useScrollContext();
  const { setDates } = useDateContext();
  const [startDay, setStartDay] = useState<Date | undefined>(undefined);
  const [endDay, setEndDay] = useState<Date | undefined>(undefined);

  const handleScroll = () => {
    if (startDay && endDay) {
      setDates([startDay, endDay]);
    } else {
      alert("Please select both start and end dates.");
      return;
    }
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });    
  };

  const handleStartDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value ? new Date(e.target.value) : undefined;
    setStartDay(newStartDate);
  };

  const handleEndDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value ? new Date(e.target.value) : undefined;
    setEndDay(newEndDate);
  };

  return (
    <div id="section1-mp">
      <Helmet>
        <link rel="preload" href={Vozik} as="image" />
      </Helmet>
      <div className="text-part">
        <h1>Půjčte&nbsp;si&nbsp;dětský <br />přívěsný vozík THULE</h1>
        <p>
          Všestranný vozík a kočárek pro běh a procházky, který nabízí pohodlí a flexibilitu pro rodiny s aktivním životním stylem.
          Obsahuje balíčky Standard a Comfort.
        </p>
        <img src={thuleLogo} alt="Thule logo" />
      </div>
      <div className="picture-part">
        <img src={Vozik} alt="Vozik Thule" />
      </div>
      <div className="bar-part">
        <div className="bar-part-bg">
          <div className="datum-pujceni">
            <img src={calendarLogoRight} alt="Calendar logo for start date"/>
            <input
              type="date"
              value={startDay ? startDay.toISOString().split("T")[0] : ""}
              onChange={handleStartDayChange}
            />
          </div>
          <div className="datum-vraceni">
            <img src={calendarLogoLeft} alt="Calendar logo for end date" />
            <input
              type="date"
              value={endDay ? endDay.toISOString().split("T")[0] : ""}
              onChange={handleEndDayChange}
            />
          </div>
          <button onClick={handleScroll} className="overit-dostupnost">
            Ověřit dostupnost
          </button>
        </div>
      </div>
    </div>
  );
}
