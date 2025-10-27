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
    const matched = await Donor.find(query).limit(50).lean()
    if(matched.length){
      for(const d of matched){ try{ await sendNotification(d, recipient) } catch(e){ console.warn('notify fail', e.message) } }
    }
    res.status(200).json({ message: 'Recipient recorded', matched })
  }catch(e){
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
}
