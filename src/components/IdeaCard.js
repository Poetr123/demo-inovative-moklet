import React, { useState, useEffect } from 'react';
import { supabase } from '../App';

const IdeaCard = ({ idea, user, onLikeToggle }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(idea.likes_count || 0);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user) {
        const { data } = await supabase
          .from('likes')
          .select('id')
          .eq('idea_id', idea.id)
          .eq('user_id', user.id)
          .single();
        
        setIsLiked(!!data);
      }
    };

    const fetchUserProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', idea.user_id)
        .single();
      
      setUserProfile(data);
    };

    checkIfLiked();
    fetchUserProfile();
  }, [user, idea.id, idea.user_id]);

  const handleLike = async () => {
    if (!user) {
      alert('Silakan login untuk memberikan like');
      return;
    }

    if (isLiked) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('idea_id', idea.id)
        .eq('user_id', user.id);
      
      if (!error) {
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        onLikeToggle(idea.id, likeCount - 1);
      }
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert([{ idea_id: idea.id, user_id: user.id }]);
      
      if (!error) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        onLikeToggle(idea.id, likeCount + 1);
      }
    }
  };

  const getBadgeClass = (dept) => {
    switch (dept) {
      case 'RPL': return 'badge-rpl';
      case 'TKJ': return 'badge-tkj';
      case 'PG': return 'badge-pg';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="idea-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(idea.department)}`}>
          {idea.department}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(idea.created_at).toLocaleDateString('id-ID')}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{idea.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{idea.description}</p>
      
      {idea.image_url && (
        <div className="mb-4">
          <img 
            src={idea.image_url} 
            alt={idea.title} 
            className="w-full h-64 object-cover rounded-md"
          />
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Oleh: {userProfile?.username || 'Anonim'}
        </div>
        
        <button 
          onClick={handleLike}
          className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg 
            className={`w-5 h-5 ${isLiked ? 'fill-red-600' : ''}`} 
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
};

export default IdeaCard;
