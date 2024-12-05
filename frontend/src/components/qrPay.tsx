import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface PaymentQRProps {
  name: string; // Name of the recipient
  price: number; // Price in CZK
  account: string;  // Recipient's account number (IBAN format including bank code)
  variableSymbol: string;  // Variable symbol (e.g., invoice or order number)
  specificSymbol?: string; // Specific symbol (optional)
  reference?: string; // Optional: Payment description/reference (optional)
}

const PaymentQR: React.FC<PaymentQRProps> = ({
  name,
  price,
  account,
  variableSymbol,
  specificSymbol,
  reference,
}) => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  useEffect(() => {
    // Generate Czech payment QR string
    const generateCzechPaymentString = () => {
      const czData = [
        "SPD*1.0",           // SPD (Standard Payment) version
        `ACC:${account}`,     // Recipient's account (IBAN + bank code)
        `AMT:${price.toFixed(2)}`, // Amount (in CZK)
        "CUI:CZK",            // Currency (CZK for Czech Republic)
        `VS:${variableSymbol}`,   // Variable symbol (e.g., order number)
        specificSymbol ? `SS:${specificSymbol}` : "",  // Specific symbol (optional)
        reference ? `VS:${reference}` : "" // Reference (optional)
      ]
        .filter(Boolean) // Remove empty strings
        .join("*");

      return czData;
    };

    // Generate QR Code from Czech payment string
    const czPaymentString = generateCzechPaymentString();
    QRCode.toDataURL(czPaymentString)
      .then(setQrCodeData)
      .catch((err) => console.error("Failed to generate QR code:", err));
  }, [name, price, account, variableSymbol, specificSymbol, reference]);

  if (!qrCodeData) return <p>Generating QR Code...</p>;

  return (
    <div>
      <h3>Payment QR Code</h3>
      <p>Pay {price.toFixed(2)} CZK to {name}</p>
      <img src={qrCodeData} alt="Payment QR Code" />
    </div>
  );
};

export default PaymentQR;
