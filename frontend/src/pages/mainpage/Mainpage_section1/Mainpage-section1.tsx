
import "./mainpage-section1.css";
import { useScrollContext } from "../../../context/ScrollContext";
import thuleLogo from "../../../assets/thule-logo.svg";

export default function Section1() {
  const ref = useScrollContext();

  const handleScroll = () => {
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div id="section1-mp">
      <div className="text-part">
        <h1>Půjčte si dětský<br />vozík THULE Chariot<br />v Hradci Králové</h1>
        <p>
          Všestranný vozík a kočárek pro běh a procházky, který nabízí pohodlí a flexibilitu pro rodiny s aktivním životním stylem.
          Obsahuje balíčky Standard a Comfort.
        </p>
        <img src={thuleLogo} alt="Thule logo" />
      </div>
      <div className="picture-part">
        <img src="/items-avif/Thule Chariot Sport 2 double 01.avif" alt="Vozik Thule" />
      </div>
      <div className="bar-part">
        <div className="bar-part-bg">
          <button onClick={handleScroll} className="overit-dostupnost">
            Rezervovat
          </button>
        </div>
      </div>
    </div>
  );
}
