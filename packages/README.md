# Packages

Library packages.

> [!NOTE]
> All of the library packages are **prefixed with `@packages/`**.

```text
../
.
├── [1] config
├── [2] core
├── [3] database
├── [4] logger
├── [5] path
├── [6] units
└── [7] utils
```

Where as:

-   [`../`](../README.md) - project workspace root
-   [`[1] config`](./config/README.md) -> Package `@packages/config` focused on the project configuration
-   [`[2] core`](./core/README.md) -> Package `@packages/core` with fundamental structures used in the project
-   [`[3] database`](./database/README.md) -> Package `@packages/database` dedicated to using the database in the project
-   [`[4] logger`](./logger/README.md) -> Package `@packages/logger` isolating the universal logger
-   [`[6] path`](./path/README.md) -> Package `@packages/path` focused on defining the absolute paths for this project
-   [`[5] units`](./units/README.md) -> Package `@packages/units` with smaller and modular units
-   [`[7] utils`](./utils/README.md) -> Package `@packages/utils` with reusable snippets
