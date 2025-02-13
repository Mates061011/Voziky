import { useState } from 'react';
import './mainpage-section3.css';

export default function Section3() {

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
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
            <span className={`para ${isExpanded ? 'paraExpanded' : ''}`}>
                dvoumístný multifunkční vozík za kolo a kočárek pro kondiční běh v jednom.
                Thule Chariot Lite 1 Agave - výlet do světa snů pro nejmenší, nabízející bezpečí, pohodlí a špičkový design.
                Thule Chariot Lite 1 Agave 2021 je jako kouzelný kompas, který vaše rodinná dobrodružství směřuje k nekonečným cyklistickým zážitkům. S elegancí designu vám tento dětský vozík otevírá dveře do světa vzrušení
                <span className="readMoreText" onClick={toggleText}>
                    {isExpanded ? 'Zobrazit méně' : 'Zobrazit více'}
                </span>
            </span>
        </div>
        <img src="/items/Thule Chariot Sport 2 double 02.png" alt="Thule Chariot Lite 1 Agave" loading="lazy" />
      </div>
    </div>
  );
}
