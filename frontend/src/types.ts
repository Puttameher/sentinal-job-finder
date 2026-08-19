export interface Job {
  id: string;
  source: string;
  external_id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  posted_at?: string;
  description?: string;
  tags: string[];
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  employment_type?: string;
  raw_preview?: Record<string, any>;
}

export interface IngestionResponse {
  jobs: Job[];
  total_count: number;
  source_used: string;
  fallback_activated: boolean;
  fallback_chain: string[];
  latency_ms: number;
  validation_rate: number;
  health_state: string;
  timestamp: string;
}

export interface SourceMetrics {
  source_name: string;
  circuit_state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  health_state: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  health_score: number;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  consecutive_failures: number;
  consecutive_successes: number;
  empty_responses: number;
  total_records_ingested: number;
  total_records_valid: number;
  total_records_rejected: number;
  last_latency_ms: number;
  avg_latency_ms: number;
  last_success_timestamp?: string;
  last_failure_timestamp?: string;
  last_error_message?: string;
  circuit_tripped_count: number;
  last_circuit_trip_timestamp?: string;
  cooldown_remaining_seconds: number;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  source: string;
  action: string;
  message: string;
  details?: Record<string, any>;
}

export interface SystemHealthResponse {
  overall_health: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  active_primary_source: string;
  sources: Record<string, SourceMetrics>;
  recent_events: TelemetryEvent[];
  total_pipeline_requests: number;
  fallback_rate: number;
}

export interface FieldMappingSuggestion {
  canonical_field: string;
  suggested_source_field: string;
  confidence: number;
  reasoning: string;
}

export interface DriftDiagnosisResponse {
  source_name: string;
  analysis: string;
  suggested_mappings: FieldMappingSuggestion[];
  suggested_adapter_patch?: string;
  ai_generated: boolean;
  model_used: string;
}
