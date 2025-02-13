import { useState } from 'react';
import './mainpage_section7.css';
import NaVetviLogo from '../../../assets/NaVetviLogo.svg';

const Section7 = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="section7">
      <div className="section7Wrap">
        {/* Section Title and Image */}
        <div className="section7-header">
          <div className="section7-nadpis">
            <h4>NAŠE TIPY NA VÝLETY PO OKOLÍ</h4>
            <h3>Park Na větvi</h3>
          </div>
          <img src={NaVetviLogo} alt="Logo Na Vetvi" className="NaVetviPic" />
        </div>

        {/* Text Content and Details */}
        <div className="contentWrap">
          <div className="gridWrap">
            <span className={`para ${isExpanded ? 'paraExpanded' : ''}`}>
              Park Na větvi tvoří unikátní soustava tří síťových hřišť zavěšených v korunách stromů propojených s 3D bludištěm, které je složeno ze síťových překážkových drah rozprostřených ve třech patrech nad sebou. Síťové bludiště v korunách stromů obsahuje mnoho zábavných prvků, které otestují vaše motorické dovednosti. Jednotlivé herní plochy jsou propojeny visutými lávkami. Celá atrakce vrcholí sjezdem unikátním tobogánem z výšky necelých 10 m. Pohybová atrakce je natolik bezpečná, že na rozdíl od klasických lanových center nevyžaduje žádné osobní lanové jištění.
              <br />
              Součástí areálu je plně vybavený stánek s občerstvením, ve kterém se mohou občerstvit malí dobrodruzi i čekající doprovod. Nabízí se zde regionální speciality od místních dodavatelů a o víkendech se před stánkem grilují sezónní dobroty.
              <span className="readMoreText" onClick={toggleText}>
                {isExpanded ? 'Zobrazit méně' : 'Zobrazit více'}
              </span>
            </span>
            <div className="details" style={{ marginTop: '40px' }}>
              <p><b>Vzdálenost od půjčovny:</b> 2 km</p>
              <p><b>Vhodné pro:</b> pěší, cyklisty, in-line bruslaře, běžce</p>
              <p><b>Web:</b> <a href="http://www.parknavetvi.cz" target="_blank" rel="noopener noreferrer">www.parknavetvi.cz</a></p>
            </div>
          </div>
          <div className="imgWrap2"></div>
        </div>

      </div>
    </div>
  );
};

export default Section7;
