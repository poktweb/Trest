import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trest Language v2.1 - Документация',
  description: 'Полная документация языка программирования Trest - HTTP, Crypto, FileSystem, JSON, Date, Database, GUI, Async',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

