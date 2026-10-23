# ИИ-предпроверка R4

Подставьте значения, затем отправьте сообщение агенту Kilo из корня сервиса:

`PLANNING_SHA` ниже — SHA принятого итогового состояния R4, а не исходный SHA
R3 из planning provenance и не `IMPORT_BASE_SHA`.

```text
CHANGE=<ACCEPTED_CHANGE>
PLANNING_SHA=<40_CHARACTER_ACCEPTED_R4_PLANNING_SHA>
SERVICE_SHA=<40_CHARACTER_SERVICE_SHA>
META_DIR=<PATH_TO_EXISTING_PERSONAL_META>

Проверь, что пользователь явно назвал разрешённые service root и META_DIR, а
текущая сессия имеет доступ к обоим. Прочитай AGENTS.md, README.md, DESIGN.md,
docs/developer-handoff.md и AGENTS.md из META_DIR. Если второй root или его
AGENTS.md недоступен, остановись: Store pointer не предоставляет файловые права.
Проверь, что HEAD сервиса точно равен SERVICE_SHA, а HEAD META_DIR точно равен
PLANNING_SHA; покажи ветки и чистоту обеих рабочих копий.

Из сервиса без --store выполни openspec list --json и status --change CHANGE
--json. Подтверди root.source=declared, Store ID
sdd-credit-calculator-product-meta и одинаковый ожидаемый root. Прочитай
requirements, design и pending tasks Change в meta; код и runtime-тесты — в
настоящем сервисном checkout. .workspace используй только для чтения.

Составь inventory requirement -> scenario -> pending task -> code/runtime
check и перечисли пробелы. Не переноси planning в сервис, не создавай
specs/changes/history, не меняй регистрацию Store или defaultStore.

Это только read-only предпроверка. Не запускай Apply, не меняй код, тесты или
tasks и не делай commit/push. Закончи планом и дождись явного разрешения,
относящегося к этому CHANGE и проверенным SHA.
```

Инструкции в `.agents/skills` задают поведение инструмента, но не заменяют
принятые requirements, Change или человеческое review.
