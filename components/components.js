import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

import Magnetic from './Magnetic'

export default function Hero(){
  const lottieContainer = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    let lottie, anim; let mounted = true
    ;(async () => {
      try {
        // Load lottie-web only on client and only if available
        const mod = await import('lottie-web')
        lottie = mod.default
        // Fetch animation data from CDN to avoid bundling local JSON
        const res = await fetch('https://assets10.lottiefiles.com/packages/lf20_kdstfsfv.json')
        if (!res.ok) throw new Error('Failed to load animation')
        const data = await res.json()
        if (mounted && lottieContainer.current) {
          anim = lottie.loadAnimation({
            container: lottieContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: data,
          })
        }
      } catch (e) {
        // graceful no-op if lottie or network fails
      }
    })()
    return () => { mounted = false; try { anim && anim.destroy && anim.destroy() } catch(_){} }
  }, [])

  return (
    <section ref={wrapperRef} className='relative overflow-hidden rounded-2xl p-8 shadow-neomorph bg-gradient-to-br from-white to-[#ffecec] dark:from-[#0f0f12] dark:to-[#0b0b0d] perspective-1000 group animated-gradient'>
      <div className='absolute inset-0 -z-10 blood-flow-bg' />
      <div className='absolute -top-24 -right-16 w-72 h-72 rounded-full blur-3xl opacity-30 bg-rose-400 dark:bg-rose-700 animate-morph' />
      <div className='flex flex-col md:flex-row items-center gap-6 [transform-style:preserve-3d]'>
        <div className='flex-1 will-change-transform group-hover:translate-z-10 group-hover:-rotate-x-1 group-hover:rotate-y-1 transition-transform'>
          <motion.h1 initial={{y:-10, opacity:0}} animate={{y:0, opacity:1}} className='text-3xl md:text-4xl font-extrabold text-red-600 drop-shadow-neon'>
            Give life. Share blood.
          </motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.15}} className='mt-4 text-gray-700 dark:text-gray-300'>
            Connect with donors and recipients nearby. Track matches, requests, and appointments — all in one place.
          </motion.p>

          <div className='mt-6 flex gap-4'>
            <Magnetic>
              <a href='/donate' className='px-5 py-3 bg-red-600 text-white rounded shadow-md hover:shadow-neon transition-all'>Donate Now</a>
            </Magnetic>
            <Magnetic>
              <a href='/request' className='px-5 py-3 border border-red-600 text-red-600 rounded hover:bg-red-50/50 dark:hover:bg-white/5 transition'>Request Blood</a>
            </Magnetic>
          </div>
        </div>

        <div className='w-48 h-48 md:w-64 md:h-64 flex-none rounded-full bg-gradient-to-br from-red-100 to-rose-200 dark:from-red-900/30 dark:to-rose-900/20 flex items-center justify-center will-change-transform group-hover:translate-z-20 transition-transform' ref={lottieContainer} aria-hidden='true'>
          {/* Fallback circle shows if lottie fails */}
          <svg className='w-14 h-14 opacity-60' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M12.001 2.999c0 0-6.001 6.135-6.001 10.001 0 3.314 2.686 6.001 6.001 6.001s6.001-2.687 6.001-6.001c0-3.866-6.001-10.001-6.001-10.001z'/>
          </svg>
        </div>
      </div>
    </section>
  )
}
