import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Items from "../../components/item-container/Items";

export interface Item {
  name: string;
  desc: string;
  pricePerDay: number;
  pricePerDays: number;
  type: "prislusenstvi" | "kocarek";
  img: string;
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
  const [img, setImg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemData: Item = {
      name,
      desc,
      pricePerDay,
      pricePerDays,
      type,
      img,
    };

    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/api/items/add`, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Item created successfully!");
      // Reset the form fields after successful creation
      setName("");
      setDesc("");
      setPricePerDay(0);
      setPricePerDays(0);
      setType("prislusenstvi");
      setImg("");
    } catch (err: any) {
      setError(err.message || "Failed to create item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      
      {/* Form to create a new item */}
      <h2>Přidej nové produkty</h2>
      <div className="adminCont" style={{display:"flex", flexDirection:"row", gap: "20px", width:"100%", justifyContent:"center"}}>
      <form onSubmit={createItem} style={{width:"400px"}}>
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

        <div>
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

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

        <div>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as "prislusenstvi" | "kocarek")}
            required
          >
            <option value="prislusenstvi">Prislusenstvi</option>
            <option value="kocarek">Kocarek</option>
          </select>
        </div>

        <div>
          <label htmlFor="img">Image URL</label>
          <input
            type="text"
            id="img"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Item"}
        </button>
      </form>
      <Items/>
      </div>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default AdminPanelItem;
