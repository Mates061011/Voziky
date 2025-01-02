import Vozik from '../../../assets/vozíkTrimmed.webp';
import './mainpage-section3.css';
export default function Section3() {
    return(
        <div className="section3">
            <div className="nadpis-section3">
                <h4>VOZÍK</h4>
                <h3>Thule Chariot Lite 1 Agave 2021</h3>
            </div>
            <div className="popis-a-kocarek">
                <p><div className="stay para">jednomístný multifunkční sportovní vozík za kolo <br /><br /> Thule Chariot Lite 1 Agave - výlet do světa snů pro nejmenší, nabízející bezpečí, pohodlí a špičkový design.<br /><br /></div> <div className="dontkeep"> Thule Chariot Lite 1 Agave 2021 je jako kouzelný kompas, který vaše rodinná dobrodružství směřuje k nekonečným cyklistickým zážitkům. S elegancí designu a špičkovou funkcionalitou vám tento dětský vozík otevírá dveře do světa vzrušení a pohodlí na každém kilometru. Lze si půjčit miminkovník, který je určen pro děti od 1-10 měsíců. Je vhodný pro zimní i letní aktiviity, jelikož půjčujeme lyžařské a cyklsistické příslušenství.</div></p>
                <img src={Vozik} alt="" />
            </div>
        </div>
    )
}