import { useState, useEffect } from 'react';
import { supabase } from './supabase';

async function fetchOrCreateProfile(session) {
  if (!session) return null;
  const { data: p } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  if (p) return p;
  const email = session.user.email || '';
  const username = email.replace('@uchtl.app', '');
  const { data: created } = await supabase
    .from('profiles')
    .insert({ id: session.user.id, username })
    .select()
    .single();
  return created;
}

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // начальная сессия
    supabase.auth.getSession().then(async ({ data }) => {
      const s = data.session;
      setSession(s);
      const p = await fetchOrCreateProfile(s);
      setProfile(p);
    });

    // слушаем изменения (логин/логаут)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      const p = await fetchOrCreateProfile(s);
      setProfile(p);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function refresh() {
    const { data } = await supabase.auth.getSession();
    const p = await fetchOrCreateProfile(data.session);
    setProfile(p);
  }

  return { profile, session, refresh };
}
