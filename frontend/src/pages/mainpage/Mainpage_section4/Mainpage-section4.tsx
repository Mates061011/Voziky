
import Items from '../../../components/item-container/Items';
import ResBar from '../../../components/reservation-bar/ResBar';
import './mainpage-section4.css';
const Section42 = () => {
  return (
    <div>
        <div className="nadpis-section4">
            <h4>REZERVUJTE</h4>
            <h3>Thule Chariot Sport 2 G3 Double</h3>
        </div>
        <ResBar/>
        <Items/>
    </div>
  )
}

export default Section42;
