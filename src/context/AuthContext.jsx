import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchFavorites(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchFavorites(session.user.id);
      } else {
        setProfile(null);
        setFavorites([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
  }

  async function fetchFavorites(userId) {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setFavorites(data);
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async function signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!error && data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: userData.fullName || '',
        phone: userData.phone || '',
        company: userData.company || '',
      });
    }
    return { data, error };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function updateProfile(updates) {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates });
    if (!error) setProfile(prev => ({ ...prev, ...updates }));
    return { error };
  }

  async function toggleFavorite(product) {
    if (!user) return { requiresAuth: true };
    const existing = favorites.find(f => f.product_id === String(product.id));
    if (existing) {
      await supabase.from('favorites').delete().eq('id', existing.id);
      setFavorites(prev => prev.filter(f => f.id !== existing.id));
    } else {
      const { data } = await supabase.from('favorites').insert({
        user_id: user.id,
        product_id: String(product.id),
        product_name: product.name,
        product_price: product.price,
        product_image: product.image,
        product_brand: product.brand || '',
      }).select().single();
      if (data) setFavorites(prev => [data, ...prev]);
    }
  }

  function isFavorite(productId) {
    return favorites.some(f => f.product_id === String(productId));
  }

  return (
    <AuthContext.Provider value={{
      user, profile, favorites, loading,
      signIn, signUp, signOut, updateProfile, toggleFavorite, isFavorite,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
