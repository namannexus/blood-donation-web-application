import { useEffect, useRef } from 'react'

export default function Particles({ density = 0.00012, color = 'rgba(220,38,38,0.6)' }){
  const canvasRef = useRef(null)
  useEffect(()=>{
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w, h, particles=[], anim, running=true

    const resize = ()=>{
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      const count = Math.min(300, Math.floor(w*h*density))
      particles = Array.from({length:count}, ()=>({
        x: Math.random()*w,
        y: Math.random()*h,
        r: Math.random()*2 + 0.8,
        vy: Math.random()*0.3 + 0.1,
        vx: (Math.random()-0.5)*0.2,
        a: Math.random()*Math.PI*2
      }))
    }
    const step = ()=>{
      if(!running) return
      ctx.clearRect(0,0,w,h)
      ctx.globalCompositeOperation = 'lighter'
      for(const p of particles){
        p.y += p.vy
        p.x += p.vx + Math.sin(p.a+=0.01)*0.05
        if(p.y>h+10) p.y = -10
        if(p.x<-10) p.x=w+10; else if(p.x>w+10) p.x=-10
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fill()
      }
      anim = requestAnimationFrame(step)
    }
    resize(); step()
    window.addEventListener('resize', resize)
    return ()=>{ running=false; cancelAnimationFrame(anim); window.removeEventListener('resize', resize) }
  },[density,color])
  return <canvas ref={canvasRef} className='fixed inset-0 -z-10 pointer-events-none' aria-hidden='true' />
}