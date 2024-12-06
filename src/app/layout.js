import './globals.css'
import { JetBrains_Mono } from 'next/font/google'

const mono = JetBrains_Mono({ subsets: ['latin'] })

export const metadata = {
  title: 'Abhay Yadav - Software Engineer',
  description: 'Personal portfolio of Abhay Yadav',
  icons: {
    icon: '/file.svg'
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${mono.className} bg-[#1c1c1c] text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}