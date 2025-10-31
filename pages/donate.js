import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Donate() {
  const [form, setForm] = useState({ name:'', bloodType:'A+', email:'', contact:'', location:'' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('') // '', 'success', 'error'

  async function submit() {
    if(!form.name || !form.location) { setStatus('error'); setMessage('Please fill name and location.'); return }
    if(!form.contact && !form.email){ setStatus('error'); setMessage('Provide phone or email.'); return }
    try{
      setLoading(true); setMessage(''); setStatus('')
      const phone = form.contact || ''
      const email = form.email || ''
      const res = await fetch('/api/addDonor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, bloodType: form.bloodType, phone, email, city: form.location })
      })
      const js = await res.json()
      if(!res.ok) throw new Error(js.message || 'Failed')
      setStatus('success')
      setMessage('Registered successfully!')
      setForm({ name:'', bloodType:'A+', email:'', contact:'', location:'' })
    } catch(e){
      setStatus('error')
      setMessage(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className='max-w-2xl mx-auto p-6 bg-white/80 dark:bg-gray-900/70 rounded-2xl shadow-neomorph border border-white/60 dark:border-white/10'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Register as a Donor</h1>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>Fill the form and we'll match you to recipients nearby.</p>

        <form className='mt-6 grid gap-5' onSubmit={(e)=>{e.preventDefault(); submit()}}>
          <label className='grid gap-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Full name</span>
            <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder='e.g., Priya Sharma' className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/60' />
          </label>
          <label className='grid gap-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Blood Type</span>
            <select value={form.bloodType} onChange={(e)=>setForm({...form,bloodType:e.target.value})} className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white'>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
            </select>
          </label>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <label className='grid gap-2'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Email</span>
              <input type='email' value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder='you@example.com' className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/60' />
            </label>
            <label className='grid gap-2'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Phone</span>
              <input value={form.contact} onChange={(e)=>setForm({...form,contact:e.target.value})} placeholder='+91 90000 00000' className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/60' />
            </label>
          </div>
          <span className='text-xs text-gray-500'>We only share these when a compatible match is found.</span>
          <label className='grid gap-2 mt-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Location</span>
            <input value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} placeholder='City, Area' className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/60' />
          </label>
          <div className='flex gap-3'>
            <button type='submit' disabled={loading} className='px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-md shadow'>{loading ? 'Submitting...' : 'Register'}</button>
            <button type='button' className='px-4 py-2 border border-gray-300 dark:border-white/10 rounded-md hover:bg-gray-50/50 dark:hover:bg-white/5' onClick={()=>setForm({name:'',bloodType:'A+',email:'',contact:'',location:''})}>Reset</button>
          </div>
          {message && <div className={`text-sm mt-1 ${status==='success' ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
        </form>
      </motion.div>
    </Layout>
  )
}
