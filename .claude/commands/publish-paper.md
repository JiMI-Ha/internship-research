Use the `internship-research-publisher` skill to analyze and publish the paper or paper list provided below.

Input from user:

```text
$ARGUMENTS
```

Follow these requirements:

1. If the input is a paper URL, arXiv link, DOI, PDF, local file path, or paper title with enough metadata, create or update a Chinese Reading Card in the internship-research repository.
2. Read the full relevant paper sections before writing conclusions.
3. Use `content/templates/paper.md` as the page structure.
4. Update the relevant indexes, including `content/papers/index.md`, the topic index, parent topic index when applicable, and `content/index.md` latest-research section.
5. Run repository validation and build checks.
6. Commit and push only when the user has not explicitly said not to publish.
7. Final response must include the local path, online URL if published, commit hash if committed, and validation results.

If `$ARGUMENTS` is empty, ask the user for the paper link, PDF path, DOI, or arXiv ID.
