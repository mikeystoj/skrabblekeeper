-- Remove public (anon key) access to the licenses table.
-- Run this AFTER the code that uses SUPABASE_SERVICE_ROLE_KEY is deployed,
-- otherwise license checks on the live site will fail.
DROP POLICY IF EXISTS "Allow insert licenses" ON licenses;
DROP POLICY IF EXISTS "Allow select licenses" ON licenses;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
