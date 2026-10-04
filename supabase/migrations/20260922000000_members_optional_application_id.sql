-- Make application_id nullable in members table
-- This allows admins to manually add members who did not go through
-- the online application flow (e.g. existing members being migrated).

alter table public.members
  alter column application_id drop not null;
