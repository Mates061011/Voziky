import './mainpage-section2.css';
import Path1 from '../../../assets/Vector 1.svg';
import Path2 from '../../../assets/Vector 2.svg';
import Calendar from '../../../assets/icons/bold/icon__calendar_check_bold.svg';
import Reserve from '../../../assets/icons/bold/icon__choose_bold.svg';
import DeliveryTruck from '../../../assets/icons/bold/icon__pick up_bold.svg';

export default function Section2() {
    return(
        <div className="section2">
            <div className="nadpisy">
                <h4>JAK TO FUNGNUJE?</h4>
                <h3>Snadná rezervace ve 3&nbsp;krocích</h3>
            </div>
            <div className="kroky">
                <div className="krok vyber">
                    <div className="icon-bg">
                        <img src={Calendar} alt="" className='section2-icon1'/>
                    </div>
                    <div className="step-content">
                        <h5>Vyber datum</h5>
                        <p>Vyber datum, Vozík si můžete zapůjčit už od jednoho dne.</p>
                    </div>
                </div>
                <img src={Path1} alt="" className="cesta cesta1"/>
                <div className="krok zarezervuj">
                    <div className="icon-bg2">
                        <img src={Reserve} alt="" className='section2-icon2'/>
                    </div>
                    <div className="step-content">
                        <h5>Zarezervuj</h5>
                        <p>Vyplňte rezervační formulář, nebo zavolejte.</p>
                    </div>
                </div>
                <img src={Path2} alt="" className="cesta cesta2"/>
                <div className="krok vyzvedni">
                    <div className="icon-bg">
                        <img src={DeliveryTruck} alt="" className='section2-icon3'/>
                    </div>
                    <div className="step-content">
                        <h5>Vyzvedni</h5>
                        <p>Zaplaťte zálohu, podepište výpůjční smlouvu a užíjte si vypůjčený vozík.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
