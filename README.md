# Ступень 4: разработка с OpenSpec Store

Это чистый сервисный вход R4. Приложение и runtime-тесты находятся здесь,
а принятые требования и tasks — в соседнем personal meta через Store
`sdd-credit-calculator-product-meta`. Старый planning R3 сюда не мигрируется и
не копируется.

Исходное сервисное состояние сохранено в Git-истории из
[`sdd-credit-calculator-example`](https://github.com/apolenkov/sdd-guide-credit-calculator-stage-3)
на SHA `0e9d67e826acf5f95087be9a5a83ade23421e9b0`. Действующая точка старта R4 —
отдельный `SERVICE_SHA`, который сообщает организатор.

## Границы репозиториев

| Артефакт | Где изменяется |
| --- | --- |
| Requirements, Changes и tasks | personal product-meta Store |
| `src`, runtime-тесты и сборка | этот сервисный checkout |
| `.workspace` в meta | нигде: только read-only контекст |

В `openspec/` сервиса есть только [config.yaml](openspec/config.yaml). Каталог
`.opencode/skills` сохранён как инструкции OpenCode для стандартных OpenSpec
операций; он не содержит и не дублирует продуктовые требования.

## Чистый старт R4

Организатор передаёт полный `SERVICE_SHA` из этого репозитория, полный принятый
`PLANNING_SHA`, имя Change и путь уже существующего соседнего personal meta.
Store должен быть зарегистрирован заранее. Не переносите старый planning и не
перерегистрируйте Store из сервиса. Пользователь явно называет оба разрешённых
root; текущая сессия должна иметь доступ к ним и прочитать оба `AGENTS.md`.
Store pointer сам по себе не предоставляет файловые права.

```bash
SERVICE_REPOSITORY='https://github.com/apolenkov/sdd-guide-credit-calculator-stage-4-code.git'
SERVICE_SHA='<40_CHARACTER_SERVICE_SHA>'
PLANNING_SHA='<40_CHARACTER_PLANNING_SHA>'
CHANGE='<ACCEPTED_CHANGE>'
META_DIR='../sdd-credit-calculator-product-meta-example'
PERSONAL_BRANCH='course/<login>/stage-4-<change>'

git clone "$SERVICE_REPOSITORY"
cd sdd-credit-calculator-stage-4-example
git cat-file -e "$SERVICE_SHA^{commit}"
test "$(git rev-parse "$SERVICE_SHA^{commit}")" = "$SERVICE_SHA"
git switch -c "$PERSONAL_BRANCH" "$SERVICE_SHA"
test "$(git rev-parse HEAD)" = "$SERVICE_SHA"

git -C "$META_DIR" cat-file -e "$PLANNING_SHA^{commit}"
test "$(git -C "$META_DIR" rev-parse HEAD)" = "$PLANNING_SHA"
git status --short --branch
git -C "$META_DIR" status --short --branch
npm ci
```

Обе рабочие копии должны быть ожидаемыми и чистыми. Затем проверьте неявный
Store pointer из корня сервиса:

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
точному `PLANNING_SHA`, review кода и рабочего состояния — к точному
`SERVICE_SHA`, а владелец явно назвал разрешённый Change и охват. До этого
доступны только read-only проверки; код, тесты и Store tasks не меняются.

Подробная последовательность — в [передаче разработчику](docs/developer-handoff.md).
Проект синтетический: расчёт не является банковским предложением.
