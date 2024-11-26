import { useEffect, useState } from "react";
import './mainpage-section1.css';
import Vozik from '../../../assets/Vozik4xCuted.png';
import calendarLogoLeft from '../../../assets/calendar-icon-left.svg';
import calendarLogoRight from '../../../assets/calendar-icon-right.svg';
import thuleLogo from '../../../assets/thule-logo.svg';

export default function Section1() {
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Start of the current month
        const min = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];

        // End of the next month 
        const max = new Date(currentYear, currentMonth + 2, 0).toISOString().split('T')[0];

        setMinDate(min);
        setMaxDate(max);
    }, []);

    const scrollToPixels = (pixels:number) => {
        window.scrollTo({ top: pixels, left: 0, behavior: "smooth" });
    };

    return (
        <div id="section1-mp">
            <div className="text-part">
                <h1>Půjčte&nbsp;si&nbsp;dětský <br />přívěsný vozík THULE</h1>
                <p>Všestranný vozík a kočárek pro běh a procházky, který nabízí pohodlí a flexibilitu pro rodiny s aktivním životním stylem. Obsahuje balíčky Standard a Comfort.</p>
                <img src={thuleLogo} alt="" />
            </div>
            <div className="picture-part">
                <img src={Vozik} alt="" />
            </div>
            <div className="bar-part">
                <div className="bar-part-bg">
                    <div className="datum-pujceni">
                        <img src={calendarLogoRight} alt="" />
                        <input
                            type="text"
                            placeholder="Datum půjčení"
                            onFocus={(e) => {
                                e.target.type = 'date';
                                e.target.min = minDate;
                                e.target.max = maxDate;
                            }}
                            onBlur={(e) => e.target.type = 'text'}
                        />
                    </div>
                    <div className="datum-vraceni">
                        <img src={calendarLogoLeft} alt="" />
                        <input
                            type="text"
                            placeholder="Datum vrácení"
                            onFocus={(e) => {
                                e.target.type = 'date';
                                e.target.min = minDate;
                                e.target.max = maxDate;
                            }}
                            onBlur={(e) => e.target.type = 'text'}
                        />
                    </div>
                    <button onClick={() => scrollToPixels(2000)} className="overit-dostupnost">Ověřit dostupnost</button>
                </div>
            </div>
        </div>
    );
}
