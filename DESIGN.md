# Устройство сервиса R4

Калькулятор остаётся одним TypeScript/Vite-приложением: `src` содержит код,
`test/calculator.test.ts` — runtime baseline, `index.html` — точку входа.
Вычисления выполняются в браузере без сетевых API и постоянного хранения
введённых значений.

```text
personal product-meta Store          Stage 4 service
requirements + Changes + tasks  -->  code + runtime tests + build
              read-only context  -->  .workspace (не рабочая копия)
```

`openspec/config.yaml` — только pointer на
`sdd-credit-calculator-product-meta`. Локальная planning-структура не
поддерживается: она создала бы второго владельца договора. История R3 остаётся
в Git-предке и исходном репозитории на SHA
`0e9d67e826acf5f95087be9a5a83ade23421e9b0`, а не копируется в текущий tree.

`check:code` не зависит от пользовательского Store registry и поэтому работает
в чистом CI. `check:store` отдельно доказывает, что обычные команды из сервиса
выбрали declared Store. Ни один gate сам по себе не доказывает реализацию
будущего Change; runtime и браузерные результаты привязываются к точному SHA
сервиса, planning validation — к точному SHA meta.

Стандартные `.opencode/skills` управляют действиями инструмента. Они не являются
источником требований и не меняют границу записи между двумя репозиториями.
