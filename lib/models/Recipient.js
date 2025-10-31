import mongoose from 'mongoose'
const RecipientSchema = new mongoose.Schema({ name:String, phone:String, email:String, requiredBloodType:String, unitsNeeded:{type:Number,default:1}, city:String, status:{type:String, default:'open'}, createdAt:{type:Date,default:Date.now} })
export default mongoose.models.Recipient || mongoose.model('Recipient', RecipientSchema)
