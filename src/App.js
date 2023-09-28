import './App.css';
import React, { useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);

  const addGuest = (event) => {
    if (event) event.preventDefault();
    if (firstName && lastName) {
      const newGuest = { name: `${firstName} ${lastName}`, attending: false };
      setGuests([...guests, newGuest]);
      setFirstName('');
      setLastName('');
    }
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter') {
      addGuest();
    }
  };

  const toggleAttendance = (index) => {
    const updateGuests = [...guests];
    updateGuests[index].attending = !updateGuests[index].attending;
    setGuests(updateGuests);
  };

  const deleteGuest = (indexToDelete) => {
    const updatedGuests = guests.filter((_, index) => index !== indexToDelete);
    setGuests(updatedGuests);
  };

  return (
    <div>
      <form onSubmit={addGuest}>
        <label>
          First Name:
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onKeyDown={handleKeydown}
          />
        </label>
        <label>
          Last Name:
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onKeyDown={handleKeydown}
          />
        </label>
      </form>

      <ul>
        {guests.map((guest, index) => (
          <li key={index}>
            {guest.name}
            <input
              type="checkbox"
              checked={guest.attending}
              onChange={() => toggleAttendance(index)}
              aria-label={`${guest.name} attending status`}
            />
            {guest.attending ? ' attending' : ' not attending'}
            <button onClick={() => deleteGuest(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
