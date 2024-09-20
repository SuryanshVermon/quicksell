import React from 'react';
import './Card.css';

const Card = ({ticket, key}) => {
  return (
    <div className="card" key={key}>
      <div className="card-header">
        <span className="card-id">{ticket.id}</span>
        <img
          className="profile-pic"
          src="https://via.placeholder.com/32" // Placeholder image URL
          alt="Profile"
        />
      </div>
      <h2 className="card-title">{ticket.title}</h2>
      <div className="card-footer">
        <span className="icon">❗</span>
        {ticket.tag.map((tag, index) => (
          <span key={index} className="status">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Card;