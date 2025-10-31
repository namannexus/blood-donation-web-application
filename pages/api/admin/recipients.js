import { connectToDatabase } from '../../../lib/mongodb'
import Recipient from '../../../lib/models/Recipient'

export default async function handler(req,res){
  const adminPass = req.headers['x-admin-pass'] || ''
  const expected = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''
  if(!expected || adminPass !== expected) return res.status(401).json({ message: 'Unauthorized' })
  try{
    await connectToDatabase()
    if(req.method === 'GET'){
      const recipients = await Recipient.find({}).sort({ createdAt:-1 }).lean()
      return res.status(200).json({ recipients })
    }
    if(req.method === 'POST'){
      const b = req.body || {}
      const r = await Recipient.create({ name:b.name, phone:b.phone, email:b.email, requiredBloodType:b.requiredBloodType, unitsNeeded:b.unitsNeeded||1, city:b.city, status:b.status||'open' })
      return res.status(201).json({ recipient:r })
    }
    return res.status(405).json({ message:'Method not allowed' })
  }catch(e){
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
}