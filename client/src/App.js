import React, { useState , useEffect }  from 'react';
import ReactMapGL, { Marker , Popup } from 'react-map-gl';

import { listLogEntries}  from "./API";
import LogEntryForm from "./logEntryForm";

const App = () => {
  const [ logEntries , setLogEntries] = useState([]);
  const [ showPopup , setShowPopup ] = useState({});
  const [ addEntryLocation, setAddEntryLocation ] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 4
  });

  useEffect(() => {
    (async () => {
      const logEntries = await listLogEntries();
      setLogEntries(logEntries);
    }
    )()
  },[]);

  const showAddMarkerPopup = (event) => {
    const [ longitude , latitude ] = event.lngLat;
    
    setAddEntryLocation({
      longitude,
      latitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/tbvilarino/ck6l59tmb1daz1iryygwns6ji"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >

      {
        logEntries.map(entry => (
          <>
          <Marker 
            key = {entry._id}
            latitude={entry.latitude} 
            longitude={entry.longitude} 
          >
            <div
              onClick={ () => setShowPopup({
                //...showPopup,
                [entry._id]: true,
              })}
            >
              <svg 
                className="marker" 
                style={{
                  width: `calc(1vmin * ${viewport.zoom})`,
                  height: `calc(1vmin * ${viewport.zoom})`,
                }}
                viewBox="0 0 24 24" 
                fill="none" 
              >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          {
            showPopup[entry._id] ? (
              <Popup
                latitude={entry.latitude} 
                longitude={entry.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setShowPopup({})}
                anchor="top" >
                <div className="popup">
                  <h3>{entry.title}</h3>
                  <p>{entry.comments}</p>
                  <small>Visited on :{ new Date(entry.visitDate).toLocaleDateString()}</small>
                </div>
              </Popup>
            ) : null
          }
        </>


        ))
      }
       
    }
    {
      addEntryLocation ? (
        <>
          <Marker 
            latitude={addEntryLocation.latitude} 
            longitude={addEntryLocation.longitude} 
          >
            <div>
              <svg 
                className="marker" 
                style={{
                  width: `calc(1vmin * ${viewport.zoom})`,
                  height: `calc(1vmin * ${viewport.zoom})`,
                }}
                viewBox="0 0 24 24" 
                fill="none" 
              >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude} 
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setAddEntryLocation(null)}
            anchor="top" >
            <div className="popup">
              <LogEntryForm/>
            </div>
          </Popup>
        </>
      ) : null
    }

    </ReactMapGL>
  );
}

export default App;
