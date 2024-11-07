import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

export const sendEmail = async (session: { customer_email: string; customer_details: { name: string }; id: string; flight_details: { flight_number: string, departure: string, destination: string, date: string, time: string }; amount_total: number }) => {
    try {
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: session.customer_email,
            subject: `Flight Booking Confirmation - Zkare Airline`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h1 style="color: #4CAF50; text-align: center;">Flight Booking Confirmed</h1>
                    <p>Dear <strong>${session.customer_details.name || 'test'}</strong>,</p>
                    <p>We are pleased to confirm your flight booking with Zkare Airline. Below are your booking details:</p>
                    
                    <div style="border-top: 1px solid #ddd; margin: 20px 0;"></div>
                    
                    <h3 style="color: #333;">Flight Information</h3>
                    <p><strong>Flight Number:</strong> ${session.flight_details.flight_number || 'test'}</p>
                    <p><strong>Departure:</strong> ${session.flight_details.departure || 'test'}</p>
                    <p><strong>Destination:</strong> ${session.flight_details.destination || 'test'}</p>
                    <p><strong>Date:</strong> ${session.flight_details.date || 'test'}</p>
                    <p><strong>Time:</strong> ${session.flight_details.time || 'test'}</p>
                    
                    <div style="border-top: 1px solid #ddd; margin: 20px 0;"></div>

                    <h3 style="color: #333;">Payment Information</h3>
                    <p><strong>Order Number:</strong> ${session.id || 'test'}</p>
                    <p><strong>Total Amount Paid:</strong> $${(session.amount_total / 100).toFixed(2) || 'test'}</p>
                    
                    <div style="border-top: 1px solid #ddd; margin: 20px 0;"></div>

                    <p>We will notify you once your boarding pass is available. If you have any questions, please reply to this email or contact our support team.</p>

                    <p>Thank you for choosing Zkare Airline. We wish you a pleasant journey!</p>
                    
                    <p style="text-align: center; color: #777;">Best regards,<br/>The Zkare Team</p>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', result);
    } catch (err) {
        throw err;
    }
};
