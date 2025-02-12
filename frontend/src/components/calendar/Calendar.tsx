import React from "react";
import { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { cs } from "date-fns/locale";
import { add } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./calendar.css";
import { useScrollContext } from '../../context/ScrollContext';
import { useDateContext } from '../../context/DateContext';

registerLocale("cs", cs);

interface Section4Props {
  showPopisky: boolean; // Prop to control the visibility of popiskyCont
}

const Section4: React.FC<Section4Props> = ({ showPopisky }) => {
  const ref = useScrollContext();
  const { dates, setDates } = useDateContext(); // Use dates and setDates from context
  const [lockedDates, setLockedDates] = useState<Date[]>([]);
  const [selectedDaysCount, setSelectedDaysCount] = useState(0);
  const [price, setPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/appointment`);
        const appointments = await response.json();

        const appointmentDates: Date[] = [];
        appointments.forEach(({ startDate, endDate }: { startDate: string; endDate: string }) => {
          let currentDate = new Date(startDate);
          const end = new Date(endDate);

          currentDate.setUTCHours(0, 0, 0, 0);
          end.setUTCHours(23, 59, 59, 999);

          while (currentDate <= end) {
            appointmentDates.push(new Date(currentDate));
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
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
    return Math.ceil((end.getTime() - start.getTime()) / msInDay) + 1;
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

  useEffect(() => {
    if (dates[0] && dates[1]) {
      if (!isRangeValid(dates[0], dates[1])) {
        setErrorMessage("Bohužel, vybrané datumy jsou již obsazeny.");
      } else {
        setErrorMessage("");
      }
    }
  }, [dates, lockedDates]);

  const handleDateChange = (update: [Date | null, Date | null]) => {
    const [start, end] = update;

    if (start && end && isRangeValid(start, end)) {
      setDates([start ?? undefined, end ?? undefined]); // Update the context with the selected range
      const daysCount = calculateDaysCount(start, end);
      setSelectedDaysCount(daysCount);
    } else if (!end) {
      setDates([start ?? undefined, undefined]);
      setSelectedDaysCount(0);
    } else {
      alert("Bohužel v tomto termínu produkt již někdo rezervoval");
      setDates([undefined, undefined]);
      setSelectedDaysCount(0);
    }
  };

  const getDayClassName = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the date is in the locked dates
    if (isLockedDay(date)) {
      return "locked-day"; // Mark locked dates with a specific class
    }

    // Check if the date is part of the selected range and not the last day
    if (dates[0] && dates[1] && date.getTime() === dates[1].getTime()) {
      return "last-day"; // This will mark the last day of the range
    }

    // Apply a past-day class for past dates
    if (date < today) {
      return "past-day"; // Apply a past-day class for past dates
    }

    return ""; // No class for valid days
  };

  return (
    <div className="datePickerCont" ref={ref}>
      <DatePicker
        selected={dates[0] || null}
        onChange={handleDateChange}
        startDate={dates[0]}
        endDate={dates[1]}
        selectsRange
        inline
        dateFormat="MMMM d, yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        filterDate={(date) => !isLockedDay(date)} // Filter locked dates
        dayClassName={getDayClassName}
        locale="cs"
        openToDate={add(new Date(), { weeks: 1 })}
      />


      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {showPopisky && ( // Conditionally render popiskyCont
        <div className="popiskyCont">
          <div className="popisky">
            <div className="popisek2">
              <div></div>
              <p>Vybraný termín</p>
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
        </div>
      )}
    </div>
  );
};

export default Section4;
