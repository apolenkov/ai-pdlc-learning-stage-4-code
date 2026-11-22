# Сопровождение шаблона практикума разработки

Следуйте [README](README.md) и сохраняйте разделение владельцев: planning и
tasks — в personal meta, код и runtime-тесты — в сервисе. Не добавляйте сюда
локальные OpenSpec specs/changes, снимки R3 или учебную миграцию.

Перед изменением подтвердите личную ветку, точные принятые `PLANNING_SHA` и
`SERVICE_SHA`, чистоту обеих рабочих копий и implicit Store root. Apply и
закрытие tasks допустимы только после явного разрешения и актуальных review.

Перед review выполните `npm run check`. Если machine-local Store недоступен,
можно предъявить только `npm run check:code` и явно отметить, что
`npm run check:store` не проверен. Не выдавайте CI за Store-интеграцию или
runtime/browser-приёмку.
