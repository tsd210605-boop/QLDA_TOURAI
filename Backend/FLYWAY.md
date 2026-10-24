# Database migrations (Flyway)

Each microservice manages its own schema via Flyway scripts in:

```
src/main/resources/db/migration/
  V1__init.sql
  V2__describe_change.sql   (future)
```

## Rules

- **Never** use `spring.jpa.hibernate.ddl-auto=update` in dev or prod.
- Use `ddl-auto=validate` so Hibernate only checks the schema matches entities.
- Add new changes as `V2__...sql`, `V3__...sql`, etc. (never edit applied migrations).

## Local first-time setup

1. Create empty MySQL databases:
   - `users_db`, `bookings_db`, `destinations_db`, `packages_db`
2. Start each service — Flyway creates tables on startup.

## Existing local databases (already had tables from Hibernate)

`spring.flyway.baseline-on-migrate=true` is enabled. On first run with Flyway:

- Flyway records a baseline and runs `V1__init.sql` (`CREATE TABLE IF NOT EXISTS` is safe).
- If Hibernate validate fails due to column mismatch, align the DB or add a `V2` migration to fix columns.

## Production

Set `SPRING_PROFILES_ACTIVE=prod` and env vars from `Backend/.env.example`.
Flyway runs automatically before the app serves traffic.

## Example: add a column later

`booking-service/src/main/resources/db/migration/V2__add_booking_status.sql`:

```sql
ALTER TABLE bookings ADD COLUMN status VARCHAR(50) DEFAULT 'PENDING';
```

Restart booking-service; Flyway applies V2 once.
