-- =============================================================================
-- Newsletter: eigene Abo-Zeile lesbar machen
-- =============================================================================
-- Bisher hatte subscribers RLS aktiv, aber keine Policy -> nur service_role
-- konnte lesen. Für die Status-Anzeige (im Konto und im Newsletter-Banner)
-- dürfen eingeloggte User jetzt GENAU ihre eigene Zeile lesen (Match über die
-- E-Mail aus dem JWT). Schreiben (subscribe/unsubscribe) bleibt service_role.
-- =============================================================================
create policy "subscribers: read own by email"
  on public.subscribers for select
  to authenticated
  using (lower(email) = lower((auth.jwt() ->> 'email')));
