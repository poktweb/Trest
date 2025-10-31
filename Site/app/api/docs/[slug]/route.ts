import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

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
    }
    
    const fileName = fileMap[slug] || slug
    
    // Primeiro tentar usar a pasta docs local
    const localDocsPath = join(process.cwd(), 'docs', `${fileName}.md`)
    const externalDocsPath = join(process.cwd(), '..', 'docs', `${fileName}.md`)
    
    let filePath = localDocsPath
    if (!existsSync(filePath)) {
      // Se não encontrar localmente, tentar pasta externa (compatibilidade)
      filePath = externalDocsPath
    }
    
    const content = readFileSync(filePath, 'utf-8')
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    // Se slug é readme, tentar pegar do README.md na raiz
    if (params.slug === 'readme') {
      try {
        const readmePath = join(process.cwd(), '..', 'README.md')
        const content = readFileSync(readmePath, 'utf-8')
        return new NextResponse(content, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        })
      } catch {
        return NextResponse.json(
          { error: 'Документация не найдена' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Документация не найдена' },
      { status: 404 }
    )
  }
}

