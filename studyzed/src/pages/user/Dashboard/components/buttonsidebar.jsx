import React from 'react';
// import '../style/sidebar.css';
const SidebarButton = ({ label, isSelected, onClick }) => {
  return (
    <button
      className={`sidebar-item gap-3 ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SidebarButton;
