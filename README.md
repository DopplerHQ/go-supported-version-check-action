# Go Supported Version Check

Per the [Go documentation](https://go.dev/doc/devel/release):

> Each major Go release is supported until there are two newer major releases.
> For example, Go 1.5 was supported until the Go 1.7 release, and Go 1.6 was
> supported until the Go 1.8 release. We fix critical problems, including critical
> security problems, in supported releases as needed by issuing minor revisions
> (for example, Go 1.6.1, Go 1.6.2, and so on).

This action helps ensure your project is always running on a supported version
of Go.

## Example usage

Include this Action as a step in your workflow:

```yaml
- Go Supported Version
  uses: dopplerhq/go-supported-version-check-action@v2
  with:
    go-version: <your-Go-version>
    version-requirement: any-supported
```

## Configuration

You'll need to provide a couple different inputs:

`go-version`: The Go version being checked

`version-requirement`: The rule determining the version being checked is allowed

- `any-supported` (default): Any minor version of a supported major version
- `any-latest-supported`: Only the latest minor versions of a supported major version
- `latest-supported`: Only the latest released version

Here's an example of expected outcomes of the check when considering Go versions
`1.22.0` through `1.24.1` at the point in time when `1.24.1` was the very latest version
available.

| Version | any-supported | any-latest-supported | latest-supported |
| ------- | ------------- | -------------------- | ---------------- |
| 1.24.1  | ✅            | ✅                   | ✅               |
| 1.24.0  | ✅            | ❌                   | ❌               |
| 1.23.6  | ✅            | ✅                   | ❌               |
| 1.23.5  | ✅            | ❌                   | ❌               |
| 1.23.4  | ✅            | ❌                   | ❌               |
| 1.23.3  | ✅            | ❌                   | ❌               |
| 1.23.2  | ✅            | ❌                   | ❌               |
| 1.23.1  | ✅            | ❌                   | ❌               |
| 1.23.0  | ✅            | ❌                   | ❌               |
| 1.22.12 | ❌            | ❌                   | ❌               |
| 1.22.11 | ❌            | ❌                   | ❌               |
| 1.22.10 | ❌            | ❌                   | ❌               |
| 1.22.9  | ❌            | ❌                   | ❌               |
| 1.22.8  | ❌            | ❌                   | ❌               |
| 1.22.7  | ❌            | ❌                   | ❌               |
| 1.22.6  | ❌            | ❌                   | ❌               |
| 1.22.5  | ❌            | ❌                   | ❌               |
| 1.22.4  | ❌            | ❌                   | ❌               |
| 1.22.3  | ❌            | ❌                   | ❌               |
| 1.22.2  | ❌            | ❌                   | ❌               |
| 1.22.1  | ❌            | ❌                   | ❌               |
| 1.22.0  | ❌            | ❌                   | ❌               |

```yaml
name: Example action

on:
  pull_request:
  schedule:
    - cron: "0 0 * * *"

jobs:
  my-job:
    runs-on: ubuntu-latest

    steps:
      - name: Go Supported Version
        uses: dopplerhq/go-supported-version-check-action@v2
        with:
          go-version: 1.23.1
          version-requirement: any-supported
```
