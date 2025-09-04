import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QuoteSection from './components/QuoteSection';
import IdeaForm from './components/IdeaForm';
import IdeaCard from './components/IdeaCard';
import Leaderboard from './components/Leaderboard';
import LoginForm from './components/LoginForm';
import ThemeToggle from './components/ThemeToggle';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Initialize Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [ideas, setIdeas] = useState([]);
  const [topIdeas, setTopIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
    };

    getSession();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIdeas();
      fetchTopIdeas();
    }
  }, [user]);

  const fetchIdeas = async () => {
    const { data, error } = await supabase
      .from('ideas')
      .select(`
        *,
        likes_count:likes(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error);
    } else {
      // Process the data to extract the likes count
      const processedData = data.map(idea => ({
        ...idea,
        likes_count: idea.likes_count[0]?.count || 0
      }));
      setIdeas(processedData);
    }
    setLoading(false);
  };

  const fetchTopIdeas = async () => {
    // Get ideas from the last 7 days with most likes
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('ideas')
      .select(`
        *,
        likes_count:likes(count)
      `)
      .gte('created_at', oneWeekAgo.toISOString())
      .order('likes_count', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching top ideas:', error);
    } else {
      const processedData = data.map(idea => ({
        ...idea,
        likes_count: idea.likes_count[0]?.count || 0
      }));
      setTopIdeas(processedData);
    }
  };

  const handleIdeaAdded = (newIdea) => {
    setIdeas(prevIdeas => [{
      ...newIdea,
      likes_count: 0
    }, ...prevIdeas]);
  };

  const handleLikeToggle = (ideaId, newLikeCount) => {
    setIdeas(prevIdeas => 
      prevIdeas.map(idea => 
        idea.id === ideaId ? { ...idea, likes_count: newLikeCount } : idea
      )
    );
    
    // Refresh top ideas when a like changes
    fetchTopIdeas();
  };

  const handleLogin = async (email, password, isLogin) => {
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // Create user profile
        await supabase
          .from('profiles')
          .insert([{ id: (await supabase.auth.getUser()).data.user.id, username: email.split('@')[0] }]);
      }
      setShowLogin(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-telkom-red border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-telkom-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Inovasi <span className="text-red-600">Siswa</span>
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-8">
          <QuoteSection />
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <QuoteSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <IdeaForm onIdeaAdded={handleIdeaAdded} />
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Ide Inovatif Terbaru</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">Memuat ide...</p>
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <p className="text-gray-600 dark:text-gray-400">Belum ada ide yang dibagikan. Jadilah yang pertama!</p>
              </div>
            ) : (
              ideas.map(idea => (
                <IdeaCard 
                  key={idea.id} 
                  idea={idea} 
                  user={user}
                  onLikeToggle={handleLikeToggle}
                />
              ))
            )}
          </div>
          
          <div className="lg:col-span-1">
            <Leaderboard topIdeas={topIdeas} />
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Tentang Platform Ini</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Platform ini dibuat untuk siswa SMK Telkom Malang berbagi ide inovatif 
                dan menginspirasi sesama siswa untuk terus berkarya.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-red-600">Attitude is Everything!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
