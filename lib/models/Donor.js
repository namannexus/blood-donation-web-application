import mongoose from 'mongoose'
const DonorSchema = new mongoose.Schema({ name:String, email:String, phone:String, bloodType:String, city:String, unitsAvailable:{type:Number,default:1}, createdAt:{type:Date,default:Date.now} })
export default mongoose.models.Donor || mongoose.model('Donor', DonorSchema)
