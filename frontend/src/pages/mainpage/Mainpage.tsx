import { useState, useEffect } from "react";
import Section1 from "./Mainpage_section1/Mainpage-section1";
import Section2 from "./Mainpage_section2/Mainpage-section2";
import Section3 from "./Mainpage_section3/Mainpage-section3";
import Section4 from "./Mainpage_section4/Mainpage-section4";
import Section5 from "./Mainpage_section5/Mainpage-section5";
import Section6 from "./Mainpage_section6/Mainpage-section6";
import Section7 from "./Mainpage_section7/Mainpage_section7";
import Bg from "../../assets/solid-color-image.jpeg";
import { ScrollProvider } from "../../context/ScrollContext";

export default function Mainpage() {
    const [password, setPassword] = useState("");
    const [accessGranted, setAccessGranted] = useState(false);

    const correctPassword = import.meta.env.VITE_MAINPAGE_PASSWORD; // Loaded from .env
    const localStorageKey = "accessGranted";

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
            <div className="main-cont">
                <div className="grey-bg">
                    <img src={Bg} alt="" />
                </div>
                <Section1 />
                <Section2 />
                <Section3 />
                <Section4 />
                <Section5 />
                <Section6 />
                <Section7 />
            </div>
            
        </ScrollProvider>
    );
}
