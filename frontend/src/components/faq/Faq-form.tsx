import React, { useState } from 'react';
import './Faq-form.css';
const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form Submitted', { name, email, message });
  };

  return (
    <div className="contact-form">
      <h2>Nenašli jste odpověď?</h2>
      <h2>Zeptejte se!</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jméno a přijmení"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Emailová adresa"
            required
          />
        </div>
        <div className="form-group">
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Zpráva"
          required
          className="resizable-horizontal"
        ></textarea>

        </div>
        <button type="submit">Odeslat dotaz</button>
      </form>
    </div>
  );
};

export default ContactForm;
