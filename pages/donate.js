import Layout from '../components/Layout'
import { useState } from 'react'

export default function Donate(){
  const [status, setStatus] = useState('')
  async function onSubmit(e){
    e.preventDefault()
    const body = Object.fromEntries(new FormData(e.target))
    setStatus('Submitting...')
    const res = await fetch('/api/addDonor', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(body) })
    const js = await res.json()
    setStatus(js.message || 'Done')
    e.target.reset()
  }
  return (
    <Layout>
      <h2 className='text-2xl font-semibold'>Register as Donor</h2>
      <form onSubmit={onSubmit} className='mt-4 space-y-3 max-w-md'>
        <input name='name' placeholder='Full name' required className='w-full p-2 border rounded' />
        <input name='phone' placeholder='Phone' required className='w-full p-2 border rounded' />
        <input name='email' placeholder='Email (optional)' className='w-full p-2 border rounded' />
        <select name='bloodType' required className='w-full p-2 border rounded'>
          <option value=''>Select blood type</option>
          <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
        </select>
        <input name='city' placeholder='City' className='w-full p-2 border rounded' />
        <div className='flex gap-2'>
          <button className='px-4 py-2 bg-red-600 text-white rounded'>Register</button>
          <div className='text-gray-600'>{status}</div>
        </div>
      </form>
    </Layout>
  )
}
