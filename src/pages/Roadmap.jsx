import React, { useState } from 'react';
import _ from 'lodash';
import { getAIResponse } from './aiRoadmap';

const Roadmap = () => {
  const [profession, setProfession] = useState('');
  const [userInput, setUserInput] = useState('');
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoadmapData(null);

    try {
      const response = await getAIResponse(userInput, profession);
      console.log('Parsed API response:', response);

      if (!response.roadmap || !response.flashcards) {
        throw new Error('Incomplete data in AI response');
      }

      setRoadmapData(response);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl px-4 py-12 mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-center text-transparent bg-clip-text bg-proj">Career Roadmap Generator</h1>
      <form onSubmit={handleSubmit} className="mb-12 space-y-6">
        <div>
          <label htmlFor="profession" className="block mb-2 text-lg font-medium text-gray-700">Your Profession:</label>
          <input
            type="text"
            id="profession"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>
        <div>
          <label htmlFor="userInput" className="block mb-2 text-lg font-medium text-gray-700">What would you like to learn about your career path?</label>
          <textarea
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            rows="4"
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="w-full px-6 py-3 font-semibold text-white transition duration-300 ease-in-out rounded-lg shadow-md bg-proj hover:bg-proj-hover"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Roadmap'}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-8 text-red-700 bg-red-100 border border-red-400 rounded-lg">
          Error: {error}
        </div>
      )}

      {roadmapData && (
        <div className="space-y-12">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-proj">Your Career Roadmap</h2>
          {roadmapData.roadmap.map((stage, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="mb-4 text-2xl font-semibold text-transparent bg-clip-text bg-proj">{stage.stage}</h3>
              <p className="mb-4 text-gray-700">{stage.description}</p>
              <h4 className="mb-2 text-xl font-semibold text-teal-600">Skills:</h4>
              <ul className="mb-4 text-gray-700 list-disc list-inside">
                {stage.skills.map((skill, skillIndex) => (
                  <li key={skillIndex}>{skill}</li>
                ))}
              </ul>
              <h4 className="mb-2 text-xl font-semibold text-teal-600">Resources:</h4>
              <ul className="text-gray-700 list-disc list-inside">
                {stage.resources.map((resource, resourceIndex) => (
                  <li key={resourceIndex}>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">
                      {resource.name} ({resource.type})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <h2 className="mt-16 text-3xl font-bold text-center text-transparent bg-clip-text bg-proj">Flashcards</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roadmapData.flashcards.map((flashcard, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="mb-3 text-lg font-semibold text-teal-600">Question:</h3>
                <p className="mb-4 text-gray-700">{flashcard.question}</p>
                <h3 className="mb-3 text-lg font-semibold text-teal-600">Answer:</h3>
                <p className="text-gray-700">{flashcard.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;