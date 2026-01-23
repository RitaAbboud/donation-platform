"use server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReservationEmail(ownerEmail, itemName) {
  try {
    await resend.emails.send({
      from: 'Marketplace <notifications@yourdomain.com>', // Use verified domain or 'onboarding@resend.dev' for testing
      to: ownerEmail,
      subject: `Item Secured: ${itemName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Great news!</h2>
          <p>Your item <strong>"${itemName}"</strong> has been reserved by a buyer.</p>
          <p>Check your dashboard for details.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Resend Error:", error);
    return { success: false };
  }
}