import { connectToDatabase } from '../../../lib/mongodb'
import Donor from '../../../lib/models/Donor'

export default async function handler(req,res){
  const adminPass = req.headers['x-admin-pass'] || ''
  if(adminPass !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: 'Unauthorized' })
  try{
    await connectToDatabase()
    const donors = await Donor.find({}).sort({ createdAt:-1 }).lean()
    res.status(200).json({ donors })
  }catch(e){
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
}
