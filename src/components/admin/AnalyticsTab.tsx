import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, RefreshCw, Users, Download } from "lucide-react";
import { useAnalyticsStats } from "@/hooks/useAnalyticsStats";

const AnalyticsTab = () => {
  const { stats, loading, error, refresh } = useAnalyticsStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Analytics</h2>
          <p className="text-sm text-muted-foreground">Private stats for you (not shown publicly until you choose).</p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Failed to load analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Visitors
            </CardTitle>
            <CardDescription>Unique devices and total revisits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Unique visitors</span>
              <span className="text-2xl font-semibold">{stats.uniqueVisitors}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Total visits</span>
              <span className="text-2xl font-semibold">{stats.totalVisits}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Tip: you said you only want public display after 100 visits — right now these are admin-only.
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Downloads
            </CardTitle>
            <CardDescription>Per-asset counters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Resume</span>
              <span className="text-2xl font-semibold">{stats.resumeDownloads}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">App</span>
              <span className="text-2xl font-semibold">{stats.appDownloads}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
