import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './InStudio.css';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const InStudio = ({ baseURL }) => {

  const { studio_id } = useParams();
  const navigate = useNavigate();
  const [photographer, setPhotographer] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');

  useEffect(() => {
    // Set the document title
    document.title = photographer ? photographer.profile : 'Loading...';
  }, [photographer]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${baseURL}/studio/${studio_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      setPhotographer(data.photographer);
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
      setErrorMessage('An error occurred while fetching data.');
    });
  }, [studio_id]);

  const handleBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
      const response = await fetch(`${baseURL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          customerContact: userData.email,
          client: userData.userID,
          photographer: studio_id,
          startTime: date1,
          endTime: date2
        })
      });

      if (response.ok) {
        alert('Booking Successful');
        navigate('/bookings');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.msg);
        alert(errorMessage);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('An error occurred during booking. Please try again.');
      alert(errorMessage);
    }
  };



  return (
    <div>
      <Navbar />
      {photographer ? (
        <div id="photographer-info" style={{ display: 'flex' }}>
          <div>
            {/* Photographer image */}
            <img src={photographer.image} alt="Photographer" style={{ borderRadius: '50%', width: '150px', height: '150px' }} />
          </div>
          <div>
            {/* Photographer details */}
            <h1>{photographer.name}</h1>
            <h3>{photographer.profile}</h3>
            <div>
              {/* Render location as bubbles */}
              {photographer.location.map((loc, ind) => (
                <span key={ind} style={{ display: 'inline-block', padding: '5px', margin: '5px', backgroundColor: '#cde', borderRadius: '5px' }}>{loc}</span>
              ))}
            </div>
            <div>
              {/* Render categories as bubbles */}
              {photographer.expertise.map((category, index) => (
                <span key={index} style={{ display: 'inline-block', padding: '5px', margin: '5px', backgroundColor: '#ccc', borderRadius: '5px' }}>{category}</span>
              ))}
            </div>
            <p>Price: ₹{photographer.price}</p>
          </div>
        </div>
      ) : (
        <p>Loading photographer data...</p>
      )}


      <div className="booking-form-container">
        <form onSubmit={handleBook} className="booking-form">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">Start Date:</label>
            <input type="date" name="date1" id="date1" onChange={(e) => setDate1(e.target.value)} className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="endDate" className="form-label">End Date:</label>
            <input type="date" name="date2" id="date2" onChange={(e) => setDate2(e.target.value)} className="form-input" />
          </div>

          <button type="submit" className="book-button">Book</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default InStudio;
