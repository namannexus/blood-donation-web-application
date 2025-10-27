import Layout from '../components/Layout'
import { useState } from 'react'

export default function Request(){
  const [result, setResult] = useState(null)
  async function onSubmit(e){
    e.preventDefault()
    setResult('Searching...')
    const fd = Object.fromEntries(new FormData(e.target))
    const res = await fetch('/api/addRecipient', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(fd) })
    const js = await res.json()
    setResult(js)
  }
  return (
    <Layout>
      <h2 className='text-2xl font-semibold'>Request Blood</h2>
      <form onSubmit={onSubmit} className='mt-4 space-y-3 max-w-md'>
        <input name='name' placeholder='Patient name' required className='w-full p-2 border rounded' />
        <input name='phone' placeholder='Phone' required className='w-full p-2 border rounded' />
        <input name='email' placeholder='Email (optional)' className='w-full p-2 border rounded' />
        <select name='requiredBloodType' required className='w-full p-2 border rounded'>
          <option value=''>Select blood type</option>
          <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
        </select>
        <input name='unitsNeeded' type='number' defaultValue={1} className='w-full p-2 border rounded' />
        <input name='city' placeholder='City' className='w-full p-2 border rounded' />
        <div><button className='px-4 py-2 bg-red-600 text-white rounded'>Request & Match</button></div>
      </form>

      {result && (
        <div className='mt-6'>
          <h3 className='font-semibold'>Matches</h3>
          {Array.isArray(result.matched) ? (result.matched.length ? result.matched.map(d=>(
            <div key={d._id} className='p-2 border-b'>{d.name} — {d.bloodType} — {d.phone} {d.city ? ` — ${d.city}` : ''}</div>
          )) : <div className='text-gray-600'>No matches found</div>) : <pre>{JSON.stringify(result,null,2)}</pre>}
        </div>
      )}
    </Layout>
  )
}
