# Trest Language v2.1 Documentation Site

Сайт документации языка программирования Trest v2.1, созданный с Next.js.

**Новые модули:** HTTP, Crypto, FileSystem, JSON, Date, Database, GUI, Async

## 📁 Расположение

Сайт находится в: `C:\Users\Lesenechal\Desktop\Projetos\Trest_Site`

Документация находится в: `docs/` (встроена в проект сайта)

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Сборка

```bash
npm run build
npm start
```

## Деплой на Vercel

1. Убедитесь, что у вас установлен Vercel CLI:
```bash
npm i -g vercel
```

2. Деплой:
```bash
vercel
```

Или подключите репозиторий GitHub к Vercel через веб-интерфейс.

## 🔄 Обновление документации

**ВАЖНО:** Вся документация встроена в проект сайта в папке `docs/`. Для обновления документации редактируйте файлы непосредственно в этой папке.

### Структура документации:

- `docs/index.md` → `/` (Главная)
- `docs/README.md` → `/docs/readme` (Полное руководство)
- `docs/api.md` → `/docs/api` (API Reference)
- `docs/guide.md` → `/docs/guide` (Пошаговое руководство)
- `docs/examples.md` → `/docs/examples` (Примеры кода)
- `docs/best-practices.md` → `/docs/best-practices` (Лучшие практики)
- `docs/SUMMARY.md` → `/docs/summary` (Резюме)
- `docs/CHANGELOG.md` → `/docs/changelog` (История изменений)

## Структура сайта

- `app/` - Страницы Next.js App Router
- `app/page.tsx` - Главная страница
- `app/docs/[slug]/page.tsx` - Динамические страницы документации
- `app/api/docs/[slug]/route.ts` - API route для загрузки документации
- `app/globals.css` - Глобальные стили
- `app/layout.tsx` - Главный layout
- `docs/` - Встроенная документация Trest Language

## 📝 Примечания

- Сайт автоматически загружает все файлы из папки `docs/` (встроенная документация)
- При изменениях в документации просто обновите файлы в `docs/`
- Сайт использует клиентскую загрузку через API routes для гибкости
- Вся документация встроена в проект для автономной работы
