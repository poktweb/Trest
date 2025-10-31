'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const docsPages = [
  { slug: 'index', title: 'Главная', path: '/' },
  { slug: 'readme', title: 'Полное руководство', path: '/docs/readme' },
  { slug: 'api', title: 'API Reference', path: '/docs/api' },
  { slug: 'guide', title: 'Пошаговое руководство', path: '/docs/guide' },
  { slug: 'examples', title: 'Примеры кода', path: '/docs/examples' },
  { slug: 'best-practices', title: 'Лучшие практики', path: '/docs/best-practices' },
  { slug: 'summary', title: 'Резюме', path: '/docs/summary' },
  { slug: 'changelog', title: 'История изменений', path: '/docs/changelog' },
]

export default function Home() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch('/api/docs/index')
        if (response.ok) {
          const text = await response.text()
          setContent(text)
        } else {
          setContent('# Документация Trest Language\n\nДобро пожаловать в документацию языка программирования Trest!')
        }
      } catch (error) {
        setContent('# Документация Trest Language\n\nДобро пожаловать в документацию языка программирования Trest!')
      } finally {
        setLoading(false)
      }
    }
    
    loadContent()
  }, [])

  if (loading) {
    return (
      <div>
        <header className="header">
          <div className="container header-content">
            <Link href="/" className="logo">
              🚀 Trest Language
            </Link>
            <nav>
              <Link href="/">Главная</Link>
            </nav>
          </div>
        </header>
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Загрузка документации...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <Link href="/" className="logo">
            🚀 Trest Language
          </Link>
          <nav>
            <Link href="/">Главная</Link>
          </nav>
        </div>
      </header>

      <div className="main-layout">
        <nav className="nav">
          <div className="nav-title">📚 Документация</div>
          <ul>
            {docsPages.map((page) => (
              <li key={page.slug}>
                <Link href={page.path}>{page.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="main-content">
          <div className="content">
            <div className="markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </main>
      </div>

      <footer className="footer">
        <div className="container">
          <p>© 2024 Trest Language - Документация</p>
        </div>
      </footer>
    </div>
  )
}
