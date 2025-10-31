import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Request() {
  const [form, setForm] = useState({ name:'', bloodType:'A+', location:'', details:'', email:'', contact:'', units:1 })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [matched, setMatched] = useState([])

  async function submit(){
    if(!form.name || !form.location){ setStatus('error'); setMessage('Please fill name and location.'); return }
    if(!form.contact && !form.email){ setStatus('error'); setMessage('Provide phone or email.'); return }
    try{
      setLoading(true); setMessage(''); setStatus('')
      const phone = form.contact || ''
      const email = form.email || ''
      const res = await fetch('/api/addRecipient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone, email, requiredBloodType: form.bloodType, unitsNeeded: Number(form.units)||1, city: form.location, details: form.details })
      })
      const js = await res.json().catch(()=>({}))
      if(!res.ok) throw new Error(js.message || 'Failed to post request')
      setMatched(js.matched || [])
      setStatus('success'); setMessage('Request posted successfully!')
      // Keep the location in place so the map centers on it
      setForm({ name:'', bloodType: form.bloodType, location: form.location, details:'', contact:'', units:1 })
    }catch(e){
      setStatus('error'); setMessage(e.message || 'Something went wrong')
    }finally{
      setLoading(false)
    }
  }

  return (
    <Layout>
      <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className='max-w-2xl mx-auto p-6 bg-white/80 dark:bg-gray-900/70 rounded-2xl shadow-neomorph border border-white/60 dark:border-white/10'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Request Blood</h1>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>Post a request and we'll suggest matching donors nearby.</p>

        <form className='mt-6 grid gap-5' onSubmit={(e)=>{e.preventDefault(); submit()}}>
          <label className='grid gap-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Patient / Contact name</span>
            <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder='e.g., Rohan Gupta' className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/60' />
          </label>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <label className='grid gap-2'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Blood Type</span>
              <select value={form.bloodType} onChange={(e)=>setForm({...form,bloodType:e.target.value})} className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white'>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>
            </label>
            <label className='grid gap-2'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Units needed</span>
              <input type='number' min='1' value={form.units} onChange={(e)=>setForm({...form,units:e.target.value})} className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white' />
            </label>
          </div>
          <label className='grid gap-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Location</span>
            <input value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} placeholder='City, Hospital' className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/60' />
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
          <label className='grid gap-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Additional details</span>
            <textarea value={form.details} onChange={(e)=>setForm({...form,details:e.target.value})} placeholder='Urgency, timing, other info' className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 min-h-[120px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/60' />
          </label>
          <div className='flex gap-3'>
            <button type='submit' disabled={loading} className='px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-md shadow'>{loading ? 'Posting...' : 'Post Request'}</button>
            <button type='button' className='px-4 py-2 border border-gray-300 dark:border-white/10 rounded-md hover:bg-gray-50/50 dark:hover:bg-white/5' onClick={()=>setForm({name:'',bloodType:'A+',location:'',details:'',contact:'',units:1})}>Reset</button>
          </div>
          {message && <div className={`text-sm mt-1 ${status==='success' ? 'text-green-600':'text-red-600'}`}>{message}</div>}
        </form>
        {status==='success' && ( 
          <div className='mt-6'>
            <div className='text-sm text-gray-700 dark:text-gray-300 mb-2'>Nearest donors on map</div>
            <div className='w-full overflow-hidden rounded-xl border border-white/60 dark:border-white/10 depth-shadow'>
              <iframe
                title='Nearest donors'
                src={`https://www.google.com/maps?q=${encodeURIComponent(matched.filter(d=>d.city).slice(0,3).map(d=>d.city).join(' or ') || ('blood donor near ' + form.location))}&output=embed`}
                width='100%'
                height='380'
                style={{ border: 0 }}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  )
}
