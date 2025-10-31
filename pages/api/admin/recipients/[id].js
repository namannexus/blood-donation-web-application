import { connectToDatabase } from '../../../../lib/mongodb'
import Recipient from '../../../../lib/models/Recipient'

export default async function handler(req, res){
  const adminPass = req.headers['x-admin-pass'] || ''
  const expected = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''
  if(!expected || adminPass !== expected) return res.status(401).json({ message: 'Unauthorized' })
  const { id } = req.query
  try{
    await connectToDatabase()
    if(req.method === 'PUT'){
      const b = req.body || {}
      const u = { name:b.name, phone:b.phone, email:b.email, requiredBloodType:b.requiredBloodType, unitsNeeded:b.unitsNeeded, city:b.city, status:b.status }
      const rec = await Recipient.findByIdAndUpdate(id, u, { new:true })
      return res.status(200).json({ recipient:rec })
    }
    if(req.method === 'DELETE'){
      await Recipient.findByIdAndDelete(id)
      return res.status(200).json({ ok:true })
    }
    return res.status(405).json({ message:'Method not allowed' })
  }catch(e){
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
}