# Ступень 4: разработка с OpenSpec Store

Это чистый сервисный вход R4. Приложение и runtime-тесты находятся здесь,
а принятые требования и tasks — в соседнем personal meta через Store
`sdd-credit-calculator-product-meta`. Старый planning R3 сюда не мигрируется и
не копируется.

Исходный сервисный baseline сохранён в Git-истории из
[`sdd-guide-credit-calculator-stage-3`](https://github.com/apolenkov/sdd-guide-credit-calculator-stage-3)
на SHA `0e9d67e826acf5f95087be9a5a83ade23421e9b0`. Действующая точка старта R4 —
отдельный `SERVICE_SHA`, который сообщает организатор.

## Границы репозиториев

| Артефакт | Где изменяется |
| --- | --- |
| Requirements, Changes и tasks | personal product-meta Store |
| `src`, runtime-тесты и сборка | этот сервисный checkout |
| `.workspace` в meta | нигде: только read-only контекст |

В `openspec/` сервиса есть только [config.yaml](openspec/config.yaml). Каталог
`.agents/skills` — универсальные инструкции OpenSpec (их автоматически читают Kilo и
другие стандартные агенты), `.kilo/command` — команды Kilo; каталог не содержит и не
дублирует продуктовые требования.

## Чистый старт R4

Полный `setup-analysis-workspace` из репозитория требований уже подготовил
рядом чистый checkout `sdd-guide-credit-calculator-stage-4-code` на точном
`SERVICE_SHA`. Это основной путь: повторно клонировать сервис не нужно. Если
папки действительно нет, используйте только recovery из
[передачи разработчику](docs/developer-handoff.md); существующую папку не
заменяйте и не переключайте.

В этой инструкции `PLANNING_SHA` — полный SHA принятого итогового состояния R4
в `sdd-guide-credit-calculator-stage-4-requirements`. Это не исходный SHA R3,
записанный как provenance, и не `IMPORT_BASE_SHA`, с которого начинался анализ.
Организатор также передаёт полный `SERVICE_SHA`, имя принятого Change и пути к
обоим соседним checkout. Store должен быть зарегистрирован заранее.

Из корня требований проверьте оба точных SHA и чистоту, затем создайте личную
ветку кода от `SERVICE_SHA`. Точные fail-closed команды и recovery приведены в
[инструкции разработчика](docs/developer-handoff.md). Пользователь явно называет
оба разрешённых root; текущая сессия должна иметь доступ к ним и прочитать оба
`AGENTS.md`. Store pointer сам по себе не предоставляет файловые права.

После создания ветки проверьте неявный Store pointer из корня сервиса:

```bash
npm exec openspec -- list --json
npm exec openspec -- status --change "$CHANGE" --json
npm run check:code
npm run check:store
```

Обе OpenSpec-команды выполняются без `--store` и должны вернуть
`root.source = declared`, `root.store_id = sdd-credit-calculator-product-meta`
и один и тот же ожидаемый root. Число Changes, требований, сценариев и tasks
берётся из принятого planning, а не из этого шаблона.

`npm run check:code` — автономный CI-gate: типы, runtime- и repository-contract
тесты, ссылки, privacy и build. Он проверяет форму config-only pointer, но не
доступность machine-local Store. `npm run check:store` запускает implicit
`list` и `status --all` и требует уже зарегистрированный Store. Полная локальная
проверка `npm run check` объединяет оба gate.

## Перед Apply

Apply разрешён только после того, как review требований и tasks относится к
точному `PLANNING_SHA`, review кода и runtime baseline — к точному
`SERVICE_SHA`, а владелец явно назвал разрешённый Change и охват. До этого
доступны только read-only проверки; код, тесты и Store tasks не меняются.

Подробная последовательность — в [передаче разработчику](docs/developer-handoff.md).
Проект синтетический: расчёт не является банковским предложением.
