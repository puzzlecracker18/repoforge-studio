from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
PROJECT_README = (ROOT / "README.md").read_text(encoding="utf-8")
README_TEMPLATE = HTML.split("const md = `", 1)[1].split("            state.generatedMarkdown", 1)[0]

class DeploySafetyTests(unittest.TestCase):
    def test_visible_banner_labels_preset_numbers_and_cpp_preview(self):
        self.assertIn("Demo data:", HTML)
        self.assertIn("illustrative, not verified", HTML)
        self.assertIn("does not compile or execute C++", HTML)

    def test_generated_readme_includes_verification_note(self):
        self.assertIn("Verify benchmark, build, license, and dependency claims before publishing", HTML)

    def test_generated_readme_turns_features_into_a_benefits_table(self):
        self.assertIn("function parseBenefitRows(featuresRaw)", HTML)
        self.assertIn("const benefitRows = parseBenefitRows(featuresRaw);", HTML)
        self.assertIn("const benefitsTableMd = buildBenefitsTable(benefitRows);", HTML)
        self.assertIn("| Capability | Benefit |", HTML)
        self.assertIn("## Benefits at a Glance", HTML)

    def test_generated_benchmark_markdown_table_has_valid_pipe_delimiters(self):
        self.assertIn("| Implementation | Metric Result | Status |", README_TEMPLATE)
        self.assertIn("| :--- | :---: | :--- |", README_TEMPLATE)
        self.assertNotIn("|| Implementation |", README_TEMPLATE)

    def test_repository_readme_documents_benefits_in_a_table(self):
        self.assertIn("| Capability | Benefit |", PROJECT_README)
        self.assertIn("| README composer |", PROJECT_README)

    def test_generated_readme_only_shows_mit_license_when_user_enables_it(self):
        self.assertIn("const licenseMd = showLic", HTML)
        self.assertIn("${licenseMd}", README_TEMPLATE)
        self.assertNotIn("Released under the **MIT License**. Crafted with **RepoForge Studio**.", README_TEMPLATE)
        self.assertNotIn("compile the native C++20 engine directly", README_TEMPLATE)
        self.assertNotIn("g++ -std=c++20 -O3 src/repoforge.cpp", README_TEMPLATE)

    def test_claim_badges_are_not_checked_by_default(self):
        for badge in ("badge-ci", "badge-license", "badge-zerodep", "badge-bench"):
            match = re.search(r'<input[^>]*id="' + badge + r'"[^>]*>', HTML)
            self.assertIsNotNone(match, badge)
            self.assertNotRegex(match.group(0), r"\bchecked\b", badge)

    def test_readiness_score_is_described_as_template_completeness(self):
        self.assertIn("Template Completeness", HTML)
        self.assertNotIn("Viral Readiness Score", HTML)

    def test_default_project_metadata_is_placeholder_not_a_false_claim(self):
        self.assertIn('value="your-username/repoforge-studio"', HTML)
        self.assertIn('value="A browser-based tool for drafting project READMEs and creating editable SVG assets."', HTML)
        self.assertNotIn('value="Zero-dependency C++20 SIMD vector & context engine running at 14.2 GB/s"', HTML)

    def test_public_guide_does_not_promise_unverified_builds_or_discovery(self):
        self.assertNotIn("Compiles in under 1.2 seconds", HTML)
        self.assertNotIn("show up when developers browse GitHub Trending", HTML)
        self.assertNotIn("zero-dependency C++20 CLI (src/repoforge.cpp)", HTML)

    def test_cpp_preview_is_explicitly_a_simulation(self):
        self.assertIn("Preview Sample Output (Simulation Only)", HTML)
        self.assertIn("SIMULATION ONLY — no compiler or C++ program was run", HTML)

if __name__ == "__main__":
    unittest.main()
