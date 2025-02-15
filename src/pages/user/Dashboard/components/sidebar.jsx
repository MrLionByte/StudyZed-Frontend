import React, { useState } from 'react';
import '../style/sidebar.css';

const Sidebar = () => {
  const [selected, setSelected] = useState("DASHBOARD");

  const menuItems = [
    "DASHBOARD",
    "ASSESSMENT",
    "TASKS",
    "MESSAGES",
    "MY CLASS",
    "MY PROGRESS",
    "BATCH MEMBERS",
    "MY ACCOUNT",
  ];

  return (
    <div className="sidebar w-max">
      {menuItems.map((item) => (
        <button
          key={item}
          className={`sidebar-item ${selected === item ? "selected" : ""}`}
          onClick={() => setSelected(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
