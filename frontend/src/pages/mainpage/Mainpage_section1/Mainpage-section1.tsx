
import "./mainpage-section1.css";
import { useScrollContext } from "../../../context/ScrollContext";
import { Helmet } from 'react-helmet';

// Import images to ensure correct bundling
import Vozik from "../../../assets/Vozik4xCuted-min.webp";
import thuleLogo from "../../../assets/thule-logo.svg";

export default function Section1() {
  const ref = useScrollContext();

  const handleScroll = () => {
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div id="section1-mp">
      <Helmet>
        <link rel="preload" href={Vozik} as="image" />
      </Helmet>
      <div className="text-part">
        <h1>Půjčte&nbsp;si&nbsp;dětský <br />přívěsný vozík THULE</h1>
        <p>
          Všestranný vozík a kočárek pro běh a procházky, který nabízí pohodlí a flexibilitu pro rodiny s aktivním životním stylem.
          Obsahuje balíčky Standard a Comfort.
        </p>
        <img src={thuleLogo} alt="Thule logo" />
      </div>
      <div className="picture-part">
        <img src={Vozik} alt="Vozik Thule" />
      </div>
      <div className="bar-part">
        <div className="bar-part-bg">
          
          <button onClick={handleScroll} className="overit-dostupnost">
            Ověřit dostupnost
          </button>
        </div>
      </div>
    </div>
  );
}
