import { useEffect } from "react";
import Section1 from "./Mainpage_section1/Mainpage-section1";
import Section2 from "./Mainpage_section2/Mainpage-section2";
import Section3 from "./Mainpage_section3/Mainpage-section3";
import Section5 from "./Mainpage_section5/Mainpage-section5";
import Section6 from "./Mainpage_section6/Mainpage-section6";
import Section7 from "./Mainpage_section7/Mainpage_section7";
import { ScrollProvider } from "../../context/ScrollContext";
import Section4 from "./Mainpage_section4/Mainpage-section4";
import { useLocation } from "react-router-dom";
import MainPage_section4b from './Mainpage_section4b/MainPage_section4b';

export default function Mainpage() {
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo) {
            const scrollToElement = () => {
                const element = document.getElementById(location.state.scrollTo);
                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "center", // Align the element to the center of the screen
                    });
                } else {
                    // Retry if the element isn't rendered yet
                    setTimeout(scrollToElement, 100);
                }
            };
    
            scrollToElement(); // Start scrolling logic
        }
    }, [location.state]);
    

    return (
        <ScrollProvider>
            <main className="main-cont">
                <div className="grey-bg">
                    <div></div>
                </div>
                <Section1 />
                <Section2 />
                <div id="nabidka">
                    <Section3 />
                </div>
                <Section4 />
                <div id="prislusentsvi">
                    
                    <MainPage_section4b />
                </div>
                <Section5 />
                <div id="faq">
                    <Section6 />    
                </div>
                <Section7 />
            </main>
        </ScrollProvider>
    );
}
