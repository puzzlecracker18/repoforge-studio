# RepoForge Studio

A browser-based starter for drafting project READMEs and creating editable SVG assets.

## Benefits at a glance

| Capability | Benefit |
| --- | --- |
| README composer | Turns capability descriptions into a clear feature-and-benefit table, with both a rendered preview and Markdown output. |
| SVG asset builders | Create editable hero banners, terminal illustrations, and benchmark charts from project inputs. |
| Live preview and export | Review generated content before downloading the README, SVG assets, or example C++ source. |
| Demo-data safeguards | Marks preset metrics as illustrative and keeps the C++ output preview clearly labeled as a simulation. |

## Important: demo data

The built-in project presets and benchmark figures are illustrative examples, not verified measurements or product claims. The C++ workspace generates a source example; its preview button only displays sample text and does not compile or execute the code. Replace the sample content and verify every benchmark, build, license, and dependency claim before publishing generated files.

## Run locally

Open `index.html` in a modern browser. An internet connection is needed to load the page's external Tailwind CSS and Google Fonts resources. The app itself is a static browser page; it does not connect to GitHub or require an API token.

## Checks

From the repository root, run:

```sh
python -m unittest discover -s tests -v
node tests/test_benefits_table.cjs
node tests/test_readme_render.cjs
```

## Publish

The site can be published from the repository root using GitHub Pages. The published site is public, so review the full contents before enabling it.

## License

No license has been added. Do not assume the repository is open source or reuse its code under an unprovided license.
