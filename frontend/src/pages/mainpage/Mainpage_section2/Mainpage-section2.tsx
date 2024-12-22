import './mainpage-section2.css';
import Path1 from '../../../assets/Vector 1.svg';
import Path2 from '../../../assets/Vector 2.svg';
import Calendar from '../../../assets/Calendar.svg';
import Reserve from '../../../assets/Reserve.svg';
import DeliveryTruck from '../../../assets/DeliveryTruck.svg';

export default function Section2(){
    return(
        <div className="section2">
            <div className="nadpisy">
                <h4>JAK TO FUGNUJE?</h4>
                <h3>Snadná rezervace ve 3 krocích</h3>
            </div>
            <div className="kroky">
                <div className="krok vyber">
                    <div className="icon-bg"><img src={Calendar} alt="" /></div>                 
                    <h5>Vyber&nbsp;datum</h5>
                    <p>Vyber datum, Vozík si můžete zapůjčit už od jednoho dne.</p>
                </div>
                <img src={Path1} alt="" className="cesta cesta1"/>
                <div className="krok zarezervuj">
                    <div className="icon-bg2"><img src={Reserve} alt="" /></div>   
                    <h5>Zarezervuj</h5>
                    <p>Vyplňte rezervační formulář, nebo zavolejte.</p>
                </div>
                <img src={Path2} alt="" className="cesta cesta2"/>
                <div className="krok vyzvedni">
                    <div className="icon-bg"><img src={DeliveryTruck} alt="" /></div>   
                    <h5>Vyzvedni</h5>
                    <p>Zaplaťte zálohu, podepište výpůjční smlouvu a užíjte si vypůjčený vozík.</p>
                </div>
            </div>
        </div>
    )
}