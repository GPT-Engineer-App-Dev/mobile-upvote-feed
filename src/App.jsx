import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const App = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(response => response.json())
      .then(ids => {
        const top5Ids = ids.slice(0, 5);
        return Promise.all(top5Ids.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json())
        ));
      })
      .then(stories => setStories(stories));
  }, []);

  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <div className="container mx-auto p-4">
            <nav className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <Link to="/" className="text-xl font-bold">Home</Link>
                <Link to="/top-stories" className="text-xl font-bold">Top Stories</Link>
                <Link to="/about" className="text-xl font-bold">About</Link>
              </div>
              <button 
                className="bg-gray-200 dark:bg-gray-800 p-2 rounded" 
                onClick={() => setDarkMode(!darkMode)}
              >
                Toggle Dark Mode
              </button>
            </nav>
            <Routes>
              <Route path="/" element={
                <>
                  <input 
                    type="text" 
                    placeholder="Search stories..." 
                    className="w-full p-2 mb-4 border rounded" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <ul className="space-y-4">
                    {filteredStories.map(story => (
                      <li key={story.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                        <h2 className="text-xl font-semibold">{story.title}</h2>
                        <p>{story.score} upvotes</p>
                        <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Read more</a>
                      </li>
                    ))}
                  </ul>
                  <MapComponent />
                </>
              } />
              <Route path="/top-stories" element={<div>Top Stories Page</div>} />
              <Route path="/about" element={<div>About Page</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;