import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

// Caminho local para documentação (prioritário)
const getDocsPath = () => {
  // No Next.js, process.cwd() aponta para a raiz do projeto Next.js (Site/)
  const localDocs = join(process.cwd(), 'docs')
  if (existsSync(localDocs)) {
    return localDocs
  }
  
  // Último fallback
  return localDocs
}

const getReadmePath = () => {
  // No Next.js, process.cwd() aponta para a raiz do projeto Next.js (Site/)
  const localReadme = join(process.cwd(), 'README.md')
  return localReadme
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Mapear slug para nome do arquivo
    const fileMap: { [key: string]: string } = {
      'readme': 'README',
      'summary': 'SUMMARY',
      'changelog': 'CHANGELOG',
      'modules': 'modules',
      'index': 'index',
      'api': 'api',
      'guide': 'guide',
      'examples': 'examples',
      'best-practices': 'best-practices',
    }
    
    const fileName = fileMap[slug] || slug
    const docsDir = getDocsPath()
    const filePath = join(docsDir, `${fileName}.md`)
    
    // Debug logs (remover em produção se necessário)
    console.log('Loading doc:', { slug, fileName, docsDir, filePath, exists: existsSync(filePath) })
    
    // Se arquivo não existe e é index, tentar sem extensão ou com outro nome
    if (!existsSync(filePath)) {
      // Tentar com diferentes variações
      const variations = [
        join(docsDir, `${fileName.toLowerCase()}.md`),
        join(docsDir, `${fileName.toUpperCase()}.md`),
        join(docsDir, `${fileName}.md`),
      ]
      
      let foundPath: string | null = null
      for (const variant of variations) {
        if (existsSync(variant)) {
          foundPath = variant
          break
        }
      }
      
      if (!foundPath) {
        throw new Error(`Arquivo não encontrado: ${filePath}. Tentou: ${variations.join(', ')}`)
      }
      
      const content = readFileSync(foundPath, 'utf-8')
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }
    
    const content = readFileSync(filePath, 'utf-8')
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error: any) {
    // Se slug é readme, tentar pegar do README.md na raiz do projeto Trest
    if (params.slug === 'readme') {
      try {
        const readmePath = getReadmePath()
        if (existsSync(readmePath)) {
          const content = readFileSync(readmePath, 'utf-8')
          return new NextResponse(content, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
          })
        }
      } catch (err) {
        console.error('Erro ao ler README:', err)
      }
    }
    
    console.error('Erro ao carregar documentação:', error)
    return NextResponse.json(
      { 
        error: `Документация не найдена: ${error.message || 'Unknown error'}`,
        slug: params.slug,
        debug: {
          docsDir: getDocsPath(),
          readmePath: getReadmePath(),
          cwd: process.cwd(),
        }
      },
      { status: 404 }
    )
  }
}
