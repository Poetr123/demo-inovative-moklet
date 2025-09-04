import React from 'react';

const QuoteSection = () => {
  const quotes = [
    {
      text: "Attitude is a little thing that makes a big difference.",
      author: "Winston Churchill"
    },
    {
      text: "Your attitude, not your aptitude, will determine your altitude.",
      author: "Zig Ziglar"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "Success is not the key to happiness. Happiness is the key to success.",
      author: "Albert Schweitzer"
    }
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg mb-8">
      <div className="text-center">
        <svg className="w-8 h-8 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-lg italic mb-2">"{randomQuote.text}"</p>
        <p className="font-semibold">- {randomQuote.author}</p>
      </div>
    </div>
  );
};

export default QuoteSection;
