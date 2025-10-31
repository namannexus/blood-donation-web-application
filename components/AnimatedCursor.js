import { useEffect } from 'react'

export default function AnimatedCursor(){
  useEffect(() => {
    // create a subtle cursor blob that follows the mouse
    const blob = document.createElement('div')
    blob.id = 'ai-cursor-blob'
    document.body.appendChild(blob)

    const move = (e) => {
      blob.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`
    }
    window.addEventListener('mousemove', move)

    return () => {
      window.removeEventListener('mousemove', move)
      blob.remove()
    }
  }, [])

  return (
    <style jsx global>{`
      #ai-cursor-blob{
        position:fixed;
        width:24px;height:24px;border-radius:50%;
        pointer-events:none;
        background: radial-gradient(circle at 30% 30%, rgba(255,80,80,0.95), rgba(255,30,30,0.65));
        mix-blend-mode: screen;
        transition: transform 0.08s linear;
        z-index:9999;
        box-shadow: 0 6px 18px rgba(255,0,0,0.12);
      }
      a:hover ~ #ai-cursor-blob, button:hover ~ #ai-cursor-blob { transform: scale(1.4); }
    `}</style>
  )
}