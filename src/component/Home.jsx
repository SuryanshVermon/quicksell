import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css'; 
import Card from './card/Card';

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

function Home() {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState(getFromLocalStorage('grouping', 'status'));
  const [sortOption, setSortOption] = useState(getFromLocalStorage('sortOption', 'priority'));

  useEffect(() => {
    axios.get('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => {
        setTickets(response.data.tickets);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    saveToLocalStorage('grouping', grouping);
    saveToLocalStorage('sortOption', sortOption);
  }, [grouping, sortOption]);

  const groupTickets = (tickets) => {
    switch (grouping) {
      case 'status':
        return groupBy(tickets, 'status');
      case 'user':
        return groupBy(tickets, 'assigned_user');
      case 'priority':
        return groupBy(tickets, 'priority');
      default:
        return tickets;
    }
  };

  const groupBy = (tickets, key) => {
    return tickets.reduce((acc, ticket) => {
      const group = ticket[key] || 'Uncategorized';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(ticket);
      return acc;
    }, {});
  };

  const sortTickets = (tickets) => {
    return tickets.sort((a, b) => {
      if (sortOption === 'priority') {
        return b.priority - a.priority;
      } else if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const renderGroupedTickets = () => {
    const groupedTickets = groupTickets(tickets);
    const sortedTickets = sortTickets([...tickets]);

    return Object.keys(groupedTickets).map(group => (
      <div key={group} className="ticket-group">
        <h3>{group}</h3>
        {groupedTickets[group].map(ticket => (
          // <div key={ticket.id} className="ticket-card">
          //   <h4>{ticket.title}</h4>
          //   <p>Status: {ticket.status}</p>
          //   <p>User: {ticket.assigned_user}</p>
          //   <p>Priority: {ticket.priority}</p>
          // </div>
          <Card ticket={ticket} key={ticket.userId} />
        ))}
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>Kanban Board</h1>
      <div className="controls">
        <select value={grouping} onChange={e => setGrouping(e.target.value)}>
          <option value="status">Group by Status</option>
          <option value="user">Group by User</option>
          <option value="priority">Group by Priority</option>
        </select>

        <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      <div className="kanban-board">
        {renderGroupedTickets()}
      </div>
    </div>
  );
}

export default Home;
