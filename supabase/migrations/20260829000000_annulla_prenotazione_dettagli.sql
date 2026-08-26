-- =============================================================
-- Vizio Bistrot — annulla_prenotazione restituisce i dettagli
-- (§21, passo 5 — completamento)
-- =============================================================
-- Finora restituiva solo un boolean: bastava per dire al cliente se
-- la cancellazione era riuscita, ma ora la cancellazione self-service
-- deve anche avvisare lo staff (stessa email di notifica già usata
-- per le nuove prenotazioni, passo 3) — e per scriverla servono i
-- dati della prenotazione appena cancellata.
--
-- La riga restituita dalla RETURNING della update è già esattamente
-- quella giusta: nessun secondo giro di lettura, nessun rischio che
-- nel mezzo qualcos'altro la cambi. Cambia il tipo di ritorno, quindi
-- drop e ricrea, non "or replace".
--
-- telefono ed email entrano nel ritorno per la prima volta: erano
-- esclusi da prenotazione_da_token perché quella funzione alimenta la
-- vista del cliente (non gli servono per vedere la propria
-- prenotazione). Qui il ritorno non arriva mai al browser — resta
-- lato server, per comporre l'email allo staff — quindi la stessa
-- esclusione non si applica.
-- =============================================================

drop function if exists public.annulla_prenotazione(text);

create or replace function public.annulla_prenotazione(p_token text)
returns table (
  id             uuid,
  nome           text,
  telefono       text,
  email          text,
  data           date,
  fascia         time,
  coperti        smallint,
  note           text,
  evento_titolo  text,
  risposte_extra jsonb,
  locale         text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    update public.prenotazioni p
       set stato = 'cancellata'
     where p.token_gestione = p_token
       and p.stato = 'confermata'
    returning
      p.id, p.nome, p.telefono, p.email, p.data, p.fascia, p.coperti, p.note,
      (select e.titolo from public.eventi e where e.id = p.evento_id),
      p.risposte_extra, p.locale;
end;
$$;

revoke all on function public.annulla_prenotazione(text) from public;
grant execute on function public.annulla_prenotazione(text) to anon, authenticated;
