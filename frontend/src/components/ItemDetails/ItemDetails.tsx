import { useParams } from "react-router-dom";
import { useItemContext } from "../../context/ItemContext"; // Import the custom hook

function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { items, loading, error } = useItemContext(); // Use context to get items
  const item = items.find((item) => item._id === id); // Find the item based on the id

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!item) {
    return <div>Item not found</div>; // Handle case where the item is not found
  }

  return (
    <div>
      <h1>{item.name}</h1>
      <img
        src={`items/${item.img}`} // Adjust to your image folder
        alt={item.name}
        style={{ width: "300px", height: "auto" }}
      />
      <p>{item.desc}</p>
      <p>
        Price Per Day: {item.pricePerDay} Kč | Price Per Days: {item.pricePerDays} Kč
      </p>
      <p>Type: {item.type}</p>
      <p>Kauce: {item.kauce} Kč</p>
    </div>
  );
}

export default ItemDetail;
