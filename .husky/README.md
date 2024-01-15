# husky

This directory contains [Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) powered by [husky].

[husky]: https://github.com/typicode/husky

---

## Hooks

-   `pre-commit` - is run first, before you even type in a commit message.

> [!CAUTION]
> To omit this hook, pass the `--no-verify` flag
> with any CLI tool you're using to create Git commit messages.\
> However, please, use it wisely, **is not recommended to abuse it**.
