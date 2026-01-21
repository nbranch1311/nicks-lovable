import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_ID_KEY = "portfolio_visitor_id";

// Generate a unique visitor ID
const generateVisitorId = (): string => {
  return crypto.randomUUID();
};

// Get or create visitor ID from localStorage
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

export interface VisitorStats {
  uniqueVisitors: number;
  visitorId: string;
}

export const useVisitorTracking = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const visitorId = getVisitorId();
        
        // Call the RPC function to track visitor
        const { data, error: rpcError } = await supabase.rpc("track_visitor", {
          p_visitor_id: visitorId,
        });

        if (rpcError) {
          console.error("Error tracking visitor:", rpcError);
          setError(rpcError.message);
          return;
        }

        if (data) {
          setStats({
            uniqueVisitors: data.unique_visitors,
            visitorId: data.visitor_id,
          });
        }
      } catch (err) {
        console.error("Error in visitor tracking:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    trackVisitor();
  }, []);

  return { stats, loading, error };
};

// Export helper to get current visitor ID without tracking
export const getCurrentVisitorId = (): string => {
  return getVisitorId();
};
