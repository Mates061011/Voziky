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
      // Only send the _id (no need to wrap it in an object)
      const itemId = "67ae24a58ffccec087d79308"; // The item's _id you want to add to the cart
      const itemId2 = "67ae2e7740e23a98c1fa948e";
      // Add the item to the cart by dispatching the _id
      dispatch({ type: "ADD_TO_CART", _id: itemId });
      dispatch({ type: "ADD_TO_CART", _id: itemId2 });
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
        <Calendar showPopisky={true} />
      </div>
    </div>
  );
};

export default ResBar;
