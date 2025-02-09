import React, { useState } from 'react';
import './Faq-form.css';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(null);

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/faq`;

    const payload = {
      name,
      email,
      question: message,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setResponseMessage('Vaše otázka byla úspěšně odeslána!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const errorData = await response.json();
        setResponseMessage(
          `Chyba při odesílání: ${errorData.message || 'Nepodařilo se odeslat.'}`
        );
      }
    } catch (error) {
      setResponseMessage('Došlo k chybě při připojení k serveru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form">
      <h2>Nenašli jste odpověď?</h2>
      <h2>Zeptejte se!</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Jméno a příjmení</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Emailová adresa</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Zpráva</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="resizable-horizontal"
          ></textarea>
        </div>
        {responseMessage ? (
          <p style={{ margin: '10px 0', textAlign: 'right' }}>{responseMessage}</p>
        ) : (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Odesílám...' : 'Odeslat\u00A0dotaz'}
          </button>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
