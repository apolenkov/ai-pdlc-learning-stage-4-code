# Передача сервиса R4 разработчику

R4 начинается с нового сервисного репозитория и уже существующего personal
meta. Миграции repo-local planning, archive или истории из R3 нет.

## 1. Получите точные входы

Организатор передаёт:

- `SERVICE_SHA` из `sdd-credit-calculator-stage-4-example`;
- `PLANNING_SHA` принятого состояния personal meta;
- имя разрешаемого `CHANGE`;
- путь к соседнему personal meta с уже зарегистрированным Store;
- явно разрешённые roots сервиса и personal meta для текущей сессии;
- результаты review требований/tasks и сервисного baseline.

## 2. Клонируйте сервис на pin и создайте личную ветку

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

Текущая сессия должна иметь доступ к обоим разрешённым root и прочитать
`AGENTS.md` сервиса и personal meta. Store pointer выбирает planning root, но
не предоставляет доступ к его файлам. Остановитесь при недоступном root,
несовпадении SHA, неожиданной ветке или чужих изменениях. Не переключайте
personal meta, не сбрасывайте его и не подставляйте другой commit.

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

Commits, push, PR, merge, archive и обновление service pin остаются отдельными
действиями в разрешённых репозиториях. OpenSpec Store не объединяет их
автоматически.
