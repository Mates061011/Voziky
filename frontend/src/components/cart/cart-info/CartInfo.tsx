import { useUserContext } from "../../../context/userContext";
import './cartinfo.css';

// UserInfo Component to display the data
const UserInfo: React.FC = () => {
  const { userData } = useUserContext();

  return (
    <div className="cart-info">
      <div className="table-row">
        <div className="table-cell1"><strong>Jméno:</strong></div>
        <div className="table-cell">{userData.name} {userData.surname}</div>
      </div>
      <div className="table-row">
        <div className="table-cell1"><strong>Email:</strong></div>
        <div className="table-cell">{userData.email}</div>
      </div>
      <div className="table-row">
        <div className="table-cell1"><strong>Telefon:</strong></div>
        <div className="table-cell">{userData.phone}</div>
      </div>
    </div>
  );
};

export default UserInfo;
