# Trest Language Documentation Site

Сайт документации языка программирования Trest, созданный с Next.js.

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

## Структура

- `app/` - Страницы Next.js App Router
- `app/page.tsx` - Главная страница
- `app/docs/[slug]/page.tsx` - Динамические страницы документации
- `app/globals.css` - Глобальные стили
- `app/layout.tsx` - Главный layout

Сайт автоматически загружает все файлы из папки `../docs/` и отображает их.

