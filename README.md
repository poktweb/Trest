# Trest - Язык программирования с поддержкой кириллицы

Современный язык программирования, профессионально структурированный и компилируемый для **Web** и **Desktop (.exe)** с полной поддержкой кириллицы (русский алфавит).

> **📖 Версия на португальском:** Для документации на португальском используйте ключевые слова на португальском (se, enquanto, funcao, и т.д.) или смотрите примеры в папке `exemplos/`.

## 🚀 Основные возможности

- ✅ **Компиляция для Web** - Генерирует оптимизированный JavaScript
- ✅ **Компиляция для Desktop** - Создает нативные исполняемые файлы .exe
- ✅ **Система модулей** - Импорт/Экспорт модулей
- ✅ **Стандартная библиотека** - std с математическими функциями, строками, массивами и I/O
- ✅ **Обработка ошибок** - Расширенный Try/Catch/Throw
- ✅ **Синтаксис на кириллице** - Ключевые слова на русском языке
- ✅ **Динамическая типизация** - Типы выводятся автоматически
- ✅ **Система сборки** - Профессиональные инструменты компиляции

## 📦 Установка

### Установка через npm (рекомендуется)

**Глобальная установка:**
```bash
npm install -g trest-language
```

После установки команды `trest` и `trestc` будут доступны глобально:
```bash
trest --version
trestc --help
```

**Локальная установка в проект:**
```bash
npm install trest-language
```

Используйте через `npx`:
```bash
npx trest programa.trest
npx trestc programa.trest --mode web
```

### Установка из исходников

Если вы хотите установить из исходников или внести изменения:

```bash
# Клонировать репозиторий
git clone https://github.com/trest-language/trest.git
cd trest

# Установить зависимости
npm install

# Собрать проект
npm run build

# (Опционально) Создать симлинки для глобального использования
npm link
```

### Требования

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **TypeScript**: 5.0+ (для разработки)

Проверьте вашу версию:
```bash
node --version  # должно быть >= v18
npm --version   # должно быть >= 9
```

## 🎯 Быстрый старт

### Запуск напрямую (интерпретатор)
```bash
npm start exemplos/hello_cyrillic.trest
# или
trest exemplos/hello_cyrillic.trest
```

### Компиляция для Web (JavaScript)
```bash
npm run compile:web -- exemplos/hello_cyrillic.trest
# или
trestc exemplos/hello_cyrillic.trest --mode web --output app.js
```

### Компиляция для исполняемого файла (.exe)
```bash
npm run compile:exe -- exemplos/hello_cyrillic.trest
# или
trestc exemplos/hello_cyrillic.trest --mode exe --output app.exe
```

## 📚 Синтаксис языка

### Переменные

```trest
перем имя = "Trest"
пусть возраст = 25
конст pi = 3.14159
```

### Функции

```trest
функция сложить(a, b) {
    вернуть a + b
}

пусть результат = сложить(5, 3)
печать(результат)
```

### Условия

```trest
если (возраст >= 18) {
    печать("Совершеннолетний")
} иначе {
    печать("Несовершеннолетний")
}
```

### Циклы

**Пока:**
```trest
пусть i = 0
пока (i < 10) {
    печать(i)
    i = i + 1
}
```

**Для:**
```trest
для (пусть i = 0; i < 10; i = i + 1) {
    печать(i)
}
```

### Обработка ошибок

```trest
попытаться {
    пусть результат = разделить(10, 0)
} перехватить (ошибка) {
    печать("Ошибка:", ошибка)
} наконец {
    печать("Операция завершена")
}
```

### Модули

**Импорт:**
```trest
импорт { max, min } из "std/math"
импорт * как Math из "std/math"
```

**Экспорт:**
```trest
экспорт функция мояФункция() {
    вернуть "Привет"
}

экспорт конст константа = 42
```

### Объекты

```trest
пусть человек = {
    имя: "Иван",
    возраст: 30,
    город: "Москва"
}

печать(человек.имя)  # "Иван"
```

### Массивы

```trest
пусть числа = [1, 2, 3, 4, 5]
печать(числа[0])  # 1

числа[0] = 10
печать(числа)  # [10, 2, 3, 4, 5]
```

## 📖 Стандартная библиотека (std)

### Math

```trest
импорт * как Math из "std/math"

пусть x = Math.abs(-5)      # 5
пусть y = Math.max(10, 20)  # 20
пусть z = Math.sqrt(16)     # 4
пусть pi = Math.PI          # 3.14159...
```

### String

```trest
импорт * как String из "std/string"

пусть текст = "Привет Мир"
пусть размер = String.размер(текст)      # 11
пусть верхний = String.верхний(текст)  # "ПРИВЕТ МИР"
```

### Array

```trest
импорт * как Array из "std/array"

пусть arr = [1, 2, 3]
Array.добавить(arr, 4)      # [1, 2, 3, 4]
пусть обратный = Array.обратить(arr)  # [4, 3, 2, 1]
пусть отсортированный = Array.отсортировать([3, 1, 2])  # [1, 2, 3]
```

### IO

```trest
импорт * как IO из "std/io"

пусть содержимое = IO.читатьФайл("файл.txt")
IO.писатьФайл("выход.txt", "Содержимое")
пусть существует = IO.существуетФайл("файл.txt")
```

## 🏗️ Структура проекта

```
treste/
├── src/
│   ├── lexer.ts          # Лексический анализатор
│   ├── parser.ts         # Синтаксический анализатор
│   ├── ast.ts            # Определения AST
│   ├── interpreter.ts   # Интерпретатор
│   ├── compiler.ts      # CLI компилятора
│   ├── compiler/
│   │   ├── web.ts        # Компилятор для Web
│   │   └── exe.ts        # Компилятор для исполняемого файла
│   ├── std/              # Стандартная библиотека
│   │   ├── math.trest
│   │   ├── string.trest
│   │   ├── array.trest
│   │   └── io.trest
│   ├── types.ts          # Система типов
│   ├── errors.ts         # Обработка ошибок
│   └── module.ts         # Система модулей
├── exemplos/             # Примеры программ
├── dist/                 # Скомпилированный код
└── package.json
```

## 🔧 Доступные скрипты

```bash
npm run build          # Компилировать TypeScript
npm run build:watch     # Компилировать в режиме наблюдения
npm start <файл>       # Запустить файл Trest
npm run compile:web    # Компилировать в JavaScript
npm run compile:exe     # Компилировать в исполняемый файл
npm run bundle         # Создать исполняемый bundle
```

## 📝 Ключевые слова

### Кириллица (Русский) - Основной синтаксис
| Trest | Эквивалент |
|-------|------------|
| `если` | if |
| `иначе` | else |
| `пока` | while |
| `для` | for |
| `функция` | function |
| `вернуть` | return |
| `перем`, `пусть`, `конст` | var, let, const |
| `печать` | print/console.log |
| `импорт` | import |
| `экспорт` | export |
| `из` | from |
| `попытаться` | try |
| `перехватить` | catch |
| `бросить` | throw |
| `наконец` | finally |
| `прервать` | break |
| `продолжить` | continue |
| `истина` | true |
| `ложь` | false |

### Português (Latino) - Alternativa
| Trest | Equivalente |
|-------|-------------|
| `se` | if |
| `senao` | else |
| `enquanto` | while |
| `para` | for |
| `funcao` | function |
| `retorne` | return |
| `var`, `let`, `const` | var, let, const |
| `imprima` | print/console.log |
| `importe` | import |
| `exporte` | export |
| `de` | from |
| `tente` | try |
| `capture` | catch |
| `lance` | throw |
| `finalmente` | finally |
| `quebre` | break |
| `continue` | continue |
| `verdadeiro` | true |
| `falso` | false |

## 🌐 Компиляция для Web

Компилятор для web генерирует современный JavaScript, который может использоваться в:
- Браузерах (через `<script>` или bundler)
- Node.js
- React/Vue/Angular
- Любой JavaScript-среде

**Пример:**
```bash
trestc программа.trest --mode web --output app.js
```

## 💻 Компиляция для исполняемого файла

Компилятор для исполняемого файла создает `.exe` файл, который:
- Не требует установленного Node.js
- Автономен (включает все зависимости)
- Запускается напрямую в Windows

**Пример:**
```bash
trestc программа.trest --mode exe --output app.exe
```

## 🎓 Примеры

Смотрите папку `exemplos/` для полных программ, демонстрирующих:
- Базовые операции
- Функции и замыкания
- Структуры управления
- Массивы и объекты
- Модули и импорты
- Обработку ошибок

**Примеры на кириллице:**
- `exemplos/hello_cyrillic.trest` - Привет Мир
- `exemplos/variaveis_cyrillic.trest` - Переменные
- `exemplos/condicional_cyrillic.trest` - Условные операторы
- `exemplos/loop_cyrillic.trest` - Циклы
- `exemplos/funcao_cyrillic.trest` - Функции
- `exemplos/completo_cyrillic.trest` - Полный пример

**Примеры на португальском:**
- `exemplos/hello.trest` - Olá Mundo
- `exemplos/variaveis.trest` - Variáveis
- И другие...

## 📄 Лицензия

MIT

## 🤝 Вклад

Вклады приветствуются! Не стесняйтесь открывать issues и pull requests.
