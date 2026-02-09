import { Resend } from 'resend'
import { ApiError } from './ApiError.utils.js'

const resend_Api_Key = process.env.RESEND_API_KEY
console.log(resend_Api_Key)

// 1. Initialize the Resend Client once
const resend = new Resend(resend_Api_Key)

/**
 * Standard Utility to send emails via Resend
 * @param {string} to - The recipient's email address
 * @param {string} subject - The email subject line
 * @param {string} htmlContent - The HTML body of the email
 * @returns {Promise<Object>} - The Resend API response (contains messageId)
 */

// endpoint is 
// no-reply for otp
// security for security services 
// support for support
// finance for finance

export const sendEmail = async ({ to, subject, htmlContent, endpoint }) => {

    try {

        // 2. The API Call
        const data = await resend.emails.send({
            from: `ReviClash <${endpoint}@reviclash.com>`, // MUST match your verified domain
            to: [to], // Resend expects an array
            subject: subject,
            html: htmlContent,
        });

        // 3. Vendor-Specific Error Handling
        // Resend returns 200 even for some logical errors, but puts error details in data.error
        if (data.error) {
            console.error("❌ Resend API Error:", data.error);
            // Throw a clean 500 error to your frontend
            throw new ApiError(500, "Failed to deliver email."); 
        }

        // 4. Success Log (Good for debugging in Vercel logs)
        console.log(`✅ Email sent successfully to ${to}. Message ID: ${data.data.id}`);
        
        return data;

    } catch (error) {

        // 5. Catch Network/System Errors
        console.error("❌ Email Service System Error:", error);
        
        // If it's already an ApiError (thrown above), rethrow it.
        // Otherwise, wrap it in a generic 500.
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Email service is currently unavailable.");
    }
}