import Layout from '../components/Layout'
import Link from 'next/link'
import Hero from '../components/components'
import { useEffect, useState } from 'react'

function useCount(to, duration=1200){
  const [val, setVal] = useState(0)
  useEffect(()=>{
    let raf, start
    const from = 0
    const step = (ts)=>{
      if(!start) start = ts
      const p = Math.min(1, (ts-start)/duration)
      const eased = 1 - Math.pow(1-p, 3)
      setVal(Math.floor(from + (to-from)*eased))
      if(p<1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return ()=>cancelAnimationFrame(raf)
  },[to,duration])
  return val
}

export default function Home(){
  const [metrics, setMetrics] = useState({ livesSaved:0, donors:0, requestsFulfilled:0, bloodBanksConnected:0 })

  useEffect(()=>{
    fetch('/api/metrics').then(r=>r.json()).then(setMetrics).catch(()=>{})
  },[])

  const lives = useCount(metrics.livesSaved)
  const donors = useCount(metrics.donors)
  const fulfilled = useCount(metrics.requestsFulfilled)
  const banks = useCount(metrics.bloodBanksConnected)

  const pretty = (n)=>n.toLocaleString()

  return (
    <Layout>
      <div className='py-10 space-y-10'>
        <Hero />

        <section className='grid sm:grid-cols-2 md:grid-cols-4 gap-6'>
          {[{label:'Lives Saved', value: pretty(lives)},{label:'Active Donors', value: pretty(donors)},{label:'Requests Fulfilled', value: pretty(fulfilled)},{label:'Blood Banks Connected', value: pretty(banks)}].map((s,i)=> (
            <div key={i} className='rounded-2xl p-6 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-neomorph glass depth-shadow hover:translate-y-[-2px] transition-transform'>
              <div className='text-3xl font-extrabold text-red-600 drop-shadow-neon'>{s.value}</div>
              <div className='mt-1 text-sm text-gray-700 dark:text-gray-300'>{s.label}</div>
            </div>
          ))}
        </section>

        <section className='grid md:grid-cols-3 gap-6'>
          {[{title:'Find Compatible Donors',desc:'Instantly match based on blood type and location.'},{title:'Verified Requests',desc:'Reduce noise with verified, recent requests only.'},{title:'Privacy First',desc:'Your contact info is shared only when you consent.'}].map((f, i) => (
            <div key={i} className='rounded-xl p-6 bg-white/80 dark:bg-gray-900/70 shadow-neomorph border border-white/50 dark:border-white/5'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{f.title}</h3>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>{f.desc}</p>
            </div>
          ))}
        </section>

        <section className='rounded-2xl p-8 bg-gradient-to-r from-red-600 to-rose-600 text-white flex flex-col md:flex-row items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>Ready to make a difference?</h2>
            <p className='text-white/90 mt-1'>Donate today or request help — every drop counts.</p>
          </div>
          <div className='mt-4 md:mt-0 flex gap-3'>
            <Link href='/donate' className='px-5 py-3 bg-white text-red-600 font-semibold rounded-lg shadow hover:shadow-md transition'>Become a Donor</Link>
            <Link href='/request' className='px-5 py-3 border border-white/80 text-white font-semibold rounded-lg hover:bg-white/10 transition'>Request Blood</Link>
          </div>
        </section>
      </div>
    </Layout>
  )
}
