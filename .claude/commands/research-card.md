Use the `internship-research-publisher` skill, but run it in analysis-only mode.

Input from user:

```text
$ARGUMENTS
```

Produce a Chinese Reading Card for the paper with these sections:

- 基本信息
- Motivation
- Method
- Experimental Setup
- Results
- Ablation / Robustness
- Sensitivity / Boundary Conditions
- Limitations
- Takeaways
- Citation

Do not modify repository files, do not commit, and do not publish unless the user explicitly asks to publish after reviewing the analysis.

If `$ARGUMENTS` is empty, ask the user for the paper link, PDF path, DOI, or arXiv ID.
