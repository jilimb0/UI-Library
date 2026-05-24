#!/usr/bin/env node
const { readFileSync, readdirSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const rootPath = 'docs/architecture/schemas/supabase-schema-skeleton.sql';
const rootSql = readFileSync(rootPath, 'utf8');

const rootRequired = [
  'create table if not exists project',
  'create table if not exists page',
  'create table if not exists page_version',
  'alter table project enable row level security',
  'create policy project_read_members',
  'create policy project_edit_members',
];

const missingRoot = rootRequired.filter((needle) => !rootSql.includes(needle));
if (missingRoot.length > 0) {
  console.error(`Schema skeleton check failed for ${rootPath}`);
  for (const item of missingRoot) console.error(`- missing: ${item}`);
  process.exit(1);
}

const migrationsDir = 'docs/architecture/schemas/migrations';
if (existsSync(migrationsDir)) {
  const sqlFiles = readdirSync(migrationsDir).filter((name) =>
    name.endsWith('.sql')
  );
  for (const file of sqlFiles) {
    const full = join(migrationsDir, file);
    const sql = readFileSync(full, 'utf8').toLowerCase();
    const hasCreateOrAlter = sql.includes('create') || sql.includes('alter');
    if (!hasCreateOrAlter) {
      console.error(
        `Migration check failed for ${full}: must include create/alter statement`
      );
      process.exit(1);
    }
  }
}

console.log(`Schema skeleton check passed: ${rootPath}`);
