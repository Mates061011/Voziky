import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Items from "../../components/adminItems/Items";
import { Checkbox, Select } from "antd";
import './adminpanelitem.css';
import closeButton from '../../assets/close.svg';
export interface Item {
  name: string;
  desc: string;
  pricePerDay: number;
  pricePerDays: number;
  type: "prislusenstvi" | "kocarek";
  img: string[]; // img is now an array of strings
  kauce: string; // Added kauce field
  hidden: boolean; // Added hidden field
}

const AdminPanelItem: React.FC = () => {
const navigate = useNavigate();

  
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return null;
  }
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [pricePerDay, setPricePerDay] = useState<number>(0);
  const [pricePerDays, setPricePerDays] = useState<number>(0);
  const [type, setType] = useState<"prislusenstvi" | "kocarek">("prislusenstvi");
  const [imgUrls, setImgUrls] = useState<string[]>([]); // Array for storing image URLs
  const [kauce, setKauce] = useState<string>("");
  const [hidden, setHidden] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  // Hardcoded list of images in the "public/item" folder
  const imageNames = ["Thule Chariot Infant Sling 01.png", "Thule Chariot Infant Sling 02.png", "Thule Chariot Jogging Kit 01.png", "Thule Chariot Jogging Kit 02.png", "Thule Chariot Jogging Kit 03.png", "Thule Chariot Ski Set 01.png", "Thule Chariot Ski Set 02.png", "Thule Chariot Sport 2 double 01.png", "Thule Chariot Sport 2 double 02.png", "Thule Chariot Sport 2 double 03.png", "Thule Chariot Sport 2 double 04.png", "Thule Chariot Sport 2 double 05.png", "Thule Chariot Sport 2 double 06.png", "Thule Chariot Travel Bag_01.png", "Thule Chariot Travel Bag_02.png"]; // Replace with your actual image filenames

  // Construct the full image URLs from the static names
  const imageUrls = imageNames.map((name) => `${name}`);

  const addImage = (url: string) => {
    if (!imgUrls.includes(url)) {
      setImgUrls([...imgUrls, url]); // Add new image URL to the array
    }
  };

  const deleteImage = (url: string) => {
    setImgUrls(imgUrls.filter((image) => image !== url)); // Remove the URL from the array
  };

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      name,
      desc,
      pricePerDay,
      pricePerDays,
      type,
      img: imgUrls, // Send the array of image URLs
      kauce,
      hidden, // Send hidden field
    };
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/api/items/add`, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)
      console.log("Item data to be sent:", itemData); 
      alert("Item created successfully!");
      // Reset the form fields after successful creation
      setName("");
      setDesc("");
      setPricePerDay(0);
      setPricePerDays(0);
      setType("prislusenstvi");
      setImgUrls([]); // Clear imgUrls array
      setKauce(""); // Reset kauce field
      setHidden(false); // Reset hidden field
    } catch (err: any) {
      setError(err.message || "Failed to create item.");
    } finally {
      setLoading(false);
    }
  };
  const [items, setItems] = useState<any[]>([]);
  const [loading2, setLoading2] = useState<boolean>(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading2(false);
      }
    };

    fetchItems();
  }, []);

  if (loading2) {
    return <div>Loading...</div>;
  }
  return (
    <div className="AdminPanelItem">
      <div>
        <h1>Admin Panel</h1>
        <h2>Přidej nové produkty</h2>
      </div>
      <div className="AdminPanelItemSubCont">
        <form className="formAdminItem" onSubmit={createItem} style={{ width: "400px" }}>
          {/* Name input */}
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Description input */}
          <div>
            <label htmlFor="desc">Description</label>
            <textarea
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>

          {/* Price per Day input */}
          <div>
            <label htmlFor="pricePerDay">Price per Day</label>
            <input
              type="number"
              id="pricePerDay"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(Number(e.target.value))}
              required
            />
          </div>

          {/* Price for Multiple Days input */}
          <div>
            <label htmlFor="pricePerDays">Price for Multiple Days</label>
            <input
              type="number"
              id="pricePerDays"
              value={pricePerDays}
              onChange={(e) => setPricePerDays(Number(e.target.value))}
              required
            />
          </div>

          {/* Type Select */}
          <div>
            <label htmlFor="type">Type</label>
            <Select
              style={{ width: "100%" }}
              value={type}
              onChange={(value) => setType(value as "prislusenstvi" | "kocarek")}
            >
              <Select.Option value="prislusenstvi">Prislusenstvi</Select.Option>
              <Select.Option value="kocarek">Kocarek</Select.Option>
            </Select>
          </div>

          {/* Image URL selection */}
          <div>
            <label htmlFor="img">Image URLs</label>
            <Select
              style={{ width: "100%" }}
              placeholder="Select Image"
              value={undefined} // No initial value
              onChange={addImage}
              className="imgInput"
            >
              {imageUrls.map((url, index) => (
                <Select.Option key={index} value={url}>
                  <img src={`/items/${url}`} alt={`image ${index + 1}`} style={{ width: "50px", marginRight: "10px" }} />
                  {url}
                </Select.Option>
              ))}
            </Select>
            <div className="addedImages">
                {imgUrls.map((url, index) => (
                  <div key={index}>
                    <img src={`/items/${url}`} alt={`image ${index + 1}`} style={{ width: "50px", marginRight: "10px" }} />
                    {url}
                    <button type="button" onClick={() => deleteImage(url)}>
                      <img src={closeButton} alt="" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Kauce input */}
          <div>
            <label htmlFor="kauce">Kauce</label>
            <input
              type="text"
              id="kauce"
              value={kauce}
              onChange={(e) => setKauce(e.target.value)} // Handle kauce field
              required
            />
          </div>

          {/* Hidden Checkbox */}
          <div>
            <label htmlFor="hidden">Hidden</label>
            <Checkbox 
              onChange={(e) => setHidden(e.target.checked)}
              style={{ color: '#FF6832' }} 
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Item"}
          </button>
        </form>

        {/* Display Items (Optional, for demonstration) */}
        <Items data={items} type="standard" admin={true} />
      </div>

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default AdminPanelItem;
