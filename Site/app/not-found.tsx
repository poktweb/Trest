import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '1rem' }}>Страница не найдена</h2>
      <p style={{ marginBottom: '2rem', color: '#b0b5c8' }}>
        Запрашиваемая страница не существует.
      </p>
      <Link 
        href="/" 
        style={{
          background: '#4fc3f7',
          color: '#0a0e27',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'all 0.2s'
        }}
      >
        Вернуться на главную
      </Link>
    </div>
  )
}

