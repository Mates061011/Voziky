import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { cs } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./mainpage-section4.css";

registerLocale("cs", cs);

const FullMonthDayRangePicker = () => {
  const [dates, setDates] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [lockedDates, setLockedDates] = useState<Date[]>([]);
  const [selectedDaysCount, setSelectedDaysCount] = useState(0);
  const [price, setPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("https://voziky.onrender.com/api/appointment");
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

    if (isRangeValid(start, end)) {
      setDates([start ?? undefined, end ?? undefined]);
      const daysCount = calculateDaysCount(start, end);
      setSelectedDaysCount(daysCount);
    } else {
      alert("Bohužel v tomto termínu produkt již někdo rezervoval");
      setSelectedDaysCount(0);
    }
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
        selected={dates[0]}
        onChange={handleDateChange}
        startDate={dates[0]}
        endDate={dates[1]}
        selectsRange
        inline
        dateFormat="MMMM d, yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        filterDate={(date) => !isLockedDay(date)}
        locale="cs"
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
          <h5>{price} Kč</h5>
        </div>
        <div className="pujceni-button">
          <button onClick={handleSubmit}>Objednat</button>
        </div>
      </div>
    </div>
  );
};

export default FullMonthDayRangePicker;
