import { connectToDatabase } from '../../lib/mongodb'
import Donor from '../../lib/models/Donor'

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({ message:'Method not allowed' })
  try{
    await connectToDatabase()
    const body = req.body
    const donor = new Donor({ name: body.name, phone: body.phone, email: body.email, bloodType: body.bloodType, city: body.city })
    await donor.save()
    res.status(200).json({ message: 'Donor registered', donor })
  }catch(e){
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
}
