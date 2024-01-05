# Back-end project template

A template to create a back-end project monorepo for the specific technology stack.

---

## Getting started

This section shows how to setup this project on your device.

### Pre-requisites

-   [Node.js LTS](https://nodejs.org/en/)
-   [pnpm](https://pnpm.io/)
-   [Docker](https://www.docker.com/) or [Orb](https://orbstack.dev/)

### First steps

1. Setup environment variables - there's a quick script to help yourself:

```sh
pnpm setup:env
```

1. Create a docker image:

```sh
docker compose up
```

---

## Project structure

```text
[0] .
├── [1] .husky
├── [2] apps
├── [3] packages
└── [4] types
```

Where as:

-   `0` -> root of the project
-   `1` -> Git hooks used with [husky](https://github.com/typicode/husky)
-   `2` -> binary packages _(applications)_
-   `3` -> library packages
-   `4` -> types packages
