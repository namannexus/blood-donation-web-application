import nodemailer from 'nodemailer'
export default async function sendNotification(donor, recipient){
  const to = donor.email || null
  if(!to) return
  const from = process.env.FROM_EMAIL || 'naman25100@iiitnr.edu.in'
  const text = `Urgent Blood required ${donor.name}. Please come fast at ${recipient.city || 'the specified location'}`
  const html = `<p>${text}</p>`

  // Build transporter from environment with multiple options
  let transporter
  if(process.env.SMTP_URL){
    transporter = nodemailer.createTransport(process.env.SMTP_URL)
  } else if(process.env.SMTP_SERVICE){
    transporter = nodemailer.createTransport({ service: process.env.SMTP_SERVICE, auth:{ user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
  } else if(process.env.SMTP_HOST){
    const port = Number(process.env.SMTP_PORT) || 587
    transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port===465, auth:{ user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, tls:{ rejectUnauthorized:false } })
  } else {
    throw new Error('Email transport not configured (set SMTP_URL or SMTP_HOST)')
  }

  await transporter.sendMail({ from, to, subject: 'Urgent Blood required', text, html })
}
