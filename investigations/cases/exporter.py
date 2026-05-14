from datetime import datetime
from typing import Optional
from investigations.models import InvestigationCase, InvestigationReport

class InvestigationExporter:
    """
    Exports investigation cases and replay summaries into structured formats.
    """
    def export_as_markdown(self, case: InvestigationCase) -> str:
        md = f"# Investigation Case: {case.title}\n"
        md += f"Status: {case.status.upper()} | Created: {case.created_at.isoformat()}\n\n"
        md += "## Replay Interval\n"
        md += f"Start: {case.replay_interval[0].isoformat()} | End: {case.replay_interval[1].isoformat()}\n\n"

        md += "## Annotations\n"
        for ann in case.annotations:
            md += f"- [{ann['timestamp']}] {ann['text']}\n"

        md += "\n## Reasoning Summaries\n"
        for res in case.reasoning_summaries:
            md += f"> {res}\n\n"

        return md

    def generate_report(self, case: InvestigationCase) -> InvestigationReport:
        # Full structured payload for archival
        payload = {
            "case_id": case.id,
            "title": case.title,
            "interval": [case.replay_interval[0].isoformat(), case.replay_interval[1].isoformat()],
            "event_chain": case.evidence_references,
            "annotations": case.annotations,
            "summaries": case.reasoning_summaries,
            "context_snapshots": case.context_snapshots,
            "comparisons": case.historical_comparisons,
            "parent_id": case.parent_case_id,
            "child_ids": case.child_case_ids,
            "macro_catalysts": case.related_catalysts,
            "metadata": case.metadata
        }

        return InvestigationReport(
            case_id=case.id,
            generated_at=datetime.now(),
            summary_markdown=self.export_as_markdown(case),
            data_payload=payload
        )

    def save_report(self, report: InvestigationReport, directory: str = "storage/reports/"):
        import os
        import json
        os.makedirs(directory, exist_ok=True)

        # Save Markdown
        md_path = os.path.join(directory, f"{report.case_id}_report.md")
        with open(md_path, 'w') as f:
            f.write(report.summary_markdown)

        # Save Data Payload
        json_path = os.path.join(directory, f"{report.case_id}_payload.json")
        with open(json_path, 'w') as f:
            json.dump(report.data_payload, f, indent=4)
