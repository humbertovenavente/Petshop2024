import React from 'react';
import Header from './header';
import Footer from './footer';

function Guest() {
  return (
    <div>
      <Header />
      <main className="main">
        <h2>Welcome!</h2>
        <p>This is the employee dashboard where you can manage your tasks.</p>
      </main>
      <Footer />
    </div>
  );
}

export default Guest;

