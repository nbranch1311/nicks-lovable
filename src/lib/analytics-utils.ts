// Analytics utility functions for accurate visitor tracking

// Common bot/crawler user-agent patterns
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /crawling/i,
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /slackbot/i,
  /pingdom/i,
  /uptimerobot/i,
  /headless/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /lighthouse/i,
  /pagespeed/i,
  /gtmetrix/i,
  /prerender/i,
  /snapchat/i,
  /applebot/i,
  /ahrefsbot/i,
  /semrushbot/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
  /bytespider/i,
];

/**
 * Check if the current user agent indicates a bot/crawler
 */
export const isBot = (): boolean => {
  const userAgent = navigator.userAgent || "";
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
};

/**
 * Check if we're in a preview/development environment
 * Returns true for localhost, preview URLs, and non-production environments
 */
export const isPreviewEnvironment = (): boolean => {
  const hostname = window.location.hostname;
  
  // Check for localhost
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return true;
  }
  
  // Check for Lovable preview URLs (contain "preview" in subdomain)
  if (hostname.includes("-preview--") || hostname.includes(".lovableproject.com")) {
    return true;
  }
  
  // Check for common development/staging patterns
  if (
    hostname.includes("staging.") ||
    hostname.includes("dev.") ||
    hostname.includes("test.")
  ) {
    return true;
  }
  
  return false;
};

/**
 * Check if this is a new session (not just a page refresh)
 * Uses sessionStorage to track within the same browser session
 */
const SESSION_TRACKED_KEY = "portfolio_session_tracked";

export const isNewSession = (): boolean => {
  const alreadyTracked = sessionStorage.getItem(SESSION_TRACKED_KEY);
  
  if (alreadyTracked) {
    return false;
  }
  
  // Mark this session as tracked
  sessionStorage.setItem(SESSION_TRACKED_KEY, "true");
  return true;
};

/**
 * Determine if we should track this visitor
 * Returns false for bots, preview environments, or already-tracked sessions
 */
export const shouldTrackVisitor = (): boolean => {
  // Don't track bots
  if (isBot()) {
    console.log("[Analytics] Skipping bot visitor");
    return false;
  }
  
  // Don't track preview/development environments
  if (isPreviewEnvironment()) {
    console.log("[Analytics] Skipping preview environment visitor");
    return false;
  }
  
  // Don't track same-session revisits (page refreshes)
  if (!isNewSession()) {
    console.log("[Analytics] Skipping same-session revisit");
    return false;
  }
  
  return true;
};
