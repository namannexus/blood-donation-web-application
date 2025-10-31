import { connectToDatabase } from '../../lib/mongodb'
import Donor from '../../lib/models/Donor'
import Recipient from '../../lib/models/Recipient'

export default async function handler(req, res) {
  try{
    await connectToDatabase()
    const [donors, requests] = await Promise.all([
      Donor.countDocuments({}),
      Recipient.countDocuments({})
    ])
    const unitsAgg = await Recipient.aggregate([{ $group: { _id: null, units: { $sum: '$unitsNeeded' } } }])
    const livesSaved = (unitsAgg && unitsAgg[0] && unitsAgg[0].units) ? unitsAgg[0].units : requests
    const requestsFulfilled = await Recipient.countDocuments({ status: 'fulfilled' })
    const bloodBanksConnected = parseInt(process.env.BLOOD_BANKS_CONNECTED || '0', 10)

    res.status(200).json({ donors, requestsFulfilled, livesSaved, bloodBanksConnected })
  }catch(e){
    console.error(e)
    res.status(200).json({ donors: 0, requestsFulfilled: 0, livesSaved: 0, bloodBanksConnected: parseInt(process.env.BLOOD_BANKS_CONNECTED || '0', 10) })
  }
}