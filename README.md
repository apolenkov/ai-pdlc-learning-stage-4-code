# Практикум разработки: сервис, который читает требования из OpenSpec Store

Это сервисный репозиторий кредитного калькулятора: код и runtime-тесты. Он завершает маршрут курса
после шагов 1–5 и 6а/6б: требования принимаются в соседнем метарепозитории, а здесь разработчик
реализует принятый Change.

| | |
| --- | --- |
| Шаг курса | [Практикум разработки](https://apolenkov.github.io/customdev-learning/guides/d1-delivery.html) |
| Вход | Принятые требования и tasks в соседнем метарепозитории `sdd-guide-credit-calculator-stage-4-requirements` (Store `sdd-credit-calculator-product-meta`) и выданный `SERVICE_SHA` |
| Действие | Разработчик в личной ветке реализует принятый Change в `src/` и тестах; требования меняются только в метарепозитории |
| Результат | PR в свой fork кода с результатом `npm run check` и SHA планирования, начального и итогового кода |

**С чего начать.** На GitHub нажмите **Fork**. Если вы работаете в GitLab, создайте проект через
**New project → Import project → Repository by URL** и вставьте адрес
`https://github.com/apolenkov/sdd-guide-credit-calculator-stage-4-code.git`. Адрес `origin` оставьте
адресом upstream, а свой fork добавьте вторым remote: проверка в
[передаче разработчику](docs/developer-handoff.md) сверяет `origin` с этим адресом.

## Границы репозиториев

Приложение и runtime-тесты находятся здесь, а принятые требования и tasks — в соседнем personal meta
через Store `sdd-credit-calculator-product-meta`. Старый planning R3 сюда не мигрируется и не
копируется.

Исходный сервисный baseline сохранён в Git-истории из
[`sdd-guide-credit-calculator-stage-3`](https://github.com/apolenkov/sdd-guide-credit-calculator-stage-3)
на SHA `0e9d67e826acf5f95087be9a5a83ade23421e9b0`. Действующая точка старта R4 —
отдельный `SERVICE_SHA`, который сообщает организатор.

| Артефакт | Где изменяется |
| --- | --- |
| Requirements, Changes и tasks | personal product-meta Store |
| `src`, runtime-тесты и сборка | этот сервисный checkout |
| `.workspace` в meta | нигде: только read-only контекст |

В `openspec/` сервиса есть только [config.yaml](openspec/config.yaml). Каталог
`.agents/skills` — универсальные инструкции OpenSpec (их автоматически читают Kilo и
другие стандартные агенты), `.kilo/command` — команды Kilo; каталог не содержит и не
дублирует продуктовые требования.

## Чистый старт: практикум разработки

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
