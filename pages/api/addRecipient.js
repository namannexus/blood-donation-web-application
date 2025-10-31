import { connectToDatabase } from '../../lib/mongodb'
import Recipient from '../../lib/models/Recipient'
import Donor from '../../lib/models/Donor'
import sendNotification from '../../lib/sendNotification'

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({ message:'Method not allowed' })
  try{
    await connectToDatabase()
    const body = req.body
    const recipient = new Recipient({ name: body.name, phone: body.phone, email: body.email, requiredBloodType: body.requiredBloodType, unitsNeeded: body.unitsNeeded || 1, city: body.city })
    await recipient.save()
    const query = { bloodType: recipient.requiredBloodType }
    if(recipient.city) query.city = recipient.city
    // Prefer donors with email so we can notify
    let matched = await Donor.find(query).sort({ createdAt:-1 }).limit(100).lean()
    let withEmail = matched.filter(d=>d.email)
    // Fallback: if no same-city donors with email, broaden to blood type only
    if(withEmail.length === 0 && recipient.city){
      const broad = await Donor.find({ bloodType: recipient.requiredBloodType }).sort({ createdAt:-1 }).limit(100).lean()
      if(broad.length) { matched = broad; withEmail = broad.filter(d=>d.email) }
    }
    let notified = []
    if(withEmail.length){
      const results = await Promise.allSettled(withEmail.map(d=>sendNotification(d, recipient)))
      notified = withEmail.filter((_,i)=>results[i].status==='fulfilled').map(d=>({ _id:d._id, email:d.email }))
    }
    res.status(200).json({ message: 'Recipient recorded', matched, notified })
  }catch(e){
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
}
