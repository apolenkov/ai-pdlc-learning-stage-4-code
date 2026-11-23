# Передача сервиса разработчику: практикум разработки

R4 начинается с нового сервисного репозитория и уже существующего personal
meta. Миграции repo-local planning, archive или истории из R3 нет.

## 1. Получите точные входы

Организатор передаёт:

- `SERVICE_SHA` из `ai-pdlc-learning-stage-4-code`;
- `PLANNING_SHA` принятого итогового состояния R4 в
  `ai-pdlc-learning-stage-4-requirements`;
- имя разрешаемого `CHANGE`;
- пути к соседним requirements и уже подготовленному code checkout;
- явно разрешённые roots сервиса и personal meta для текущей сессии;
- результаты review требований/tasks и сервисного baseline.

Здесь `PLANNING_SHA` означает принятый итоговый SHA R4 после review, а не
исходный `PLANNING_SHA` R3 из provenance и не `IMPORT_BASE_SHA`, с которого
начался анализ.

## 2. Используйте подготовленный checkout и создайте личную ветку

Полный requirements skill `setup-analysis-workspace` уже создал рядом code
checkout на service pin, выполнил `npm ci` и проверил baseline. Выполняйте блок
из корня принятого requirements checkout. Он не заменяет существующую папку и
останавливается при неверном origin, SHA или локальных изменениях.

```bash
set -eu
test "$(git rev-parse --show-toplevel)" = "$(pwd -P)"
META_DIR="$(pwd -P)"
CODE_DIR="$(dirname "$META_DIR")/ai-pdlc-learning-stage-4-code"
SERVICE_REPOSITORY='https://github.com/apolenkov/ai-pdlc-learning-stage-4-code.git'
SERVICE_SHA='<40_CHARACTER_SERVICE_SHA>'
PLANNING_SHA='<40_CHARACTER_ACCEPTED_R4_PLANNING_SHA>'
CHANGE='<ACCEPTED_CHANGE>'
PERSONAL_BRANCH='course/<login>/stage-4-<change>'

git -C "$META_DIR" cat-file -e "$PLANNING_SHA^{commit}"
test "$(git -C "$META_DIR" rev-parse HEAD)" = "$PLANNING_SHA"
git -C "$META_DIR" status --short --branch
meta_status="$(git -C "$META_DIR" status --porcelain=v1 --untracked-files=all)"
test -z "$meta_status"

test -d "$CODE_DIR"
test "$(git -C "$CODE_DIR" rev-parse --show-toplevel)" = "$CODE_DIR"
test "$(git -C "$CODE_DIR" remote get-url origin)" = "$SERVICE_REPOSITORY"
git -C "$CODE_DIR" cat-file -e "$SERVICE_SHA^{commit}"
test "$(git -C "$CODE_DIR" rev-parse HEAD)" = "$SERVICE_SHA"
code_status="$(git -C "$CODE_DIR" status --porcelain=v1 --untracked-files=all)"
test -z "$code_status"

git -C "$CODE_DIR" switch -c "$PERSONAL_BRANCH" "$SERVICE_SHA"
test "$(git -C "$CODE_DIR" rev-parse HEAD)" = "$SERVICE_SHA"
git -C "$CODE_DIR" status --short --branch
cd "$CODE_DIR"
```

### Если подготовленной папки кода нет

Это recovery после неполной подготовки, а не основной маршрут. Из корня
requirements повторно задайте переменные выше и выполните только при полностью
отсутствующем `CODE_DIR`:

```bash
set -eu
test ! -e "$CODE_DIR"
git clone --no-checkout "$SERVICE_REPOSITORY" "$CODE_DIR"
git -C "$CODE_DIR" cat-file -e "$SERVICE_SHA^{commit}"
git -C "$CODE_DIR" checkout --detach "$SERVICE_SHA"
test "$(git -C "$CODE_DIR" rev-parse HEAD)" = "$SERVICE_SHA"
cd "$CODE_DIR"
npm ci
npm run check:code
cd "$META_DIR"
```

После recovery вернитесь к основному блоку и выполните все проверки до
создания ветки. Если путь существует, но это не ожидаемый чистый checkout, не
клонируйте поверх него. Текущая сессия должна иметь доступ к обоим разрешённым
root и прочитать `AGENTS.md` сервиса и personal meta. Store pointer выбирает
planning root, но не предоставляет доступ к его файлам. Остановитесь при
недоступном root, несовпадении SHA, неожиданной ветке или чужих изменениях. Не
переключайте personal meta, не сбрасывайте его и не подставляйте другой commit.

## 3. Докажите declared Store и baseline

```bash
npm exec openspec -- list --json
npm exec openspec -- status --change "$CHANGE" --json
npm run check:code
npm run check:store
```

OpenSpec-команды намеренно не используют `--store`: оба результата должны
показать `root.source = declared`, Store ID из `openspec/config.yaml` и один
ожидаемый root. `check:code` проверяет автономный baseline и config-only
инвариант; `check:store` требует machine-local регистрацию и выполняет implicit
`list`/`status --all`. Числа сценариев и tasks сверяйте с конкретным принятым
Change, не с шаблонной константой.

Если Store не найден или root другой, остановитесь. Не запускайте `store
register`, не меняйте `defaultStore` и не создавайте локальный planning.

## 4. Gate перед Apply

До Apply должны одновременно выполняться условия:

1. HEAD personal meta равен принятому `PLANNING_SHA`, а review требований и
   tasks относится к нему.
2. Личная ветка сервиса создана от точного `SERVICE_SHA`, а review baseline
   кода и runtime-тестов относится к нему.
3. Владелец явно разрешил Apply конкретного `CHANGE` и назвал охват.
4. Текущей сессии явно разрешены оба root, и прочитаны оба `AGENTS.md`.
5. Обе рабочие копии чисты, а `.workspace` остаётся read-only.

До выполнения gate разрешены только чтение и проверки. Нельзя менять код,
runtime-тесты, Store tasks или запускать Apply.

## 5. Граница разрешённой реализации

После отдельного разрешения:

- requirements, design и tasks читаются и изменяются только в personal meta;
- реализация и runtime-тесты меняются только в этом сервисном checkout;
- task отмечается выполненной лишь после соответствующей проверки;
- `npm run check`, runtime- и браузерные доказательства фиксируются для точного
  итогового SHA сервиса;
- planning validation и review фиксируются отдельно для точного SHA meta.

Commits, push, MR, merge, archive и обновление service pin остаются отдельными
действиями в разрешённых репозиториях. OpenSpec Store не объединяет их
автоматически.
