# Guia Trest Language

Guia detalhado de uso da linguagem Trest.

## Índice

1. [Começando](#começando)
2. [Fundamentos de Sintaxe](#fundamentos-de-sintaxe)
3. [Trabalhando com Dados](#trabalhando-com-dados)
4. [Funções e Módulos](#funções-e-módulos)
5. [Programação Orientada a Objetos](#programação-orientada-a-objetos)
6. [Trabalhando com Erros](#trabalhando-com-erros)
7. [Dicas e Práticas](#dicas-e-práticas)

---

## Começando

### Seu Primeiro Programa

Crie o arquivo `hello.trest`:

```trest
печать("Привет, Мир!")
```

Execute:

```bash
trest hello.trest
```

Saída:
```
Привет, Мир!
```

---

## Fundamentos de Sintaxe

### Variáveis

```trest
# Declarar variável
пусть имя = "Иван"
пусть возраст = 25

# Alterar valor
возраст = 26

# Constante
конст PI = 3.14159
```

### Tipos de Dados

```trest
# Números
пусть число = 42
пусть дробное = 3.14

# Strings
пусть текст = "Привет"

# Booleanos
пусть правда = истина
пусть ложное = ложь

# Arrays
пусть список = [1, 2, 3]

# Objetos
пусть человек = {
    имя: "Иван",
    возраст: 30
}
```

---

## Trabalhando com Dados

### Arrays

```trest
пусть числа = [1, 2, 3, 4, 5]

# Acessar elementos
печать(числа[0])  # 1

# Modificar
числа[0] = 10
печать(числа)  # [10, 2, 3, 4, 5]

# Iterar
для (пусть число из числа) {
    печать(число)
}
```

### Objetos

```trest
пусть человек = {
    имя: "Иван",
    возраст: 30,
    город: "Москва"
}

# Acessar propriedades
печать(человек.имя)           # "Иван"
печать(человек["возраст"])    # 30

# Modificar
человек.возраст = 31

# Adicionar propriedade
человек.страна = "Россия"
```

---

## Funções e Módulos

### Criar Funções

```trest
функция приветствие(имя) {
    вернуть "Привет, " + имя
}

печать(приветствие("Иван"))  # "Привет, Иван"
```

### Módulos

**math.trest:**
```trest
экспорт функция сложить(a, b) {
    вернуть a + b
}

экспорт функция умножить(a, b) {
    вернуть a * b
}
```

**main.trest:**
```trest
импорт { сложить, умножить } из "./math.trest"

печать(сложить(5, 3))    # 8
печать(умножить(2, 4))   # 8
```

---

## Programação Orientada a Objetos

### Classes

```trest
класс Человек {
    функция конструктор(имя, возраст) {
        это.имя = имя
        это.возраст = возраст
    }
    
    функция представиться() {
        печать("Я " + это.имя + ", мне " + это.возраст + " лет")
    }
}

пусть иван = новый Человек("Иван", 30)
иван.представиться()  # "Я Иван, мне 30 лет"
```

### Herança

```trest
класс Студент расширяет Человек {
    функция конструктор(имя, возраст, группа) {
        супер(имя, возраст)
        это.группа = группа
    }
    
    функция учиться() {
        печать(это.имя + " учится")
    }
}

пусть студент = новый Студент("Мария", 20, "ИТ-101")
студент.представиться()  # "Я Мария, мне 20 лет"
студент.учиться()        # "Мария учится"
```

---

## Trabalhando com Erros

### try/catch

```trest
попытаться {
    пусть результат = 10 / 0
} перехватить (ошибка) {
    печать("Произошла ошибка: " + ошибка)
}
```

### Criar Erros

```trest
функция делить(a, b) {
    если (b == 0) {
        бросить "Деление на ноль невозможно!"
    }
    вернуть a / b
}

попытаться {
    делить(10, 0)
} перехватить (ошибка) {
    печать("Ошибка: " + ошибка)
}
```

---

## Dicas e Práticas

### Nomenclatura

- Use nomes claros: `имя`, `возраст`, `счетчик`
- Evite abreviações: `им` ao invés de `имя` - ruim
- Use camelCase para variáveis: `имяПользователя`

### Organização de Código

- Divida a lógica em funções
- Use módulos para organizar projetos grandes
- Comente seções complexas de código

### Tratamento de Erros

- Sempre trate erros possíveis
- Use try/catch para operações críticas
- Forneça mensagens de erro claras

---

## Exemplos de Projetos

Veja a pasta `exemplos/` para exemplos de projetos reais.
