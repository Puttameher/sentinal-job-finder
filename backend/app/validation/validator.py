"""Batch Record Validation and Fault Isolation.

Validates normalized job entities against typed Pydantic models. Malformed records
are isolated into rejection issues without corrupting or halting the entire batch.
"""

import logging
from typing import Any, Dict, List, Optional
from pydantic import ValidationError

from ..models.job import BatchValidationResult, Job, ValidationIssue

logger = logging.getLogger(__name__)


class BatchValidator:
    """
    Typed batch validator ensuring only well-formed job models reach the frontend.
    """

    @staticmethod
    def validate_batch(
        candidates: List[Optional[Job]],
        raw_records: Optional[List[Dict[str, Any]]] = None
    ) -> BatchValidationResult:
        valid_jobs: List[Job] = []
        rejected_issues: List[ValidationIssue] = []
        
        total = len(candidates)
        if total == 0:
            return BatchValidationResult(
                total_received=0,
                valid_count=0,
                rejected_count=0,
                valid_jobs=[],
                rejected_issues=[],
                validation_rate=100.0
            )

        for idx, candidate in enumerate(candidates):
            raw_sample = raw_records[idx] if raw_records and idx < len(raw_records) else None

            if candidate is None:
                rejected_issues.append(
                    ValidationIssue(
                        external_id=str(raw_sample.get("id") or raw_sample.get("job_id") or f"row-{idx}") if raw_sample else f"row-{idx}",
                        field="record",
                        error="Normalization failed: Missing essential required fields (title, company, external_id, or valid URL)",
                        raw_sample=raw_sample
                    )
                )
                continue

            # Check explicit business invariants
            if len(candidate.title.strip()) < 2:
                rejected_issues.append(
                    ValidationIssue(
                        external_id=candidate.external_id,
                        field="title",
                        error="Title is too short or blank",
                        raw_sample=candidate.raw_preview
                    )
                )
                continue

            if not candidate.company.strip():
                rejected_issues.append(
                    ValidationIssue(
                        external_id=candidate.external_id,
                        field="company",
                        error="Company name cannot be blank",
                        raw_sample=candidate.raw_preview
                    )
                )
                continue

            if not (candidate.url.startswith("http://") or candidate.url.startswith("https://")):
                rejected_issues.append(
                    ValidationIssue(
                        external_id=candidate.external_id,
                        field="url",
                        error=f"Malformed URL scheme: {candidate.url}",
                        raw_sample=candidate.raw_preview
                    )
                )
                continue

            valid_jobs.append(candidate)

        valid_count = len(valid_jobs)
        rejected_count = len(rejected_issues)
        validation_rate = round((valid_count / total) * 100.0, 1) if total > 0 else 100.0

        if rejected_count > 0:
            logger.info(
                f"[BatchValidator] Validated {valid_count}/{total} records ({validation_rate}% valid, {rejected_count} rejected)"
            )

        return BatchValidationResult(
            total_received=total,
            valid_count=valid_count,
            rejected_count=rejected_count,
            valid_jobs=valid_jobs,
            rejected_issues=rejected_issues,
            validation_rate=validation_rate
        )
