import { useState, useEffect } from 'react';
import { useItemContext } from '../../../context/ItemContext'; // Adjust path according to your project structure
import './mainpage-section3.css';

export default function Section3() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgUrls, setImgUrls] = useState<string[]>([]); // To store all image URLs
  const [currentIndex, setCurrentIndex] = useState<number>(0); // To track the current image
  
  // Access the ItemContext
  const { items } = useItemContext();
  
  useEffect(() => {
    // Find the item with the specific _id
    const item = items.find((item) => item._id === '67ae24a58ffccec087d79308');
    if (item && item.img && item.img.length > 0) {
      setImgUrls(item.img); // Set all image URLs
    }
  }, [items]);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const changeImage = (index: number) => {
    setCurrentIndex(index); // Change the current image when a dot is clicked
  };

  return (
    <div className="section3">
      <div className="nadpis-section3">
        <h4>VOZÍK</h4>
        <h3>Thule Chariot Sport 2 G3 Double</h3>
      </div>
      <div className="popis-a-kocarek">
        <div className="popis-cont flexColumn">
          <span className={`para ${isExpanded ? 'paraExpanded' : ''}`}>
            dvoumístný multifunkční vozík za kolo a kočárek pro kondiční běh v jednom. <br /><br />
            Thule Chariot Lite 1 Agave - výlet do světa snů pro nejmenší, nabízející bezpečí, pohodlí a špičkový design. <br /><br />
            Thule Chariot Lite 1 Agave 2021 je jako kouzelný kompas, který vaše rodinná dobrodružství směřuje k nekonečným cyklistickým zážitkům. S elegancí designu vám tento dětský vozík otevírá dveře do světa vzrušení
            <span className="readMoreText" onClick={toggleText}>
              {isExpanded ? 'Zobrazit méně' : 'Zobrazit více'}
            </span>
          </span>
          <div className="pujceni-info">
            <p>Cena za vypůjčení za 1 den: 300 Kč</p>
          </div>
          <div className="pujceni-info">
            <p>Cena za vypůjčení za 2 a více dní: 250 Kč</p>
          </div>
        </div>
        {/* Display the current image */}
        <div className="pictureCarouselCont">
          {imgUrls.length > 0 && (
            <div className="carousel">
              <img 
                src={`/items-avif/${imgUrls[currentIndex]}`} 
                alt={`Thule Chariot Lite ${currentIndex + 1}`} 
                loading="lazy" 
                className="carousel-image" 
              />
            </div>
          )}
          
          {/* Render dots for each image */}
          <div className="dots-container">
            {imgUrls.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentIndex ? 'active' : ''}`} 
                onClick={() => changeImage(index)} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
