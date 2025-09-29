import React from 'react';

export default function SearchPanel() {
  return (
    <div>
      <div className="panel-header">SEARCH</div>
      <input type="text" placeholder="Search your files..." className="search-input" />
    </div>
  );
}