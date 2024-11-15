import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

interface EmailSession {
    customer_email: string;
    customer_details: { 
        name: string 
    };
    id: string;
    flight_details: { 
        flight_come_number: string, 
        departure_come: string, 
        destination_come: string, 
        date_come: string, 
        time_come: string 

        flight_return_number: string,
        departure_return: string,
        destination_return: string,
        date_return: string,
        time_return: string

        passengers: number,
        type: 'roundTrip' | 'oneWay'
    };
    amount_total: number;
}

export const sendEmail = async (session: EmailSession) => {
    try {
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: session.customer_email,
            subject: `Flight Booking Confirmation - Zkare Airline`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Flight Booking Confirmation</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding: 40px 20px; text-align: center; background-color: #0056b3;">
                                <h1 style="color: #ffffff; margin: 0;">Flight Booking Confirmed</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px;">
                                <p>Dear <strong>${session.customer_details.name}</strong>,</p>
                                <p>We are pleased to confirm your flight booking with Zkare Airline. Below are your booking details:</p>
                                
                                <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
                                    <tr style="background-color: #e9ecef;">
                                        <th colspan="2" style="text-align: left; padding: 10px; border: 1px solid #dee2e6;">Outbound Flight Information</th>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Flight Number:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.flight_come_number || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Departure:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.departure_come || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Destination:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.destination_come || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Date:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.date_come || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Time:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.time_come || 'N/A'}</td>
                                    </tr>
                                </table>

                                ${session.flight_details.type === 'roundTrip' ? `
                                <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
                                    <tr style="background-color: #e9ecef;">
                                        <th colspan="2" style="text-align: left; padding: 10px; border: 1px solid #dee2e6;">Return Flight Information</th>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Flight Number:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.flight_return_number || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Departure:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.departure_return || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Destination:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.destination_return || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Date:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.date_return || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Time:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.time_return || 'N/A'}</td>
                                    </tr>
                                </table>
                                ` : ''}

                                <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
                                    <tr style="background-color: #e9ecef;">
                                        <th colspan="2" style="text-align: left; padding: 10px; border: 1px solid #dee2e6;">Booking Details</th>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Passengers:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.passengers}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Flight Type:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.flight_details.type === 'roundTrip' ? 'Round Trip' : 'One Way'}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Order Number:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">${session.id || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #dee2e6;"><strong>Total Amount Paid:</strong></td>
                                        <td style="border: 1px solid #dee2e6;">$${(session.amount_total / 100).toFixed(2) || 'N/A'}</td>
                                    </tr>
                                </table>

                                <p>We will notify you once your boarding pass is available. If you have any questions, please reply to this email or contact our support team.</p>

                                <p>Thank you for choosing Zkare Airline. We wish you a pleasant journey!</p>
                                
                                <p style="text-align: center; color: #777; margin-top: 30px;">Best regards,<br/>The Zkare Team</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #0056b3; color: #ffffff; text-align: center; padding: 20px;">
                                <p style="margin: 0;">&copy; 2024 Zkare Airline. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', result);
    } catch (err) {
        throw err;
    }
};