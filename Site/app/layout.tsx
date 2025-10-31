import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trest Language - Документация',
  description: 'Полная документация языка программирования Trest',
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

