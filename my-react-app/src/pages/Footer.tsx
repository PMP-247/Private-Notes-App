import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-red-600 text-white py-4 px-6 flex justify-between items-center">
      <div className="contact-section">
        <p>Contact: Privatenotes@emailme.com</p>
      </div>
      <button className="history-button bg-red-700 hover:bg-red-800 px-4 py-2 rounded transition-colors duration-200">
        History
      </button>
    </footer>
  );
};

export default Footer;