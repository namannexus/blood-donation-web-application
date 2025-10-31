import Head from 'next/head'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const AnimatedCursor = dynamic(() => import('./AnimatedCursor'), { ssr: false })
const Particles = dynamic(() => import('./Particles'), { ssr: false })
const FAQBot = dynamic(() => import('./FAQBot'), { ssr: false })

export default function Layout({children}) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('theme')
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      <Head>
        <title>Blood Donation — Connect & Help</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#dc2626" />
      </Head>

      <AnimatedCursor />

      <div className='min-h-screen bg-gradient-to-b from-[var(--bg-light-from)] to-[var(--bg-light-to)] dark:from-[var(--bg-dark-from)] dark:to-[var(--bg-dark-to)] transition-colors animated-bg'>
        <header className='sticky top-0 z-20 bg-white/60 dark:bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-white/40 border-b border-white/60 dark:border-white/10'>
          <div className='max-w-6xl mx-auto p-4 flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold shadow-neomorph'>
                BD
              </div>
              <div className='text-lg font-semibold text-gray-800 dark:text-gray-100'>Instablood</div>
            </div>
            <nav className='flex items-center gap-4 text-sm'>
              <Link href='/' className='text-gray-700 dark:text-gray-200 hover:text-red-600'>Home</Link>
              <Link href='/donate' className='text-gray-700 dark:text-gray-200 hover:text-red-600'>Donate</Link>
              <Link href='/request' className='text-gray-700 dark:text-gray-200 hover:text-red-600'>Request</Link>
              <Link href='/admin' className='text-gray-700 dark:text-gray-200 hover:text-red-600'>Admin</Link>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className='ml-2 px-3 py-1 rounded-md bg-white/70 dark:bg-white/10 backdrop-blur-sm shadow-sm border border-white/60 dark:border-white/10'>
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </nav>
          </div>
        </header>

        <Particles />
        <main className='relative max-w-6xl mx-auto p-4'>
          <div className='grid md:grid-cols-[1fr_340px] gap-6'>
            <div>{children}</div>
            <aside className='hidden md:block sticky top-20 self-start'>
              <FAQBot />
            </aside>
          </div>
        </main>

        <footer className='max-w-6xl mx-auto p-4 text-center text-sm text-gray-500'>
          © {new Date().getFullYear()} Instablood — Every drop counts
        </footer>
      </div>
      <style jsx global>{`
        .shadow-neomorph {
          box-shadow: 8px 8px 16px rgba(220,38,38,0.06), -8px -8px 16px rgba(255,255,255,0.55);
        }
      `}</style>
    </>
  )
}
