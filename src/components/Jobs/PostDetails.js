// src/components/Common/PostDetails.js
import React from "react";
import { useParams } from "react-router-dom";

const dummyCandidates = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", score: 8 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", score: 6 },
  { id: 3, name: "Carol Danvers", email: "carol@example.com", score: 9 },
];

const PostDetails = () => {
  const { postId } = useParams();

  return (
    <div style={styles.container}>
      <h2>Post Details - ID: {postId}</h2>
      <p>This is a dummy post detail page showing related candidate data.</p>

      <h3 style={{ marginTop: "2rem" }}>Dummy Candidates</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Score</th>
          </tr>
        </thead>
        <tbody>
          {dummyCandidates.map((c) => (
            <tr key={c.id}>
              <td style={styles.td}>{c.name}</td>
              <td style={styles.td}>{c.email}</td>
              <td style={styles.td}>{c.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  th: {
    textAlign: "left",
    borderBottom: "2px solid #ccc",
    padding: "0.5rem",
  },
  td: {
    padding: "0.5rem",
    borderBottom: "1px solid #eee",
  },
};

export default PostDetails;
