import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="feed-layout">
      <Sidebar />
      <main className="feed-main">{children}</main>
    </div>
  );
};

export default Layout;
