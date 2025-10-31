import { useRef } from 'react'

export default function Magnetic({ strength=0.2, children }){
  const ref = useRef(null)
  const onMove = (e)=>{
    const el = ref.current; if(!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width/2
    const y = e.clientY - rect.top - rect.height/2
    el.style.transform = `translate(${x*strength}px, ${y*strength}px)`
  }
  const reset = ()=>{ if(ref.current){ ref.current.style.transform = 'translate(0,0)' } }
  return (
    <span onMouseMove={onMove} onMouseLeave={reset} className='inline-block will-change-transform'>
      <span ref={ref} className='inline-block'>
        {children}
      </span>
    </span>
  )
}