import React from 'react';

const Leaderboard = ({ topIdeas }) => {
  if (!topIdeas || topIdeas.length === 0) {
    return null;
  }

  const getMedalColor = (position) => {
    switch (position) {
      case 0: return 'bg-yellow-400 text-yellow-800';
      case 1: return 'bg-gray-300 text-gray-800';
      case 2: return 'bg-amber-700 text-amber-100';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Top 3 Inovasi Siswa Minggu Ini</h2>
      
      <div className="space-y-4">
        {topIdeas.map((idea, index) => (
          <div key={idea.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 ${getMedalColor(index)}`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-white">{idea.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{idea.likes_count} likes</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${idea.department === 'RPL' ? 'badge-rpl' : idea.department === 'TKJ' ? 'badge-tkj' : 'badge-pg'}`}>
              {idea.department}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
