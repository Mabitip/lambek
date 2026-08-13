import nodemailer from "nodemailer";
import { DEFAULT_CONTACT } from "@/lib/constants/contact";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

async function sendEmail(payload: EmailPayload) {
  const transporter = getTransporter();
  const contactEmail = process.env.CONTACT_EMAIL ?? DEFAULT_CONTACT.primaryEmail;

  if (!transporter) {
    console.log("[Email - dev mode]", payload.subject, payload.text ?? payload.html);
    return { success: true, mode: "console" as const };
  }

  await transporter.sendMail({
    from: process.env.SMTP_USER ?? contactEmail,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });

  return { success: true, mode: "smtp" as const };
}

export const emailService = {
  async sendInquiryNotification(inquiry: {
    fullName: string;
    email: string;
    company?: string | null;
    requestType: string;
    message?: string | null;
  }) {
    const contactEmail = process.env.CONTACT_EMAIL ?? DEFAULT_CONTACT.primaryEmail;
    return sendEmail({
      to: contactEmail,
      subject: `New Coffee Inquiry from ${inquiry.fullName}`,
      html: `
        <h2>New Coffee Inquiry</h2>
        <p><strong>Name:</strong> ${inquiry.fullName}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Company:</strong> ${inquiry.company ?? "N/A"}</p>
        <p><strong>Type:</strong> ${inquiry.requestType}</p>
        <p><strong>Message:</strong> ${inquiry.message ?? "N/A"}</p>
      `,
      text: `New inquiry from ${inquiry.fullName} (${inquiry.email})`,
    });
  },

  async sendSampleNotification(sample: {
    name: string;
    email: string;
    company: string;
    message?: string | null;
  }) {
    const contactEmail = process.env.CONTACT_EMAIL ?? DEFAULT_CONTACT.primaryEmail;
    return sendEmail({
      to: contactEmail,
      subject: `New Sample Request from ${sample.company}`,
      html: `
        <h2>New Sample Request</h2>
        <p><strong>Name:</strong> ${sample.name}</p>
        <p><strong>Email:</strong> ${sample.email}</p>
        <p><strong>Company:</strong> ${sample.company}</p>
        <p><strong>Message:</strong> ${sample.message ?? "N/A"}</p>
      `,
    });
  },

  async sendContactNotification(message: {
    name: string;
    email: string;
    subject?: string | null;
    message: string;
  }) {
    const contactEmail = process.env.CONTACT_EMAIL ?? DEFAULT_CONTACT.primaryEmail;
    return sendEmail({
      to: contactEmail,
      subject: `Contact: ${message.subject ?? "New Message"}`,
      html: `
        <h2>Contact Message</h2>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p>${message.message}</p>
      `,
    });
  },
};
