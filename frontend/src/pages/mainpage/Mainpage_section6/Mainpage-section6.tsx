import "./mainpage-section6.css";
import Faq from '../../../components/faq/Faq';
import ContactForm from '../../../components/faq/Faq-form';

const Section6 = () => (
  <div className='faq-main-cont'>
    <div className="nadpis-section6">
        <h4>FAQ</h4>
        <h3>Často kladené dotazy</h3>
      </div>
    <div className='flexRow'>
      <div className='questions flexColumn'>
        <Faq />
      </div>
      <div className='qaa-form flexColumn'>
        <ContactForm />
      </div>
    </div>
  </div>
);

export default Section6;
