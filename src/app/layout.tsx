import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from "./_component/universal/Header";
import Footer from "./_component/universal/Footer";
import Talk from "@/app/_component/messenger/TalkBtn";
import {ProviderRedux} from "@/redux/redux-provider";




const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Item Oasis',
  description: '블록체인 기반 게임 아이템 거래 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      
      <body className={inter.className}>
        <ProviderRedux>
          <Header />          
          {children}
          <Talk />
          <Footer />
        </ProviderRedux>
      </body>
      
    </html>
  )
}
