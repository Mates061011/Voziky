import { useState, useEffect } from "react";
import { useDateContext } from "../../context/DateContext"; // Update the path as necessary
import calendarLogoLeft from "../../assets/calendar-icon-left.svg";
import calendarLogoRight from "../../assets/calendar-icon-right.svg";
import Calendar from "../calendar/Calendar";
import "./resbar.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext"; // Import useCart

const ResBar = () => {
  const [showSection4, setShowSection4] = useState(false);
  const [activeButton, setActiveButton] = useState<"start" | "end" | null>(null);
  const { dates, setDates } = useDateContext(); // Access dates and setDates function from context
  const { dispatch } = useCart(); // Access dispatch from CartContext
  const navigate = useNavigate();

  const toggleSection4 = (button: "start" | "end") => {
    setShowSection4(true);
    setActiveButton(button);
  };

  const handleSubmit = () => {
    if (dates[0] && dates[1]) {
      // Define the item to be added to the cart
      const itemToAdd = {
        _id: "67a9c975f3da6099cdf0c42e",
        name: "Thule Chariot Sport 2 G3 Double",
        desc: "dvoumístný multifunkční vozík za kolo a kočárek pro kondiční běh v jed…",
        pricePerDay: 250,
        pricePerDays: 300,
        type: "kocarek",
        img: "Thule Chariot Sport 2 double 01.png",
        kauce: "2000",
        __v: 0
      };

      // Add item to cart
      dispatch({ type: "ADD_TO_CART", item: itemToAdd });

      // Navigate to the next page with dates
      navigate("/Objednat", { state: { startDate: dates[0], endDate: dates[1] } });
    } else {
      alert("Vyberte prosím platné datumy před pokračováním.");
    }
  };

  const [startDate, endDate] = dates;

  useEffect(() => {
    // Automatically slide to end if startDate is selected
    if (startDate && !endDate) {
      setActiveButton("end"); // Automatically select "end" once "start" is picked
    }
  }, [startDate, endDate]);

  const handleStartDateClick = () => {
    // Reset the dates when the first button is clicked
    setDates([undefined, undefined]);
    setShowSection4(true);
    setActiveButton("start");
  };

  return (
    <div className="bar-part2">
      <div className="bar-part-bg2">
        <div className="button-container">
          <button
            className={`datum-pujceni2 ${activeButton === "start" ? "active" : ""}`}
            onClick={handleStartDateClick} // Update the click handler
          >
            <img src={calendarLogoRight} alt="Calendar logo for start date" />
            <p>{startDate ? startDate.toLocaleDateString() : "Datum vyzvednutí"}</p>
          </button>
          <button
            className={`datum-vraceni2 ${activeButton === "end" ? "active" : ""}`}
            onClick={() => startDate && toggleSection4("end")}  // Only allow toggle if start date is selected
            disabled={!startDate} // Disable the second button if start date is not selected
          >
            <img src={calendarLogoLeft} alt="Calendar logo for end date" />
            <p>{endDate ? endDate.toLocaleDateString() : "Datum vrácení"}</p>
          </button>

          {/* Conditionally render and animate blue bar only if both dates are not selected */}
          {showSection4 && !(startDate && endDate) && (
            <div
              className="blue-bar"
              style={{
                transform: `translateX(${startDate && activeButton === "end" ? "162%" : "0"})`,
              }}
            />
          )}
        </div>

        {/* Conditionally apply background color */}
        <button
          className="overit-dostupnost2"
          onClick={handleSubmit} // Call handleSubmit when button is clicked
        >
          Rezervovat
        </button>
      </div>
      <div className={`section4-container ${showSection4 ? "visible" : ""}`}>
        <Calendar />
      </div>
    </div>
  );
};

export default ResBar;
