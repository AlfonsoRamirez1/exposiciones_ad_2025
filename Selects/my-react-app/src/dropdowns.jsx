import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api";

function Dropdowns() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/countries`);
      if (!response.ok) throw new Error('Error fetching countries');
      const data = await response.json();
      setCountries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async (countryId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cities/${countryId}`);
      if (!response.ok) throw new Error('Error fetching cities');
      const data = await response.json();
      setCities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocalities = async (cityId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/localities/${cityId}`);
      if (!response.ok) throw new Error('Error fetching localities');
      const data = await response.json();
      setLocalities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    setSelectedCity("");
    setSelectedLocality("");
    setCities([]);
    setLocalities([]);
    
    if (countryId) {
      fetchCities(countryId);
    }
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedLocality("");
    setLocalities([]);
    
    if (cityId) {
      fetchLocalities(cityId);
    }
  };

  const handleLocalityChange = (e) => {
    setSelectedLocality(e.target.value);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Selección de Ubicación</h1>
          <p>Elige tu país, ciudad y localidad</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ Error: {error}
          </div>
        )}

        <div className="form-container">
          <div className="form-group">
            <label htmlFor="country">País</label>
            <select
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={loading}
            >
              <option value="">-- Selecciona un país --</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.nombre}
                </option>
              ))}
            </select>
          </div>

          {selectedCountry && (
            <div className="form-group fade-in">
              <label htmlFor="city">Ciudad</label>
              <select
                id="city"
                value={selectedCity}
                onChange={handleCityChange}
                disabled={loading || cities.length === 0}
              >
                <option value="">-- Selecciona una ciudad --</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCity && (
            <div className="form-group fade-in">
              <label htmlFor="locality">Localidad</label>
              <select
                id="locality"
                value={selectedLocality}
                onChange={handleLocalityChange}
                disabled={loading || localities.length === 0}
              >
                <option value="">-- Selecciona una localidad --</option>
                {localities.map((locality) => (
                  <option key={locality.id} value={locality.id}>
                    {locality.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <span>Cargando...</span>
            </div>
          )}

          {selectedCountry && (
            <div className="summary">
              <h3>📍 Selección actual:</h3>
              <p>
                <strong>País:</strong>{" "}
                {countries.find(c => c.id === parseInt(selectedCountry))?.nombre || "No seleccionado"}
              </p>
              {selectedCity && (
                <p>
                  <strong>Ciudad:</strong>{" "}
                  {cities.find(c => c.id === parseInt(selectedCity))?.nombre || "No seleccionada"}
                </p>
              )}
              {selectedLocality && (
                <p>
                  <strong>Localidad:</strong>{" "}
                  {localities.find(l => l.id === parseInt(selectedLocality))?.nombre || "No seleccionada"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dropdowns;