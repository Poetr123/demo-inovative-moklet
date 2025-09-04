import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QuoteSection from './components/QuoteSection';
import IdeaForm from './components/IdeaForm';
import IdeaCard from './components/IdeaCard';
import Leaderboard from './components/Leaderboard';
import LoginForm from './components/LoginForm';
import { useSupabase } from './hooks/useSupabase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const [ideas, setIdeas] = useState([]);
  const [topIdeas, setTopIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabase();
  const { user } = useAuth();

  useEffect(() => {
    fetchIdeas();
    fetchTopIdeas();
  }, []);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
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
                <span className="font-semibold telkom-red">Attitude is Everything!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
