import { Inter } from 'next/font/google'
import './ui/globals.css'
import Navbar from './components/navbar/navbar'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FactXpert Admin App',
  description: 'Admin Portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <div className="container mx-auto px-0 max-w-full">
          {/* Include Navbar component */}
          <Navbar />
          {/* Render children components */}
          {children}
        </div>
      </body>
    </html>
  )
}
