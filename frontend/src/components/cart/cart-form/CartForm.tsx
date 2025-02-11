import React from 'react';
import { useUserContext } from '../../../context/userContext'; // No need for User import anymore
import './cartform.css';

const TwoColumnForm: React.FC = () => {
  const { userData, setUserData } = useUserContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update state with correct type
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Just update the context with userData, no onFormSubmit needed
    setUserData(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-column">
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="name">Jméno</label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-column">
        <label htmlFor="phone">Telefon</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="surname">Příjmení</label>
        <input
          type="text"
          id="surname"
          name="surname"
          value={userData.surname}
          onChange={handleChange}
          required
        />
      </div>
    </form>
  );
};

export default TwoColumnForm;
