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

  const triggerBrowserDownload = async (fileUrl: string, fileName: string) => {
    // Prefer same-tab download (no new tab) and avoid popup blockers.
    // Use a Blob URL so Chrome treats it as a first-party download.
    try {
      const res = await fetch(fileUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
      return;
    } catch (e) {
      // Fallback: attempt a normal same-tab navigation download.
      // If a client-side blocker blocks the domain, this will still be blocked,
      // but it avoids opening a new tab.
      console.warn("Blob download failed; falling back to direct URL:", e);
      window.location.assign(fileUrl);
    }
  };

  // Increment download counter and trigger file download
  const downloadAsset = useCallback(async (
    assetKey: string,
    fileUrl: string,
    fileName?: string
  ): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      await triggerBrowserDownload(fileUrl, fileName || `${assetKey}.pdf`);

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
