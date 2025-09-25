// src/components/Common/PostSuggestions.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./PostSuggestion.css";

const PostSuggestions = ({ posts = [] }) => {
  const navigate = useNavigate();

  if (!posts.length) {
    return (
      <div className="ps-container">
        <h3>Suggested Posts</h3>
        <p>No suggestions available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="ps-container">
      <h3>Suggested Posts</h3>
      <div className="ps-list">
        {posts.map((post) => (
          <div
            key={post.id}
            className="ps-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <h4 className="ps-title">{post.title}</h4>
            <p className="ps-desc">{post.description}</p>
            <span className="ps-link">Click to view candidates →</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostSuggestions;
