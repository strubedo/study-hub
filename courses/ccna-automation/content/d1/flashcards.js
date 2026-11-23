// Domain 1 — Software Development and Design. Original flashcards (facts checked against RFC 8259, the YAML 1.2.2 spec, docs.python.org, PyYAML docs, git-scm.com and the Agile Manifesto; Python and Git behaviour confirmed by running it).
let n = 0;
const c = (topic, front, back) => ({ id: `d1-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  c('1.1', 'Five things that make JSON invalid?', 'Single quotes, comments (`//` or `#`), trailing commas, capitalised `True`/`None`, unquoted keys. Also leading zeros (`010`) and `NaN`.'),
  c('1.1', 'YAML indentation rules?', 'Spaces only, never tabs. Children indented more than the parent, siblings equally. `key: value` needs a space after the colon; `- ` starts a list item.'),
  c('1.1', 'The YAML "Norway problem"?', 'YAML 1.1 reads `NO`, `yes`, `on`, `off` as booleans, so `country: NO` becomes `false`. YAML 1.2 core schema only treats true/false as booleans. Quote ambiguous values.'),
  c('1.1', 'XML well-formed rules?', 'One root element, every tag closed (or `<x/>`), proper nesting, case-sensitive names, quoted attribute values, `&lt;` and `&amp;` for `<` and `&`.'),
  c('1.1', 'XML element vs attribute?', 'Attribute: `name="value"` inside the start tag, a single string, cannot nest or repeat. Element: can hold text and children and can repeat (how XML does lists).'),
  c('1.1', 'Which format where?', 'XML: NETCONF, SOAP (CUCM AXL). JSON: most REST APIs, RESTCONF `yang-data+json`. YAML: Ansible, Docker Compose, CI pipelines, Kubernetes.'),
  c('1.2', '`json.load` vs `json.loads`?', '`load(f)` parses from a file object; `loads(s)` parses from a string. `dump(obj, f)` writes to a file; `dumps(obj)` returns a string.'),
  c('1.2', 'JSON to Python types?', 'object→`dict`, array→`list`, string→`str`, integer→`int`, real→`float`, `true`/`false`→`True`/`False`, `null`→`None`.'),
  c('1.2', 'ElementTree Element essentials?', '`.tag` name, `.attrib` dict of strings, `.text` string or `None`, `.get("attr")`, `.find()` first match, `.findall()` list, `.iter()` whole subtree.'),
  c('1.2', 'Why does `root.findall("interface")` return []?', 'A bare tag in `findall()` matches direct children only. Use `"interfaces/interface"`, `".//interface"` or `root.iter("interface")`.'),
  c('1.2', 'xmltodict output quirks?', 'Attributes as `@name`, mixed text as `#text`, all values strings. One repeated element is a dict, two or more a list (use `force_list`).'),
  c('1.2', '`yaml.safe_load` vs `yaml.load`?', '`safe_load` builds only standard YAML types (dict, list, str, int, float, bool, None, plus dates, `!!binary` bytes and `!!set`). The full `Loader` can construct arbitrary Python objects and run code. PyYAML 6 requires `Loader=` for `load`.'),
  c('1.2', 'PyYAML results for `no`, `on`, `17.10`, `010`?', '`False`, `True`, `17.1` (float), `8` (YAML 1.1 octal). Quote them to keep strings.'),
  c('1.3', 'TDD cycle?', 'Red: write a failing test. Green: write the simplest code that passes. Refactor: clean up with tests still passing. Repeat in small steps.'),
  c('1.4', 'Agile Manifesto four values?', 'Individuals and interactions over processes and tools; working software over documentation; customer collaboration over contract negotiation; responding to change over following a plan.'),
  c('1.4', 'Seven lean software principles?', 'Eliminate waste, amplify learning, decide as late as possible, deliver as fast as possible, empower the team, build integrity in, see (optimise) the whole.'),
  c('1.4', 'Waterfall in one line?', 'Sequential phases (requirements, design, implementation, testing, deployment, maintenance) with sign-offs, fixed requirements up front, testing late, one delivery.'),
  c('1.5', 'Benefits of functions, classes, modules?', 'Functions: reuse, readability, testability. Classes: state plus behaviour, many instances, encapsulation, inheritance. Modules: reuse across programs, namespaces, separate maintainable files.'),
  c('1.5', 'What does `if __name__ == "__main__":` do?', 'Runs the block only when the file is executed directly, not when it is imported, so one file can be a library and a script.'),
  c('1.6', 'MVC roles?', 'Model: data and business rules. View: presentation. Controller: handles input, updates the model, picks the view. Advantage: separation of concerns.'),
  c('1.6', 'Observer pattern?', 'A subject keeps a list of observers and calls each one when its state changes. One-to-many, loose coupling, event-driven; webhooks apply the idea over HTTP.'),
  c('1.7', 'Advantages of version control?', 'Full history with who/when/why, rollback, diffs for review, safe collaboration and merging, branching, every clone a backup, a base for CI/CD.'),
  c('1.8', '`git rm` vs `git rm --cached`?', '`git rm f` deletes the file and stages the deletion. `git rm --cached f` untracks it but leaves it on disk; add it to `.gitignore`.'),
  c('1.8', 'Three git diff forms?', '`git diff`: working tree vs index (unstaged). `git diff --staged`: index vs HEAD (next commit). `git diff a..b`: between two commits or branches.'),
  c('1.8', '`git fetch` vs `git pull`?', '`fetch` downloads and updates `origin/*` only. `pull` = fetch + merge (or `--rebase`). With divergent branches, current Git needs `--no-rebase`, `--rebase` or `pull.rebase` set.'),
  c('1.8', 'Fast-forward vs three-way merge?', 'Fast-forward: the current branch had no new commits, so the pointer just moves; no merge commit. Three-way: both moved; Git makes a merge commit with two parents.'),
  c('1.8', 'Resolve a merge conflict?', 'Edit the file between `<<<<<<< HEAD` (current branch) and `>>>>>>> other` (incoming), delete the markers, `git add` the file, `git commit`. Or `git merge --abort`.'),
  c('1.8', 'What does `git clone` set up?', 'Full copy of the history, a remote named `origin`, remote-tracking branches `origin/*`, and a checkout of the default branch (main or master, depending on the remote).'),
];
