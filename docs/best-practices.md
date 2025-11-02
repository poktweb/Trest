# Melhores Práticas - Trest Language

Recomendações para escrever código de qualidade em Trest.

## Índice

1. [Nomenclatura](#nomenclatura)
2. [Organização de Código](#organização-de-código)
3. [Funções](#funções)
4. [Tratamento de Erros](#tratamento-de-erros)
5. [Desempenho](#desempenho)

---

## Nomenclatura

### ✅ Bom

```trest
пусть имяПользователя = "Иван"
пусть возрастПользователя = 30
функция рассчитатьСумму(a, b) {
    вернуть a + b
}
```

### ❌ Ruim

```trest
пусть x = "Иван"
пусть y = 30
функция f(a, b) {
    вернуть a + b
}
```

### Regras de Nomenclatura

- Use nomes claros em russo
- Use camelCase para variáveis e funções
- Use PascalCase para classes
- Evite abreviações
- Nomes devem refletir o propósito

---

## Organização de Código

### Divisão em Módulos

```trest
# utils/math.trest
экспорт функция сложить(a, b) {
    вернуть a + b
}

# main.trest
импорт { сложить } из "./utils/math.trest"
```

### Comentários

```trest
# Ruim
пусть x = 10  # x igual a 10

# Bom
# Calcula a área de um círculo dado o raio
функция площадьКруга(радиус) {
    вернуть Math.PI * радиус ** 2
}
```

---

## Funções

### Funções Pequenas

```trest
# Ruim
функция обработатьДанные(данные) {
    # 100 linhas de código
}

# Bom
функция валидировать(данные) {
    # ...
}

функция обработать(данные) {
    # ...
}

функция сохранить(данные) {
    # ...
}
```

### Um Nível de Abstração

```trest
# Bom
функция обработатьЗаказ(заказ) {
    если (!валидировать(заказ)) {
        вернуть ложь
    }
    сохранить(заказ)
    отправитьУведомление(заказ)
}
```

---

## Tratamento de Erros

### Tratamento Explícito

```trest
# Ruim
пусть результат = делить(10, 0)  # Pode quebrar

# Bom
попытаться {
    пусть результат = делить(10, 0)
} перехватить (ошибка) {
    печать("Ошибка: " + ошибка)
}
```

### Mensagens Claras

```trest
# Ruim
бросить "Ошибка"

# Bom
бросить "Не удалось загрузить файл: " + путь
```

---

## Desempenho

### Evite Cálculos Desnecessários

```trest
# Ruim
для (пусть i = 0; i < массив.длина; i = i + 1) {
    # массив.длина calculado em cada iteração
}

# Bom
пусть длина = массив.длина
для (пусть i = 0; i < длина; i = i + 1) {
    # длина calculada uma vez
}
```

### Use Estruturas de Dados Adequadas

```trest
# Para busca frequente use objeto em vez de array
пусть пользователи = {
    "id1": { имя: "Иван" },
    "id2": { имя: "Мария" }
}

# Busca rápida
печать(пользователи["id1"])
```

---

## Conclusão

Siga estas práticas para escrever código de qualidade e manutenível.

**Versão:** 2.3.0  
**Autor:** PoktWeb  
**Ano:** 2025
