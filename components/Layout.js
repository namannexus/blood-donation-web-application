import Link from 'next/link'

export default function Layout({ children }){
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow'>
        <div className='max-w-4xl mx-auto px-4 py-4 flex justify-between items-center'>
          <div className='text-xl font-bold text-red-600'>Blood Donation Website</div>
          <nav className='space-x-4'>
            <Link href='/' className='text-sm'>Home</Link>
            <Link href='/donate' className='text-sm'>Donate</Link>
            <Link href='/request' className='text-sm'>Request</Link>
            <Link href='/admin' className='text-sm'>Admin</Link>
          </nav>
        </div>
      </header>
      <main className='max-w-4xl mx-auto p-6'>{children}</main>
      <footer className='text-center text-sm text-gray-500 py-6'>Built with ♥</footer>
    </div>
  )
}
