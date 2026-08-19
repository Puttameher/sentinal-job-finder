"""Structural Schema Drift Detector.

Analyzes raw incoming payloads against source-specific expected schema signatures.
Detects unexpected key migrations, missing core identifiers, and produces detailed
diagnostic drift telemetry.
"""

from collections import Counter
from datetime import datetime
import logging
from typing import Any, Dict, List, Set
from ..models.drift import DriftReport, FieldDriftInfo

logger = logging.getLogger(__name__)


class SchemaDriftDetector:
    """
    Evaluates raw batches to detect if an upstream source's schema has drifted or mutated.
    """

    def __init__(self, drift_threshold_pct: float = 40.0):
        self.drift_threshold_pct = drift_threshold_pct

    def detect_drift(
        self,
        source_name: str,
        expected_keys: List[str],
        raw_records: List[Dict[str, Any]],
        validation_rejection_count: int
    ) -> DriftReport:
        if not raw_records:
            return DriftReport(
                source_name=source_name,
                drift_detected=False,
                severity="LOW",
                total_records_analyzed=0,
                summary="No records in batch to evaluate for schema drift."
            )

        total_records = len(raw_records)
        expected_set = set(expected_keys)
        all_observed_keys: Counter = Counter()

        # Count frequencies of observed keys across raw items
        for record in raw_records:
            if isinstance(record, dict):
                for k in record.keys():
                    all_observed_keys[k] += 1

        missing_fields: List[str] = []
        field_details: List[FieldDriftInfo] = []

        for expected in expected_keys:
            count = all_observed_keys.get(expected, 0)
            missing_pct = ((total_records - count) / total_records) * 100.0
            
            if missing_pct >= self.drift_threshold_pct:
                missing_fields.append(expected)
                
                # Look for candidate alternate fields observed in raw payload
                observed_candidates = [
                    k for k, c in all_observed_keys.items()
                    if k not in expected_set and (c / total_records) >= 0.5
                ]
                
                samples = [
                    rec.get(cand) for rec in raw_records[:3]
                    for cand in observed_candidates if isinstance(rec, dict) and cand in rec
                ][:3]

                field_details.append(
                    FieldDriftInfo(
                        expected_field=expected,
                        observed_field_candidates=observed_candidates,
                        missing_frequency_pct=round(missing_pct, 1),
                        sample_values=samples
                    )
                )

        # Detect new keys that appear in >= 60% of records
        unexpected_keys = [
            k for k, count in all_observed_keys.items()
            if k not in expected_set and (count / total_records) >= 0.6
        ]

        # Determine severity & drift flag
        drift_detected = False
        severity = "LOW"
        
        # If any essential expected key is missing in > 50% of records and rejected count > 0
        if len(missing_fields) > 0 and (validation_rejection_count > 0 or len(unexpected_keys) > 0):
            drift_detected = True
            if len(missing_fields) >= 2 or validation_rejection_count >= (total_records * 0.7):
                severity = "CRITICAL"
            else:
                severity = "MEDIUM"

        sample_schema = raw_records[0] if raw_records and isinstance(raw_records[0], dict) else {}

        if drift_detected:
            summary = (
                f"Schema Drift Alert [{severity}]: Source '{source_name}' missing expected fields: "
                f"{missing_fields}. Observed candidate replacement fields: {unexpected_keys}."
            )
            logger.warning(f"[SchemaDriftDetector] {summary}")
        else:
            summary = f"Source '{source_name}' schema is stable. All expected keys matched."

        return DriftReport(
            source_name=source_name,
            drift_detected=drift_detected,
            severity=severity,
            detected_at=datetime.utcnow(),
            total_records_analyzed=total_records,
            missing_required_fields=missing_fields,
            unexpected_new_fields=unexpected_keys,
            field_details=field_details,
            observed_schema_sample=sample_schema,
            summary=summary
        )
