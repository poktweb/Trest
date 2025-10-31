# Руководство по сборке - Trest Language

## Компиляция для Web

### JavaScript Standalone

```bash
# Компилировать файл Trest в JavaScript
trestc программа.trest --mode web --output программа.js

# С минификацией
trestc программа.trest --mode web --minify --output программа.min.js
```

### Bundle с модулями

```bash
# Компилировать с bundling зависимостей
trestc программа.trest --mode web --bundle --output bundle.js
```

## Компиляция для исполняемого файла (.exe)

### Требования

Установите `pkg` глобально:
```bash
npm install -g pkg
```

### Компилировать для .exe

```bash
# Компилировать для исполняемого файла Windows
trestc программа.trest --mode exe --output программа.exe
```

Созданный исполняемый файл:
- ✅ Не требует установленного Node.js
- ✅ Включает все зависимости
- ✅ Может распространяться как standalone

### Альтернатива: Batch скрипт

Если `pkg` недоступен, будет создан `.bat` файл, который выполняется через Node.js.

## Структура сборки

```
.trest-build/          # Временный каталог сборки
dist/                  # Скомпилированный код TypeScript
  ├── compiler/
  │   ├── web.js
  │   └── exe.js
  └── cli.js
bin/                   # Финальные исполняемые файлы
```

## Опции компиляции

### Режим Web
- `--minify` - Минифицировать код JavaScript
- `--bundle` - Включить зависимости в bundle
- `--output, -o` - Файл вывода

### Режим Exe
- `--minify` - Минифицировать код перед созданием exe
- `--output, -o` - Имя финального исполняемого файла

## Полный пример

```bash
# 1. Компилировать TypeScript
npm run build

# 2. Компилировать программу Trest в JavaScript
trestc exemplos/completo_cyrillic.trest --mode web --output dist/app.js

# 3. Или скомпилировать в исполняемый файл
trestc exemplos/completo_cyrillic.trest --mode exe --output app.exe
```

## Решение проблем

### Ошибка: "pkg не найден"
```bash
npm install -g pkg
```

### Ошибка: "Модуль не найден"
Убедитесь, что модули std находятся в правильном пути:
- `src/std/` для разработки
- Скопированы в `dist/std/` после сборки

