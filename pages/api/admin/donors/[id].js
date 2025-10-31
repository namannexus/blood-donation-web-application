import { connectToDatabase } from '../../../../lib/mongodb'
import Donor from '../../../../lib/models/Donor'

export default async function handler(req, res){
  const adminPass = req.headers['x-admin-pass'] || ''
  const expected = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''
  if(!expected || adminPass !== expected) return res.status(401).json({ message: 'Unauthorized' })
  const { id } = req.query
  try{
    await connectToDatabase()
    if(req.method === 'PUT'){
      const body = req.body || {}
      const update = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        bloodType: body.bloodType,
        city: body.city,
        unitsAvailable: body.unitsAvailable
      }
      const donor = await Donor.findByIdAndUpdate(id, update, { new: true })
      return res.status(200).json({ donor })
    }
    if(req.method === 'DELETE'){
      await Donor.findByIdAndDelete(id)
      return res.status(200).json({ ok:true })
    }
    return res.status(405).json({ message:'Method not allowed' })
  }catch(e){
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
}