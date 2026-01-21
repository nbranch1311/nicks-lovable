import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsStats {
  uniqueVisitors: number;
  totalVisits: number;
  resumeDownloads: number;
  appDownloads: number;
}

const emptyStats: AnalyticsStats = {
  uniqueVisitors: 0,
  totalVisits: 0,
  resumeDownloads: 0,
  appDownloads: 0,
};

export const useAnalyticsStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AnalyticsStats>(emptyStats);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Visitors
      const { data: sessions, error: sessionsErr } = await supabase
        .from("visitor_sessions")
        .select("visitor_id,visit_count");

      if (sessionsErr) throw sessionsErr;

      const uniqueVisitors = sessions?.length ?? 0;
      const totalVisits = (sessions ?? []).reduce((sum, row) => sum + (row.visit_count ?? 0), 0);

      // Downloads
      const { data: downloads, error: downloadsErr } = await supabase
        .from("asset_downloads")
        .select("asset_key,download_count");

      if (downloadsErr) throw downloadsErr;

      const byKey = new Map<string, number>();
      (downloads ?? []).forEach((d) => byKey.set(d.asset_key, d.download_count ?? 0));

      setStats({
        uniqueVisitors,
        totalVisits,
        resumeDownloads: byKey.get("resume") ?? 0,
        appDownloads: byKey.get("app") ?? 0,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load analytics";
      console.error("Analytics refresh error:", e);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
};
