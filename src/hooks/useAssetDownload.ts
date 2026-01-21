import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentVisitorId } from "./useVisitorTracking";

export interface DownloadStats {
  assetKey: string;
  downloadCount: number;
}

export const useAssetDownload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Increment download counter and trigger file download
  const downloadAsset = useCallback(async (
    assetKey: string,
    fileUrl: string,
    fileName?: string
  ): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      // IMPORTANT: trigger the download synchronously on the user gesture.
      // If we await first, Chrome may treat it as a popup and block it.
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName || assetKey;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const visitorId = getCurrentVisitorId();

      // Increment the download counter (safe to await after the download is triggered)
      const { data, error: rpcError } = await supabase.rpc("increment_download", {
        p_asset_key: assetKey,
        p_visitor_id: visitorId,
      });

      if (rpcError) {
        console.error("Error incrementing download:", rpcError);
        setError(rpcError.message);
      }

      return data as number | null;
    } catch (err) {
      console.error("Error downloading asset:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get current download count for an asset
  const getDownloadCount = useCallback(async (assetKey: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("asset_downloads")
        .select("download_count")
        .eq("asset_key", assetKey)
        .maybeSingle();

      if (error) {
        console.error("Error fetching download count:", error);
        return 0;
      }

      return data?.download_count ?? 0;
    } catch (err) {
      console.error("Error in getDownloadCount:", err);
      return 0;
    }
  }, []);

  return {
    downloadAsset,
    getDownloadCount,
    loading,
    error,
  };
};
