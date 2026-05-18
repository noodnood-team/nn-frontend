export interface DashboardSummary {
  range_start: string;
  range_end: string;
  total_requests: number;
  success_count: number;
  outcome_counts: Array<{ outcome: string; count: number }>;
  nutrition_averages: {
    avg_calories: number;
    avg_protein: number;
    avg_carbs: number;
    avg_fat: number;
  } | null;
}

export interface PredictionItem {
  id: string;
  created_at: string;
  outcome: string;
  ok: boolean;
  message: string;
  filename: string | null;
  content_type: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  detail: string | null;
  rating: 'like' | 'unlike' | null;
}

export interface PredictionsResponse {
  items: PredictionItem[];
  total: number;
  limit: number;
  offset: number;
}
