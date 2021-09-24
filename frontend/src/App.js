import "./App.css"
import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room, Star} from '@material-ui/icons';
import axios from 'axios';
import {format} from 'timeago.js';
import Login  from './components/Login'
import Register  from './components/Register'

function App() {
  const myStorage = window.localStorage;
  const [lieu, setLieu]= useState(null);
  const [description, setDescription]= useState(null);
  const [rating, setRating]= useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser ] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] =  useState(null);
  
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 22,
    longitude: 12,
    zoom: 4
  });

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title: lieu,
      description,
      rating,
      latitude: newPlace.latitude,
      longitude: newPlace.longitude,
    }

    try {
        const res = await axios.post('/pins', newPin);
        setPins([...pins, res.data]);
        setNewPlace(null);
    } catch (error) {
      console.log(error)
    }
  }
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude: lat, longitude: long
    })
  }

  const handleAddClick = (e) => {
    console.log("Double click effectué ...")
    const [longitude, latitude] = e.lngLat;
    setNewPlace({longitude, latitude});

  }

  useEffect(() => {
    const getPins = async ()=>{
      try {
        const res = await axios.get("/pins");
        setPins(res.data)
      } catch (error) {
        console.log(error)
      }
    };
    getPins();
  }, [])

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onViewportChange={nextViewport => setViewport(nextViewport)}
        onDblClick= {handleAddClick}
        transitionDuration="250"
      >
        {pins.map(pin => (
          <Fragment key={pin._id}>
            <Marker latitude={pin.latitude} longitude={pin.longitude} offsetLeft={-viewport.zoom*3.5} offsetTop={-viewport.zoom*7}>
              <Room onClick= {()=>handleMarkerClick(pin._id, pin.latitude, pin.longitude)} 
                style= {{
                  fontSize: viewport.zoom*7, 
                  color: pin.username === currentUser ? "#6dd5ed":"#e65c00", 
                  cursor: 'pointer'
                }} 
              />
            </Marker>
            {pin._id === currentPlaceId && (
              <Popup className="popup" onClose={() => setCurrentPlaceId(null)} latitude={pin.latitude} longitude={pin.longitude} closeButton={true} closeOnClick={false} anchor="left" >
                <div className="card">
                  <label>Lieu</label>
                  <h3 className="place">{pin.title}</h3>
                  <label>Description</label>
                  <p className="desc">{pin.description}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(pin.rating).fill(<Star className="star"  />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
          </Fragment>
        ))}
        {newPlace && (
          <Popup 
            latitude={newPlace.latitude}  
            longitude={newPlace.longitude} 
            closeButton={true} closeOnClick={false} anchor="left" 
            onClose= {() =>setNewPlace(null)} 
          > 
            <div>
                <form onSubmit={handleSubmit}>
                  <label>Lieu</label>
                  <input
                    placeholder="Nom du lieu"
                    onChange={(e)=> setLieu(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Donner quelques détails par rapport au lieu."
                    onChange={(e)=> setDescription(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e)=> setRating(e.target.value)} >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Ajouter 
                  </button>
                </form>
              </div>
          </Popup>
        )}
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
             Log out
          </button>
        ): (
          <div className="buttons">
            <button className="button login" onClick={()=> setShowLogin(true)} >
              Log in
            </button>
            <button className="button register" onClick={()=> setShowRegister(true)}>
              Register
            </button>
          </div>     
        )}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} /> }
        {showRegister && <Register setShowRegister={setShowRegister} /> }
       
      </ReactMapGL>
    </div>
    
  );
}

export default App;
