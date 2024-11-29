import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { cs } from "date-fns/locale";
import { add } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./mainpage-section4.css";

registerLocale("cs", cs);

const Section4 = () => {
    const [dates, setDates] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
    const [lockedDates, setLockedDates] = useState<Date[]>([]);
    const [selectedDaysCount, setSelectedDaysCount] = useState(0);
    const [price, setPrice] = useState(0);
    const [isResetStep, setIsResetStep] = useState(false);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchAppointments = async () => {
        try {
          const response = await fetch(`${baseUrl}/api/appointment`);
          const appointments = await response.json();
  
          const appointmentDates: Date[] = [];
          appointments.forEach(({ startDate, endDate }: { startDate: string; endDate: string }) => {
            let currentDate = new Date(startDate);
            const end = new Date(endDate);
            while (currentDate <= end) {
              appointmentDates.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }
          });
  
          setLockedDates([...appointmentDates]);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      };
  
      fetchAppointments();
    }, []);
  
    const isLockedDay = (date: Date) =>
      lockedDates.some(
        (lockedDate) =>
          date.getDate() === lockedDate.getDate() &&
          date.getMonth() === lockedDate.getMonth() &&
          date.getFullYear() === lockedDate.getFullYear()
      );
  
    const isRangeValid = (start: Date | null, end: Date | null) => {
      if (!start || !end) return true;
      let currentDate = new Date(start);
      while (currentDate <= end) {
        if (isLockedDay(currentDate)) return false;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return true;
    };
  
    const calculateDaysCount = (start: Date | null, end: Date | null) => {
      if (!start || !end) return 0;
      const msInDay = 24 * 60 * 60 * 1000;
      return Math.ceil((end.getTime() - start.getTime()) / msInDay) + 1; // Include both start and end dates
    };
  
    const countPrice = useCallback(() => {
      if (selectedDaysCount === 0) {
        setPrice(0);
      } else if (selectedDaysCount === 1) {
        setPrice(300);
      } else {
        setPrice(selectedDaysCount * 250);
      }
    }, [selectedDaysCount]);
  
    useEffect(() => {
      countPrice();
    }, [selectedDaysCount, countPrice]);
  
    const handleDateChange = (update: [Date | null, Date | null]) => {
      const [start, end] = update;
    
      if (isResetStep) {
        // If in reset step, clear the selection
        setDates([undefined, undefined]);
        setSelectedDaysCount(0);
        setIsResetStep(false); // Move out of reset step
        return;
      }
    
      if (start && end && isRangeValid(start, end)) {
        // If valid range selected, set dates and calculate days
        setDates([start ?? undefined, end ?? undefined]);
        const daysCount = calculateDaysCount(start, end);
        setSelectedDaysCount(daysCount);
        setIsResetStep(true); // Enter reset step after setting a range
      } else if (!end) {
        // If starting a new selection (clearing range), allow normal behavior
        setDates([start ?? undefined, undefined]);
        setSelectedDaysCount(0);
        setIsResetStep(false);
      } else {
        // Invalid range
        alert("Bohužel v tomto termínu produkt již někdo rezervoval");
        setSelectedDaysCount(0);
        setIsResetStep(false);
      }
    };
    
    const getDayClassName = (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to midnight
    
      if (isLockedDay(date)) {
        return "locked-day"; // Red background for locked dates
      }
    
      if (date < today) {
        return "past-day"; // Reduced opacity for past days
      }
    
      return ""; // No additional classes for valid days
    };
    
    const handleSubmit = () => {
      if (dates[0] && dates[1]) {
        navigate("/Cart", { state: { startDate: dates[0], endDate: dates[1] } });
      } else {
        alert("Vyberte prosím platné datumy před pokračováním.");
      }
    };
  
    return (
      <div className="datePickerCont">
        <DatePicker
          selected={null} // Explicitly set selected to null to prevent preselection
          onChange={handleDateChange}
          startDate={dates[0]} // Highlight range start
          endDate={dates[1]} // Highlight range end
          selectsRange
          inline
          dateFormat="MMMM d, yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          filterDate={(date) => !isLockedDay(date)} // Prevent selecting locked days
          dayClassName={getDayClassName} // Apply custom day classes
          locale="cs"
          openToDate={add(new Date(), { weeks: 1 })} // Open to one week from today
        />



        <div className="popiskyCont">
          <div className="popisky">
            <div className="popisek1">
              <div></div>
              <h3>Obsazený termín</h3>
            </div>
            <div className="popisek2">
              <div></div>
              <h3>Vybraný termín</h3>
            </div>
          </div>
          <div className="pujceni-info">
            <p>Cena za vypůjčení za 1 den: 300 Kč</p>
          </div>
          <div className="pujceni-info">
            <p>Cena za vypůjčení za 2 a více dní: 250 Kč</p>
          </div>
          <div className="pujceni-counter">
            <p>Cena vypůjčení za zvolený termín: &nbsp;</p>
            <h5>{price}Kč</h5>
          </div>
          <div className="pujceni-button">
            <button onClick={handleSubmit}>Rezervovat</button>
          </div>
        </div>
      </div>
    );
};

export default Section4;
