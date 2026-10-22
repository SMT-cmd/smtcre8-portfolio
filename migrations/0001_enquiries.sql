CREATE TABLE IF NOT EXISTS enquiries (
 id TEXT PRIMARY KEY,
 created_at INTEGER NOT NULL,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 organisation TEXT NOT NULL DEFAULT '',
 kind TEXT NOT NULL CHECK(kind IN ('project','partnership','consultation','general')),
 message TEXT NOT NULL,
 ip_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS enquiries_by_time ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_rate_limit ON enquiries(ip_hash,created_at);
