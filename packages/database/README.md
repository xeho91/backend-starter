# `@packages/database`

This package library is for managing the database and its services in this project.

## Technology stack

-   Database Management System - [PostgreSQL]
-   Object Relational Mapping library - [Drizzle ORM]

[PostgreSQL]: https://www.postgresql.org/
[Drizzle ORM]: https://orm.drizzle.team/

---

## Getting started

> [!IMPORTANT]
> These steps focus on the **development** mode!

Help yourself by quickly setting up the database in this project.

> [!CAUTION]
> Don't start the project with these steps, follow the [guide at the root of this workspace
> `README.md`](../../README.md#getting-started)

1. Create/build a docker container and run it in the detach mode, quick script:

    ```sh
    pnpm db:start
    ```

    > [!TIP]
    > You can use the following script to stop it anytime:

    ```sh
    pnpm db:stop
    ```

1. Push database schemas:

    ```sh
    pnpm db:push
    ```

1. Run a script for database seeding, to fill it with random data:

    ```sh
    pnpm db:seed
    ```

1. Launch [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) locally to explore database:

    ```sh
    pnpm db:studio
    ```
