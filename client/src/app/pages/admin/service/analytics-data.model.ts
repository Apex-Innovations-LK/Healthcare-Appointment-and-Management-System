export interface AnalyticsData {
    patientCountTimeline: { date: string; count: number }[];
    allergiesDistribution: Record<string, number>;
    problemListCounts:    Record<string, number>;
    problemListBySex:     Record<string, Record<string, number>>;
  }
