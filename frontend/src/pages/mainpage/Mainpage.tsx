import { useState, useEffect } from "react";
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
    const [password, setPassword] = useState("");
    const [accessGranted, setAccessGranted] = useState(false);

    const correctPassword = import.meta.env.VITE_MAINPAGE_PASSWORD; // Loaded from .env
    const localStorageKey = "accessGranted";
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo) {
            const scrollToElement = () => {
                const element = document.getElementById(location.state.scrollTo);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                } else {
                    // Retry after a short delay if the element is not found
                    setTimeout(scrollToElement, 100);
                }
            };

            scrollToElement(); // Start scrolling logic
        }
    }, [location.state]);
    
    
    useEffect(() => {
        const storedAccess = localStorage.getItem(localStorageKey);
        if (storedAccess === "true") {
            setAccessGranted(true);
        }
    }, []);

    const handlePasswordSubmit = (e:any) => {
        e.preventDefault();
        if (password === correctPassword) {
            setAccessGranted(true);
            localStorage.setItem(localStorageKey, "true");
        } else {
            alert("Incorrect password");
        }
    };

    if (!accessGranted) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>Tento web je ve vývoji, pro přístup zadejte heslo:</h1>
                <form onSubmit={handlePasswordSubmit}>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: "10px", fontSize: "16px", width: "200px" }}
                    />
                    <button
                        type="submit"
                        style={{
                            marginLeft: "10px",
                            padding: "10px 20px",
                            fontSize: "16px",
                            cursor: "pointer",
                        }}
                    >
                        Submit
                    </button>
                </form>
            </div>
        );
    }

    return (
        <ScrollProvider>
            <main className="main-cont">
                <div className="grey-bg">
                    <div></div>
                </div>
                <Section1 />
                <Section2 />
                <Section3 />
                <div id="section4"  ><Section4/></div>
                <MainPage_section4b/>
                <Section5 />
                <Section6 />
                <Section7 />
            </main>
            
        </ScrollProvider>
    );
}
