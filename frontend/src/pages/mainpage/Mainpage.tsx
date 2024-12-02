import Section1 from "./Mainpage_section1/Mainpage-section1";
import Section2 from "./Mainpage_section2/Mainpage-section2";
import Section3 from "./Mainpage_section3/Mainpage-section3";
import Section4 from "./Mainpage_section4/Mainpage-section4";
import Section5 from "./Mainpage_section5/Mainpage-section5";
import Section6 from "./Mainpage_section6/Mainpage-section6";
import Bg from './Mainpage_section1/solid-color-image.jpeg';


export default function Mainpage(){
    return(
        <div className="main-cont">
            <div className="grey-bg"><img src={Bg} alt="" /></div>
            <Section1/>
            <Section2/>
            <Section3/>
            <Section4/>
            <Section5/>
            <Section6/>
        </div>
        
    )
}