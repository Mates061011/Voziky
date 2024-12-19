import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import path from 'path';

// Helper function to sanitize inputs
const sanitizeInput = (input: string): string => {
    return input.replace(/[\r\n]/g, '').trim();
};

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Secure sendEmail function with optional QR code attachment
const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    userDetails?: {
      startDate: Date;
      endDate: Date;
      price: number;
    },
    qrData?: {
      variableSymbol: Number;
      paymentInfo: string; // A string to generate the QR code
    }
  ): Promise<void> => {
    const sanitizedTo = sanitizeInput(to);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedText = sanitizeInput(text);
  
    if (!isValidEmail(sanitizedTo)) {
      throw new Error('Invalid email address format');
    }
  
    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  
    if(userDetails){
        const { startDate, endDate, price } = userDetails;
    }
    

    const formatDateInCzech = (date: string | Date): string => {
        const utcDate = new Date(date);
        const formatter = new Intl.DateTimeFormat('cs-CZ', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC', // Force UTC
        });
        return formatter.format(utcDate);
    };
         
    let htmlContent = `
    <html>
    <head>
        <title>Order Information</title>
    </head>
    <body>
        <div style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
            <div style="width: 600px; background-color: #768078; padding: 20px; border-radius: 20px; color: white; font-family: Arial, sans-serif;">
                <h1 style="margin: 0 0 20px 0;">Informace o vaší objednávce:</h1>
                ${userDetails ? `
                <div>
                    <p style="margin: 0 0 10px 0; color: rgb(209, 209, 209);">
                        Datum:&nbsp;<strong style="color: white;">
                            ${formatDateInCzech(userDetails.startDate)} - ${formatDateInCzech(userDetails.endDate)}
                        </strong>
                    </p>
                    <p style="margin: 0 0 20px 0; color: rgb(209, 209, 209);">
                        Celková cena:&nbsp;<strong style="color: white;">${userDetails.price}kč</strong>
                    </p>
                </div>
                ` : ''}
                <div style="margin: 20px 0;">
                    <p style="margin: 5px 0; font-weight: bold; color: white;">Zaplatte zálohu 100kč pro potvrzení objednávky</p>
                    <img src="cid:qrcode" alt="qrcode" style="border-radius: 10px; width: 30%; margin: 5px 0;">
                    
                    <p style="margin: 5px 0; color: rgb(209, 209, 209);">
                        Číslo účtu:&nbsp;<strong style="color: white;">Neuvedeno</strong>
                    </p>
                    <p style="margin: 5px 0; color: rgb(209, 209, 209);">
                        Variabilní symbol:&nbsp;<strong style="color: white;">${qrData?.variableSymbol || 'Neuvedeno'}</strong>
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    
        


  
    let qrFilePath: string | undefined;
    let qrCid: string | undefined;
    if (qrData) {
      const tempPath = path.join(__dirname, 'tempQRCode.png');
      await QRCode.toFile(tempPath, qrData.paymentInfo);
      qrFilePath = tempPath;
      qrCid = 'qrcode';
    }
  
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: sanitizedTo,
      subject: sanitizedSubject,
      text: sanitizedText,
      html: htmlContent,
      attachments: qrFilePath
        ? [
            {
              filename: 'paymentQRCode.png',
              path: qrFilePath,
              cid: qrCid,
            },
          ]
        : [],
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  };
  

export default sendEmail;
