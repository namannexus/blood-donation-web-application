import nodemailer from 'nodemailer'
export default async function sendNotification(donor, recipient){
  if(!process.env.SMTP_HOST) return
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587, auth:{ user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
  const to = donor.email || recipient.email || null
  if(!to) return
  const html = `<p>Hi ${donor.name},</p><p>A recipient nearby needs blood type <strong>${recipient.requiredBloodType}</strong> in ${recipient.city || 'your area'}. Contact: ${recipient.phone}</p><p>— Blood Donation Website</p>`
  await transporter.sendMail({ from: process.env.FROM_EMAIL || process.env.SMTP_USER, to, subject:`Urgent: Blood needed (${recipient.requiredBloodType})`, html })
}
