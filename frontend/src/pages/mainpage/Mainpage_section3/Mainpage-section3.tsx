import { useState, useRef, useEffect } from 'react';
import Vozik from '../../../assets/1465576 1.png';
import './mainpage-section3.css';

export default function Section3() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const paragraphRef = useRef<HTMLParagraphElement | null>(null); // Type explicitly

    useEffect(() => {
        if (paragraphRef.current) {
            // Check if the paragraph height exceeds 400px
            setShowButton(paragraphRef.current.scrollHeight > 200);
        }
    }, []);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="section3">
            <div className="nadpis-section3">
                <h4>VOZÍK</h4>
                <h3>Thule Chariot Sport 2 G3 Double</h3>
            </div>
            <div className="popis-a-kocarek">
                <div className="popis-cont flexColumn">
                    <p
                        ref={paragraphRef}
                        className={`popis para ${isExpanded ? 'expanded' : ''}`}
                    >
                        Dvoumístný multifunkční vozík za kolo a kočárek pro kondiční běh v jednom.<br /><br />
                        Thule Chariot Lite 1 Agave - výlet do světa snů pro nejmenší, nabízející bezpečí, pohodlí a špičkový design.<br /><br />
                        Thule Chariot Lite 1 Agave 2021 je jako kouzelný kompas, který vaše rodinná dobrodružství směřuje k nekonečným cyklistickým zážitkům.
                        S elegancí designu a špičkovou funkcionalitou vám tento dětský vozík otevírá dveře do světa vzrušení a pohodlí na každém kilometru.
                        Lze si půjčit miminkovník, který je určen pro děti od 1-10 měsíců. Je vhodný pro zimní i letní aktivity, jelikož půjčujeme lyžařské a cyklistické příslušenství.
                    </p>
                    {showButton && (
                        <button className="toggle-button" onClick={toggleExpanded}>
                            {isExpanded ? 'Zobrazit méně' : 'Zobrazit více'}
                        </button>
                    )}
                </div>
                <img src={Vozik} alt="Thule Chariot Lite 1 Agave" loading="lazy" />
            </div>
        </div>
    );
}
