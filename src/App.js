import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const addGuest = async (event) => {
    if (event) {
      event.preventDefault();
    }
    if (firstName && lastName) {
      const newGuest = {
        firstName: firstName,
        lastName: lastName,
        attending: false,
      };

      try {
        const response = await fetch('http://localhost:4000/guests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newGuest),
        });

        const createdGuest = await response.json();
        setGuests((prevGuests) => [...prevGuests, createdGuest]);
      } catch (error) {
        console.error('Error adding guest:', error);
      }

      setFirstName('');
      setLastName('');
    }
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter') {
      addGuest();
    }
  };

  const toggleAttendance = async (index) => {
    const guestToUpdate = guests[index];

    try {
      const response = await fetch(
        `http://localhost:4000/guests/${guestToUpdate.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ attending: !guestToUpdate.attending }),
        },
      );

      console.log(response.statusText);

      if (response.ok) {
        console.log(response.status, response.statusText);
        const updatedGuest = await response.json();
        const updatedGuests = [...guests];
        updatedGuests[index] = updatedGuest;
        setGuests(updatedGuests);
      } else {
        console.error(
          'Error updating guest attendance status:',
          response.status,
          response.statusText,
          await response.text(),
        );
      }
    } catch (error) {
      console.error('Error updating guest attendance status:', error);
    }
  };

  const deleteGuest = async (indexToDelete) => {
    const guestToDelete = guests[indexToDelete];

    try {
      const response = await fetch(
        `http://localhost:4000/guests/${guestToDelete.id}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        const updatedGuests = guests.filter(
          (_, index) => index !== indexToDelete,
        );
        setGuests(updatedGuests);
      } else {
        console.error('Error deleting guest:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch('http://localhost:4000/guests');
        const data = await response.json();
        setGuests(data);
      } catch (error) {
        console.error('Error fetching guests:', error);
      } finally {
        setIsLoading(false); // <-- This line sets loading to false after fetch
      }
    };

    fetchGuests();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <form onSubmit={addGuest}>
            <label>
              First Name:
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={handleKeydown}
                disabled={isLoading}
              />
            </label>
            <label>
              Last Name:
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={handleKeydown}
                disabled={isLoading}
              />
            </label>
          </form>

          <ul>
            {guests.map((guest, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>
                {`${guest.firstName} ${guest.lastName}`}
                <input
                  type="checkbox"
                  checked={guest.attending}
                  onChange={() => toggleAttendance(index)}
                  aria-label={`$${guest.firstName} ${guest.lastName} attending status`}
                />
                {guest.attending ? 'attending' : 'not attending'}
                <button onClick={() => deleteGuest(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
