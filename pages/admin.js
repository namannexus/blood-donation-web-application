import Layout from '../components/Layout'
import { useState } from 'react'

export default function Admin(){
  const [pass, setPass] = useState('')
  const [auth, setAuth] = useState(false)
  const [donors, setDonors] = useState([])

  async function login(e){
    e.preventDefault()
    if(pass === process.env.NEXT_PUBLIC_ADMIN_PASSWORD){
      setAuth(true)
      fetchDonors()
    } else {
      alert('Incorrect password')
    }
  }

  async function fetchDonors(){
    const res = await fetch('/api/admin/donors', { headers: { 'x-admin-pass': process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '' } })
    const js = await res.json()
    setDonors(js.donors || [])
  }

  if(!auth){
    return (
      <Layout>
        <h2 className='text-2xl font-semibold'>Admin Login</h2>
        <form onSubmit={login} className='mt-4'>
          <input type='password' value={pass} onChange={(e)=>setPass(e.target.value)} placeholder='Admin password' className='p-2 border rounded' />
          <div className='mt-2'><button className='px-4 py-2 bg-red-600 text-white rounded'>Login</button></div>
        </form>
      </Layout>
    )
  }

  return (
    <Layout>
      <h2 className='text-2xl font-semibold'>Admin Dashboard</h2>
      <div className='mt-4'>
        <h3 className='font-semibold'>Donors</h3>
        {donors.length ? donors.map(d=>(<div key={d._id} className='p-2 border-b'>{d.name} — {d.bloodType} — {d.phone}</div>)) : <div className='text-gray-600'>No donors</div>}
      </div>
    </Layout>
  )
}
