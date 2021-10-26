import React, { useState, useEffect } from "react";

function App() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  const [bigDataCloudData, setBigDataCloudData] = useState({
    country: null,
    city: null,
  });
  const [googleCloudData, setGoogleCloudData] = useState({
    country: null,
    city: null,
  });

  //console.log(process.env.REACT_APP_GOOGLE_CLOUD);

  const getCoordinates = () => {
    //https://javascript.plainenglish.io/how-to-use-the-geolocation-api-in-your-react-app-54e87c9c6c94
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  };

  const getLocation = async () => {
    setBigDataCloudData({ country: "...", city: "..." });
    setGoogleCloudData({ country: "...", city: "..." });

    const promises = [
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=pt`
      ),
      fetch(
        //This is a paid service
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_CLOUD}`
      ),
    ];

    try {
      const [resBigData, resGoogle] = await Promise.all(promises);

      if (resBigData.ok) {
        const data = await resBigData.json();
        setBigDataCloudData({ country: data.countryName, city: data.city });
      }

      if (resGoogle.ok) {
        const data = await resGoogle.json();
        setGoogleCloudData({
          country: data.results[0].address_components[5].long_name,
          city: data.results[0].address_components[3].long_name,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (lat !== null && lng !== null) getLocation();
  }, [lat, lng]);

  return (
    <div>
      <button onClick={getCoordinates}>
        Discover Geographical information
      </button>
      <span>{status}</span>
      <ul>
        <li>Latitude: {lat}</li>
        <li>Longitude: {lng}</li>

        <li>
          Big Data Cloud (
          <a
            href="https://www.bigdatacloud.com/geocoding-apis/free-reverse-geocode-to-city-api?gclid=CjwKCAjwq9mLBhB2EiwAuYdMtYntHY1tjlsJSuB8lCrMO5N9zJAdgtOAFswUCuGNNKd_SrbvyK25OBoCAw8QAvD_BwE"
            target="__blank"
          >
            api service
          </a>
          )
        </li>
        <ul>
          <li>Country: {bigDataCloudData.country}</li>
          <li>City: {bigDataCloudData.city}</li>
        </ul>

        <li>
          Google (
          <a
            href="https://developers.google.com/maps/documentation/geocoding/overview"
            target="__blank"
          >
            api service
          </a>
          )
        </li>
        <ul>
          <li>Country: {googleCloudData.country}</li>
          <li>City: {googleCloudData.city}</li>
        </ul>
      </ul>
    </div>
  );
}

export default App;
