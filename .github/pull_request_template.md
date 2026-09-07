## Охват

- Change: `<CHANGE>`
- Planning SHA: `<40_CHARACTER_PLANNING_SHA>`
- Service base SHA: `<40_CHARACTER_SERVICE_SHA>`
- Service result SHA: `<40_CHARACTER_RESULT_SHA>`

## Изменения

Перечислите изменённые файлы сервиса и связанные выполненные tasks в personal
meta. Подтвердите, что `.workspace` и локальный planning сервиса не менялись.

## Доказательства

- [ ] `npm run check:code` — фактический результат приложен.
- [ ] `npm run check:store` — фактический локальный результат приложен либо
      явно отмечен как непроверенный из-за отсутствия machine-local registry.
- [ ] Runtime/browser-сценарии перечислены с фактическими результатами.
- [ ] Planning validation привязана к указанному Planning SHA.

## Review

- [ ] Review requirements и tasks относится к указанному Planning SHA.
- [ ] Review кода и runtime-доказательств относится к Service result SHA.
- [ ] Разрешённый охват Apply не расширен.
