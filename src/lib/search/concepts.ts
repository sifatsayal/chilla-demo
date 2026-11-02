// Concept groups let a query like "billing" also match "stripe" or "checkout".
// The first entry is the label Chilla shows to the user ("…about payments").
// Add a group, or extend one, to teach the search new vocabulary.

export const concepts: string[][] = [
  ["payments", "payment", "pay", "billing", "stripe", "adyen", "checkout", "card", "cards", "transaction", "processor", "retry", "retries", "dunning", "ledger", "reconciliation", "payouts", "ach", "wire", "chargebacks"],
  ["authentication", "auth", "sso", "saml", "oauth", "oidc", "login", "identity", "okta", "security", "permissions", "rbac", "roles", "access"],
  ["data & analytics", "data", "analytics", "metrics", "dashboard", "dashboards", "reporting", "warehouse", "snowflake", "dbt", "pipeline", "pipelines", "tracking", "events", "instrumentation", "sql"],
  ["AI & ML", "ai", "ml", "machine learning", "model", "models", "llm", "fraud", "risk", "automation"],
  ["reliability", "reliability", "incident", "incidents", "outage", "uptime", "sre", "infrastructure", "infra", "kubernetes", "load test", "load testing", "performance", "latency", "scaling", "on-call", "postmortem"],
  ["design", "design", "designer", "ux", "ui", "figma", "design system", "components", "accessibility", "a11y", "prototype", "mockups"],
  ["user research", "research", "researcher", "interviews", "interview", "usability", "survey", "surveys", "personas", "customers", "insights"],
  ["launches & GTM", "launch", "launches", "gtm", "go-to-market", "positioning", "messaging", "announcement", "release notes", "enablement", "sales"],
  ["growth", "growth", "onboarding", "activation", "signup", "funnel", "conversion", "experiment", "experiments", "a/b testing", "experimentation", "retention", "churn"],
  ["marketing", "marketing", "email", "emails", "lifecycle", "seo", "acquisition", "campaign", "campaigns", "content"],
  ["legal & compliance", "legal", "compliance", "gdpr", "privacy", "pci", "soc 2", "audit", "contract", "contracts", "dpa", "consent", "data retention", "sign-off", "signoff", "regulatory"],
  ["pricing", "pricing", "price", "prices", "plans", "packaging", "tiers", "discount", "discounts", "monetization"],
  ["finance", "finance", "budget", "forecast", "revenue", "margin", "margins", "business case", "roi", "unit economics", "cost"],
  ["customer support", "support", "tickets", "ticket", "escalation", "escalations", "zendesk", "help center", "csat", "complaints", "feedback", "voice of customer"],
  ["Europe", "eu", "europe", "european", "uk", "international", "localization"],
];

export const stopwords = new Set(
  `a an the and or but if of to in on for with about at by from into over is are was were be been am
  i me my we our us you your he she they them it its this that these those who whom whose what which where when why how
  should would could can will do does did need needs want wants help talk speak ask contact reach out someone somebody person people
  anyone knows know knowledge expert best right go-to please hey hi chilla regarding re thing stuff our team owns own owner currently get
  find work working works worked whos whats im has have had just any some more most really like let`.split(/\s+/),
);
