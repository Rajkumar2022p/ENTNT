// src/components/Assessments/Sidebar/OnlineUsers.js
import React from 'react';

const users = ['#32CD32', '#FF6347', '#6A5ACD', '#FFA500', '#FFD700', '20+'];

const OnlineUsers = () => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Other Users Online</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {users.map((u, i) => (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: typeof u === 'string' && u.includes('#') ? u : '#ccc',
              color: '#fff',
              textAlign: 'center',
              lineHeight: '40px',
              fontWeight: 'bold'
            }}
          >
            {u.includes('#') ? '' : u}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineUsers;
