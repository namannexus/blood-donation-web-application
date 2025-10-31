import Layout from '../components/Layout'
import { useState } from 'react'

function ActionBtn({ children, onClick, kind='primary' }){
  const base = 'px-3 py-1 text-sm rounded-md border'
  const cls = kind==='danger' ? `${base} border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20` : `${base} border-gray-300 dark:border-white/10 hover:bg-gray-50/50 dark:hover:bg-white/5`
  return <button onClick={onClick} className={cls}>{children}</button>
}

function DonorRow({ d, token, onChange, onDelete }){
  const [edit, setEdit] = useState(false)
  const [row, setRow] = useState({ ...d })
  async function save(){
    const res = await fetch(`/api/admin/donors/${d._id}`, { method:'PUT', headers:{ 'Content-Type':'application/json', 'x-admin-pass': token }, body: JSON.stringify({ name:row.name, email:row.email, phone:row.phone, bloodType:row.bloodType, city:row.city, unitsAvailable: row.unitsAvailable }) })
    const js = await res.json(); if(res.ok){ onChange(js.donor); setEdit(false) }
  }
  async function del(){
    const res = await fetch(`/api/admin/donors/${d._id}`, { method:'DELETE', headers:{ 'x-admin-pass': token } })
    if(res.ok) onDelete(d._id)
  }
  return (
    <tr className='border-t border-white/60 dark:border-white/10 text-gray-900 dark:text-white'>
      <td className='px-4 py-2'>{edit ? <input value={row.name||''} onChange={e=>setRow({...row,name:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'/> : d.name}</td>
      <td className='px-4 py-2'>{edit ? <input value={row.bloodType||''} onChange={e=>setRow({...row,bloodType:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'/> : d.bloodType}</td>
      <td className='px-4 py-2'>{edit ? <input value={row.phone||''} onChange={e=>setRow({...row,phone:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'/> : d.phone}</td>
      <td className='px-4 py-2'>{edit ? <input value={row.email||''} onChange={e=>setRow({...row,email:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'/> : (d.email||'')}</td>
      <td className='px-4 py-2'>{edit ? <input value={row.city||''} onChange={e=>setRow({...row,city:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'/> : (d.city||'')}</td>
      <td className='px-4 py-2 space-x-2'>
        {edit ? (
          <>
            <ActionBtn onClick={save}>Save</ActionBtn>
            <ActionBtn onClick={()=>{ setRow(d); setEdit(false) }}>Cancel</ActionBtn>
          </>
        ) : (
          <>
            <ActionBtn onClick={()=>setEdit(true)}>Edit</ActionBtn>
            <ActionBtn kind='danger' onClick={del}>Delete</ActionBtn>
          </>
        )}
      </td>
    </tr>
  )
}

function AddDonor({ onAdded, token }){
  const [v,setV] = useState({ name:'', bloodType:'A+', phone:'', email:'', city:'' })
  async function add(){
    const res = await fetch('/api/admin/donors', { method:'POST', headers:{ 'Content-Type':'application/json', 'x-admin-pass': token }, body: JSON.stringify(v) })
    const js = await res.json(); if(res.ok){ onAdded(js.donor); setV({ name:'', bloodType:'A+', phone:'', email:'', city:'' }) }
  }
  return (
    <div className='flex flex-wrap gap-2 items-center'>
      <input value={v.name} onChange={e=>setV({...v,name:e.target.value})} placeholder='Name' className='px-2 py-1 rounded border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5'/>
      <input value={v.bloodType} onChange={e=>setV({...v,bloodType:e.target.value})} placeholder='Blood' className='px-2 py-1 rounded border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 w-20'/>
      <input value={v.phone} onChange={e=>setV({...v,phone:e.target.value})} placeholder='Phone' className='px-2 py-1 rounded border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5'/>
      <input value={v.email} onChange={e=>setV({...v,email:e.target.value})} placeholder='Email' className='px-2 py-1 rounded border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5'/>
      <input value={v.city} onChange={e=>setV({...v,city:e.target.value})} placeholder='City' className='px-2 py-1 rounded border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5'/>
      <ActionBtn onClick={add}>Add</ActionBtn>
    </div>
  )
}

function RecipientRow({ r, token, onChange, onDelete }){
  const [edit, setEdit] = useState(false)
  const [row, setRow] = useState({ ...r })
  async function save(){
    const res = await fetch(`/api/admin/recipients/${r._id}`, { method:'PUT', headers:{ 'Content-Type':'application/json', 'x-admin-pass': token }, body: JSON.stringify({ name:row.name, email:row.email, phone:row.phone, requiredBloodType:row.requiredBloodType, unitsNeeded: row.unitsNeeded, city:row.city, status:row.status }) })
    const js = await res.json(); if(res.ok){ onChange(js.recipient); setEdit(false) }
  }
  async function del(){ const res = await fetch(`/api/admin/recipients/${r._id}`, { method:'DELETE', headers:{ 'x-admin-pass': token } }); if(res.ok) onDelete(r._id) }
  return (
    <tr className='border-t border-white/60 dark:border-white/10 text-gray-900 dark:text-white'>
      <td className='px-4 py-2'>{edit ? <input value={row.name||''} onChange={e=>setRow({...row,name:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'/> : r.name}</td>
      <td className='px-4 py-2'>{edit ? <input value={row.requiredBloodType||''} onChange={e=>setRow({...row,requiredBloodType:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'/> : r.requiredBloodType}</td>
      <td className='px-4 py-2'>{edit ? <input type='number' value={row.unitsNeeded||1} onChange={e=>setRow({...row,unitsNeeded:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10 w-20'/> : r.unitsNeeded}</td>
      <td className='px-4 py-2'>{edit ? <input value={row.phone||''} onChange={e=>setRow({...row,phone:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'/> : (r.phone||'')}</td>
      <td className='px-4 py-2'>{edit ? <input value={row.email||''} onChange={e=>setRow({...row,email:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'/> : (r.email||'')}</td>
      <td className='px-4 py-2'>{edit ? <input value={row.city||''} onChange={e=>setRow({...row,city:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'/> : (r.city||'')}</td>
      <td className='px-4 py-2'>{edit ? 
        <select value={row.status||'open'} onChange={e=>setRow({...row,status:e.target.value})} className='p-1 rounded bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10'>
          <option value='open'>open</option>
          <option value='fulfilled'>fulfilled</option>
          <option value='closed'>closed</option>
        </select> : (r.status||'open')}</td>
      <td className='px-4 py-2 space-x-2'>
        {edit ? (
          <>
            <ActionBtn onClick={save}>Save</ActionBtn>
            <ActionBtn onClick={()=>{ setRow(r); setEdit(false) }}>Cancel</ActionBtn>
          </>
        ) : (
          <>
            <ActionBtn onClick={()=>setEdit(true)}>Edit</ActionBtn>
            <ActionBtn kind='danger' onClick={del}>Delete</ActionBtn>
          </>
        )}
      </td>
    </tr>
  )
}

export default function Admin(){
  const [pass, setPass] = useState('')
  const [auth, setAuth] = useState(false)
  const [donors, setDonors] = useState([])
  const [recipients, setRecipients] = useState([])
  const [error, setError] = useState('')
  const [token, setToken] = useState('') // store the valid admin password for subsequent calls
  const [tab, setTab] = useState('donors')

  async function login(e){
    e.preventDefault()
    setError('')
    const ok = await fetchDonors(pass)
    if(ok){ setAuth(true); setToken(pass); fetchRecipients(pass) } else { setError('Incorrect password') }
  }

  async function fetchDonors(p){
    try{
      const res = await fetch('/api/admin/donors', { headers: { 'x-admin-pass': p || token || '' } })
      if(!res.ok){ return false }
      const js = await res.json()
      setDonors(js.donors || [])
      return true
    }catch(e){
      return false
    }
  }
  async function fetchRecipients(p){
    try{
      const res = await fetch('/api/admin/recipients', { headers: { 'x-admin-pass': p || token || '' } })
      if(!res.ok){ return }
      const js = await res.json()
      setRecipients(js.recipients || [])
    }catch(e){}
  }

  if(!auth){
    return (
      <Layout>
        <div className='max-w-sm mx-auto mt-6 p-6 bg-white/80 dark:bg-gray-900/70 rounded-2xl shadow-neomorph border border-white/60 dark:border-white/10'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>Admin Login</h2>
          <form onSubmit={login} className='mt-4 grid gap-4'>
            <input type='password' value={pass} onChange={(e)=>setPass(e.target.value)} placeholder='Admin password' className='p-3 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-900 dark:text-white' />
            <button className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow'>Login</button>
            {error && <div className='text-sm text-red-600'>{error}</div>}
          </form>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className='mt-4 space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Admin Dashboard</h2>
          <div className='flex items-center gap-2'>
            <button onClick={()=>{fetchDonors(); fetchRecipients()}} className='px-3 py-1 text-sm border border-gray-300 dark:border-white/10 rounded-md hover:bg-gray-50/50 dark:hover:bg-white/5'>Refresh</button>
            <div className='ml-2 rounded-md overflow-hidden border border-white/60 dark:border-white/10'>
              <button onClick={()=>setTab('donors')} className={`px-3 py-1 text-sm ${tab==='donors'?'bg-red-600 text-white':'bg-white/60 dark:bg-white/5'}`}>Donors</button>
              <button onClick={()=>setTab('recipients')} className={`px-3 py-1 text-sm ${tab==='recipients'?'bg-red-600 text-white':'bg-white/60 dark:bg-white/5'}`}>Recipients</button>
            </div>
          </div>
        </div>

        {tab==='donors' && (
          <div className='rounded-2xl overflow-hidden border border-white/60 dark:border-white/10 bg-white/80 dark:bg-gray-900/70 shadow-neomorph'>
            <div className='px-4 py-3 font-semibold border-b border-white/60 dark:border-white/10 flex items-center justify-between'>
              <span>Donors</span>
              <AddDonor onAdded={(d)=>setDonors([d,...donors])} token={token} />
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full text-sm'>
                <thead className='bg-white/60 dark:bg-white/5'>
                  <tr className='text-left'>
                    <th className='px-4 py-2'>Name</th>
                    <th className='px-4 py-2'>Blood Type</th>
                    <th className='px-4 py-2'>Phone</th>
                    <th className='px-4 py-2'>Email</th>
                    <th className='px-4 py-2'>City</th>
                    <th className='px-4 py-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map(d => (
                    <DonorRow key={d._id} d={d} token={token} onChange={(nd)=>setDonors(donors.map(x=>x._id===nd._id?nd:x))} onDelete={(id)=>setDonors(donors.filter(x=>x._id!==id))} />
                  ))}
                </tbody>
              </table>
            </div>
            {!donors.length && <div className='px-4 py-6 text-gray-600'>No donors</div>}
          </div>
        )}

        {tab==='recipients' && (
          <div className='rounded-2xl overflow-hidden border border-white/60 dark:border-white/10 bg-white/80 dark:bg-gray-900/70 shadow-neomorph'>
            <div className='px-4 py-3 font-semibold border-b border-white/60 dark:border-white/10'>Recipients</div>
            <div className='overflow-x-auto'>
              <table className='min-w-full text-sm'>
                <thead className='bg-white/60 dark:bg-white/5'>
                  <tr className='text-left'>
                    <th className='px-4 py-2'>Name</th>
                    <th className='px-4 py-2'>Blood Type</th>
                    <th className='px-4 py-2'>Units</th>
                    <th className='px-4 py-2'>Phone</th>
                    <th className='px-4 py-2'>Email</th>
                    <th className='px-4 py-2'>City</th>
                    <th className='px-4 py-2'>Status</th>
                    <th className='px-4 py-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.map(r => (
                    <RecipientRow key={r._id} r={r} token={token} onChange={(nr)=>setRecipients(recipients.map(x=>x._id===nr._id?nr:x))} onDelete={(id)=>setRecipients(recipients.filter(x=>x._id!==id))} />
                  ))}
                </tbody>
              </table>
            </div>
            {!recipients.length && <div className='px-4 py-6 text-gray-600'>No recipients</div>}
          </div>
        )}
      </div>
    </Layout>
  )
}
