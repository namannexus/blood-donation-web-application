import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const FAQS = [
  { q: 'Who can donate blood?', a: 'Most healthy adults 18–65 years (or per local guidelines) can donate. Common criteria: weight >50kg, haemoglobin within normal range, not pregnant, no recent major surgery, no active infection. Always follow your local blood bank’s screening.' },
  { q: 'How often can I donate?', a: 'Whole blood: typically every 8–12 weeks (56–90 days) depending on local rules. Platelets and plasma have different intervals. Ask your blood bank for specifics.' },
  { q: 'How do I register as a donor?', a: "Go to the Donate page, fill your name, blood type, contact and location, then submit. You’ll appear in the admin dashboard and be matched with nearby requests." },
  { q: 'How do I request blood?', a: 'Open the Request page, provide patient name, required blood type, location, contact and units. We’ll record your request and surface compatible donors. A map appears with nearby donor locations.' },
  { q: 'Is my data private?', a: 'We share your contact only for compatible matches and with your consent. You can request removal anytime via the admin or by contacting support.' },
  { q: 'Which blood types are compatible?', a: 'O- donates to all; O+ to all positive types; A to A and AB; B to B and AB; AB receives from all (AB+ universal recipient). Always confirm with medical staff for components and regional guidelines.' },
  { q: 'How are donors matched?', a: 'We match primarily by blood type and optionally by location (city). Admin can also filter, contact, and update records.' },
  { q: 'How to update my details?', a: 'Contact the admin with your registered name and contact or submit a new donor entry; the admin can modify or remove old records.' },
  { q: 'Side effects and preparation?', a: 'Stay hydrated, have a light meal, avoid alcohol 24h before, and rest after donation. Minor dizziness or bruising can occur; seek medical help for persistent issues.' },
  { q: 'Emergency help', a: 'If this is an emergency, contact your nearest hospital or blood bank immediately. Use Instablood to request and also reach out via phone.' }
]


export default function FAQBot(){
  const [open, setOpen] = useState(true)
  const [msgs, setMsgs] = useState([
    { role: 'bot', text: 'Hi! I’m your Instablood assistant. Choose a question below.' }
  ])
  const [options, setOptions] = useState(FAQS.slice(0,3))
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(()=>{ listRef.current && listRef.current.scrollTo({ top: 999999, behavior: 'smooth' }) }, [msgs])

  async function fetchRelated(topic){
    try{
      setLoading(true)
      const res = await fetch(`/api/faqs?topic=${encodeURIComponent(topic)}`)
      if(!res.ok) throw new Error('fetch failed')
      const js = await res.json()
      const items = (js.items || []).filter(it=>it && it.q && it.a)
      if(items.length){
        setOptions(items.slice(0,3))
      }else{
        // fallback to local FAQs (random 3)
        const pool = [...FAQS]
        for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]] }
        setOptions(pool.slice(0,3))
      }
    }catch(e){
      const pool = [...FAQS]
      for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]] }
      setOptions(pool.slice(0,3))
    }finally{
      setLoading(false)
    }
  }

  const choose = async (opt) => {
    setMsgs(m => [...m, { role:'user', text: opt.q }, { role:'bot', text: opt.a }])
    fetchRelated(opt.q)
  }

  return (
    <div className='rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-gray-900/70 shadow-neomorph overflow-hidden depth-shadow'>
      <div className='px-4 py-3 flex items-center justify-between border-b border-white/60 dark:border-white/10'>
        <div className='font-semibold text-gray-900 dark:text-gray-100'>Help Assistant</div>
        <button onClick={()=>setOpen(!open)} className='text-xs px-2 py-1 rounded bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10'>
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      {open && (
        <>
          <div ref={listRef} className='h-72 overflow-y-auto p-3 space-y-2 custom-scroll'>
            {msgs.map((m,i)=> (
              <motion.div key={i} initial={{opacity:0, y:4}} animate={{opacity:1, y:0}} className={`max-w-[85%] px-3 py-2 rounded-lg ${m.role==='bot' ? 'bg-red-50/80 dark:bg-white/5 text-gray-900 dark:text-gray-100' : 'bg-white dark:bg-white/10 text-gray-900 dark:text-gray-100 ml-auto'}`}>
                {m.text}
              </motion.div>
            ))}
          </div>
          <div className='p-3 border-t border-white/60 dark:border-white/10'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
              {options.map((opt,i)=> (
                <button key={i} onClick={()=>!loading && choose(opt)} disabled={loading} className='text-left px-3 py-2 rounded-md border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-gray-900 dark:text-white disabled:opacity-50'>
                  {opt.q}
                </button>
              ))}
              {loading && (
                <div className='col-span-full text-sm text-gray-600 dark:text-gray-300'>Fetching new FAQs…</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
