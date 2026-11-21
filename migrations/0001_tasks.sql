CREATE TABLE IF NOT EXISTS office_tasks (
  id TEXT PRIMARY KEY,
  task_text TEXT NOT NULL,
  team TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Menunggu', 'Dikerjakan', 'Perlu review', 'Selesai', 'Terhambat')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_office_tasks_created_at ON office_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_office_tasks_status ON office_tasks(status);
