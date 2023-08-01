# OmniChannelCommunication Project GUI

This project was generated with Angular CLI.

## Table of contents

- [Packages Used](#included-packages-for-development-and-usability)
- [Development](#develop)
- [Building](#build)
- [Testing](#running-unit-tests)
- [Changelog generator](#modify-the-changelog.md-file)
- [Aid for tagging and versioning](#aiding-with-tagging)
- [Process for versioning and changelog update](#proper-process-for-version-changing-and-generating-changelog-updates)

## Included packages for development and usability

- Angular 10.1.5
- Angular Material 10.2.4
- Bootstrap Sass 4.5.2
- ngBootstrap 7.0.0
- Animate Sass 0.8.2

## Included packages for testing, coverage and proper coding

- Jasmine 3.6.0
- Karma 5.2.3
- Prettier 2.1.2
- Husky 4.3.0
- Codelyzer 6.0.1

## Help

Please DO consider change from using `NPM` to using `Yarn`. It is also a package manager, although it is more modern,
and it do give async package managament while npm does not. It is also a very high chance Yarn can eliminate dependency
errors with different package installations and also the time for package installing is much less, about 1/4 or 1/5
of the time NPM needs.

There are similar commands to use also, just a small table for comparison:
| Command | NPM | Yarn |
| --- | --- | --- |
| Install dependencies | `npm install` | `yarn` |
| Install package | `npm install [package]` | `yarn add [package]` |
| Install Dev package | `npm install --save-dev [package]` | `yarn add --dev [package]` |
| Uninstall package | `npm uninstall [package]` | `yarn remove [package]` |
| Uninstall Dev package | `npm uninstall --save-dev [package]` | `yarn remove [package]` |
| Update | `npm update` | `yarn upgrade` |
| Update package | `npm update [package]` | `yarn upgrade [package]` |
| Global install package | `npm install --global [package]` | `yarn global add [package]` |
| Global uninstall package | `npm uninstall --global [package]` | `yarn global remove [package]` |

Also luckily there are some similar commands:
| NPM | Yarn |
| --- | --- |
| `npm init` | `yarn init` |
| `npm run` | `yarn run` |
| `npm login (and logout)` | `yarn login (and logout)` |
| `npm link` | `yarn link` |
| `npm publish` | `yarn publish` |
| `npm cache clean` | `yarn cache clean` |

### Develop

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io). This also generates a
coverage report which can be accessed from the `appRoot/coverage/index.html` via your browser.

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Modify the changelog file

Changelog file is often used as container for new features, fixes, removals, improvements, code coverage changes for release documentations. Its meaning is to add human and machine readable meaning to commit messages.

There are several known prefix for special commit messages, from which an automated script could enerate an updated changelod file for each release, and this file could be included in the release documentation hence it is always up to date.

For proper usage, the commit message should be structured as follows:

```bash
<type>[optional scope]: <description>
[optional body]
[optional footer]
```

> It is important, that without the specific commit prefixes, the automatic changelog can't work.

The commit contains the following structural elements, to communicate intent to the consumers of your library:

1. **fix:** a commit of the type `fix` patches a bug in your codebase (this correlates with **PATCH** in semantic versioning)
2. **feat:** a commit of the type `feat` introduces a new feature to the codebase (this correlates with **MINOR** in semantic versioning)
3. **BREAKING CHANGE:** a commit that has the text `BREAKING CHANGE` at the beginning of its optional body or footer section introduces a breaking API change (correlating with **MAJOR** in semantic versioning). A BREAKING CHANGE can be part of commits of any type
4. Others: commit types other than `fix` and `feat` are allowed, for example: `chore`, `docs`, `style`, `refactor`, `perf`, `test`, and others

### Commiting with special messages for changelog usage

We can use one of the followings as `type` for prefix messages:

```json
["build", "ci", "chore", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]
```

- These prefixes MUST be typed in lower case in order to work.
- It is also very important to not add dot `.` at the end of the special message, as it fails to comply.
- The maximum length for the header is 100 character. We should stay below this value, otherwise it fails to comply.

### Example commits with recognised prefixes

You should always use these within the well-known Git commit guideline. Also when you push message with proper header, body and footer parts, use a blank line between them for separation.

`git commit -m "prefix(scope): commit message"`

#### Commit with only header

`docs: correct spelling of CHANGELOG`

#### Commit with scope

`feat(lang): add irish language`

#### Commit with description and breaking change in body

```bash
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

#### Commit with optional ! to draw attention to breaking change

```bash
chore!: drop Node 8 from testing matrix

BREAKING CHANGE: dropping Node 8 which hits end of life in April
```

## Proper process for version changing and generating changelog updates

Keeping in mind the content of the special message use for changelog generator, we can use these new features together in an efficient way:

1. Add each modification from your branch to the commit
2. Created a proper, prefixed commit message which will describe all your work there (Please note you don't have to write each commit like this, but the most describing ones which will be shown in the changelog and release documentation **must** be written with prefixes)
3. Tag up the actual state of your commited work for the new version / build so Git will know there will be a new version change
4. Depending on which version change you would like to make, run the proper versioning command.
5. After the proper versioning, there is **nothing to be done**! The script itself adds the tag and commits the changed files after auto-generation. The code is ready to be pushed to the remote branch, reviewd and merged.

For a **path** change, please see the following example:

```bash
npm run generate --path
git push
```

For a **minor** change, please see the following example:

```bash
npm run generate --minor
git push
```

For a **major** change, please see the following example:

```bash
npm run generate --major
git push
```

It is very important, to make sure, there is one tag at least already added, before running the version upgrade script!

For the tags to be available independently from the BitBucket repository, please use the `git push --tags` command to push each tags to the remote repository. It will be available later under the projects Tag page.

With any further question, feel free to open an issue or email me directly.

## Aiding with tagging

In order to use the automated versioning script, there **must** be one tag at least in the repository.

You can read detailed readme about [GIT tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging) here.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
