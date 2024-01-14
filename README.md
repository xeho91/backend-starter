# Back-end starter

A template to create a back-end project workspace _(a.k.a. "monorepo")_ for the specific technology stack.

## Technology stack

> [!CAUTION]
> 🚧 Under construction

---

## Project structure

Below is a quick navigation on how to navigate this project **directories**.

```text
.
├── [1] .husky
├── [2] apps
├── [3] packages
└── [4] types
```

Where as:

-   `1` -> Git hooks used with [husky](https://github.com/typicode/husky)
-   `2` -> [binary packages _(applications)_](./apps/README.md)
-   `3` -> [library packages](./packages/README.md)
-   `4` -> types for the workspace

---

## Getting started

This section shows how to setup this project on your device.

### Pre-requisites

-   [Node.js LTS](https://nodejs.org/en/)
-   [pnpm](https://pnpm.io/)
-   [Docker](https://www.docker.com/) or [Orb](https://orbstack.dev/)

### First steps

1. Setup environment variables:

    ```sh
    pnpm setup:env
    ```

    > ![INFO]
    > Tthis is a custom script, which can be found in the
    > [@packages/config/README.md](./packages/config/README.md#scripts).

1. Build the packages _(both binaries and libraries)_:

    ```sh
    pnpm build
    ```

1. Setup the database:

    ```sh
    pnpm setup:db
    ```

    > ![INFO]
    > The detailed instructions related to database can be found in the [@packages/database/README.md](./packages/database/README.md#getting-started).
