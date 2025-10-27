import Layout from '../components/Layout'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home(){
  return (
    <Layout>
      <div className='py-12'>
        <motion.h1 initial={{y:-10, opacity:0}} animate={{y:0, opacity:1}} className='text-3xl font-bold'>Blood Donation Website</motion.h1>
        <p className='mt-4 text-gray-700'>Donate or request blood — fast, simple, and free.</p>
        <div className='mt-6 flex gap-4'>
          <Link href='/donate' className='px-4 py-2 bg-red-600 text-white rounded'>I'm a donor</Link>
          <Link href='/request' className='px-4 py-2 border border-red-600 text-red-600 rounded'>Need blood</Link>
        </div>
      </div>
    </Layout>
  )
}
