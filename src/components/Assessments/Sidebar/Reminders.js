// src/components/Assessments/Sidebar/Reminders.js
import React from 'react';

const reminders = [
  { title: 'Control Your Account', due: 'Due Today' },
  { title: 'Clear Desk Policy', due: 'Due Next Week' },
  { title: 'Use of Flash Drives', due: 'Due May 11th' },
  { title: 'Reporting an Incident', due: 'Due June 23rd' },
];

const Reminders = () => {
  return (
    <div>
      <h4>Reminders</h4>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {reminders.map((r, i) => (
            <>
          <li key={i}>
            <strong>{r.title}</strong><br />
            <small>{r.due}</small>
          </li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default Reminders;
