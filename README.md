# Back-end starter

A template to create a back-end project workspace _(a.k.a. "monorepo")_ for the specific technology stack.

> [!CAUTION]
> 🚧 Under construction

---

## Technology stack

Below is the list for the **shared dependencies** used in the project.

### Dependencies

-   [Zod] - schema validation with static type inference

[zod]: https://github.com/colinhacks/zod

### Dev dependencies

-   [TypeScript] - superset of JavaScript that compiles to clean JavaScript output

### Optional dependencies

-   [TypeDoc] - documentation generator
-   [Vitest] - testing framework

[typedoc]: https://github.com/TypeStrong/typedoc
[vitest]: https://github.com/vitest-dev/vitest

---

## Project structure

Below is a quick navigation on how to navigate this project **directories**.

```text
.
├── [1] .husky
├── [2] apps
├── [3] coverage
├── [4] docs
├── [5] packages
└── [6] types
```

Where as:

-   `1` -> Git hooks used with [husky](https://github.com/typicode/husky)
-   `2` -> [binary packages _(applications)_](./apps/README.md)
-   `3` -> auto-generated _(by [Vitest])_ tests coverage _(ignored by default via `.gitignore`,)_
-   `4` -> auto-generated _(by [TypeDoc])_ documentation site _(ignored by default via `.gitignore`)_
-   `5` -> [library packages](./packages/README.md)
-   `6` -> types for the workspace

---

## Getting started

This section shows how to setup this project on your device.

### Pre-requisites

-   [Node.js LTS](https://nodejs.org/en/)
-   [pnpm](https://pnpm.io/)
-   [Docker](https://www.docker.com/) or [Orb](https://orbstack.dev/)

### First steps

1. Install the workspace dependencies:

    ```sh
     pnpm install
    ```

1. Setup environment variables:

    ```sh
    pnpm setup:env
    ```

    > ![INFO]
    > This is a custom script, which can be found in the
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
