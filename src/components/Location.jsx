
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Location.css";

const SERVICE_TYPES = {
  "police stations": {
    title: "Police Stations",
    query: '"amenity"="police"',
  },
  courts: {
    title: "Courts",
    query: '"amenity"="courthouse"',
  },
  "legal aid centres": {
    title: "Legal Aid Centres",
    query: '"office"="ngo"',
  },
  "government offices": {
    title: "Government Offices",
    query: '"office"="government"',
  },
};

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadius = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return (
    earthRadius *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
};

function Location() {
  const navigate = useNavigate();

  const [coordinates, setCoordinates] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedService, setSelectedService] =
    useState("legal aid centres");
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Your browser does not support location services."
      );
      return;
    }

    setLoading(true);
    setLocationStatus("Detecting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCoordinates({ latitude, longitude });
        setNearbyPlaces([]);
        setLocationStatus(
          "Your current location was detected successfully. Select a service to find nearby places."
        );
        setLoading(false);
      },
      (error) => {
        let message = "Unable to detect your location.";

        if (error.code === 1) {
          message =
            "Location permission denied. Allow location access in your browser settings and try again.";
        } else if (error.code === 2) {
          message =
            "Your location is unavailable. Check your device location settings.";
        } else if (error.code === 3) {
          message =
            "Location request timed out. Please try again.";
        }

        setLocationStatus(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  const searchService = async (service) => {
    if (!coordinates) {
      setLocationStatus(
        "Please click Detect My Location first."
      );
      return;
    }

    setSelectedService(service);
    setNearbyPlaces([]);
    setSearching(true);
    setLocationStatus(
      `Searching for nearby ${SERVICE_TYPES[service].title.toLowerCase()}...`
    );

    const { latitude, longitude } = coordinates;

    const tagQuery = {
      "police stations": `
        nwr(around:25000,${latitude},${longitude})["amenity"="police"];
      `,
      courts: `
        nwr(around:25000,${latitude},${longitude})["amenity"="courthouse"];
      `,
      "legal aid centres": `
        nwr(around:25000,${latitude},${longitude})["office"="lawyer"];
        nwr(around:25000,${latitude},${longitude})["amenity"="community_centre"]["name"];
      `,
      "government offices": `
        nwr(around:25000,${latitude},${longitude})["office"="government"];
      `,
    };

    const query = `
      [out:json][timeout:25];
      (
        ${tagQuery[service]}
      );
      out center tags;
    `;

    try {
      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `data=${encodeURIComponent(query)}`,
        }
      );

      if (!response.ok) {
        throw new Error(
          "The map service is temporarily unavailable."
        );
      }

      const data = await response.json();

      const places = (data.elements || [])
        .map((place) => {
          const latitudeValue =
            place.lat ?? place.center?.lat;
          const longitudeValue =
            place.lon ?? place.center?.lon;

          if (
            typeof latitudeValue !== "number" ||
            typeof longitudeValue !== "number"
          ) {
            return null;
          }

          const tags = place.tags || {};

          return {
            id: `${place.type}-${place.id}`,
            name:
              tags.name ||
              tags["name:en"] ||
              SERVICE_TYPES[service].title.slice(0, -1),
            address: [
              tags["addr:street"],
              tags["addr:city"] || tags["addr:suburb"],
            ]
              .filter(Boolean)
              .join(", ") || "Address not available in map data",
            latitude: latitudeValue,
            longitude: longitudeValue,
            distance: getDistanceKm(
              latitude,
              longitude,
              latitudeValue,
              longitudeValue
            ),
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);

      setNearbyPlaces(places);

      if (places.length > 0) {
        setLocationStatus(
          `Found ${places.length} nearby result(s). Places are sorted by straight-line distance.`
        );
      } else {
        setLocationStatus(
          "No matching places were found within 10 km in the available map data. Try Google Maps for more results."
        );
      }
    } catch (error) {
      setLocationStatus(
        "Unable to load nearby places right now. Please try again or use Google Maps."
      );
    } finally {
      setSearching(false);
    }
  };

  const mapQuery = coordinates
    ? `${SERVICE_TYPES[selectedService].title} near ${coordinates.latitude},${coordinates.longitude}`
    : "legal aid centres in Tamil Nadu";

  const mapUrl =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(mapQuery) +
    "&z=13&output=embed";

  const openGoogleMaps = () => {
    if (!coordinates) {
      setLocationStatus(
        "Please detect your location first."
      );
      return;
    }

    const query =
      `${SERVICE_TYPES[selectedService].title} near ` +
      `${coordinates.latitude},${coordinates.longitude}`;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="location-page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-symbol">⚖</div>
          <div>
            <h2>Smart Legal</h2>
            <span>Guidance System</span>
          </div>
        </div>

        <div className="sidebar-menu">
          <button
            className="menu-item"
            onClick={() => handleNavigation("/dashboard")}
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/ai-assistant")}
          >
            <span>🤖</span>
            <span>AI Assistant</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/know-my-rights")}
          >
            <span>⚖️</span>
            <span>Know My Rights</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/emergency")}
          >
            <span>🚨</span>
            <span>Emergency Assistance</span>
          </button>

          <button
            className="menu-item active"
            onClick={() => handleNavigation("/location")}
          >
            <span>📍</span>
            <span>Location Tracker</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/forms")}
          >
            <span>📄</span>
            <span>Forms Generator</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/scanner")}
          >
            <span>📑</span>
            <span>Document Scanner</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <button
            className="menu-item"
            onClick={() => handleNavigation("/profile")}
          >
            <span>👤</span>
            <span>Profile</span>
          </button>

          <button
            className="menu-item logout"
            onClick={() => handleNavigation("/")}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="location-main">
        <div className="location-header">
          <div>
            <p className="page-small-title">
              SMART LEGAL GUIDANCE SYSTEM
            </p>

            <h1>
              Location <span>Tracker</span>
            </h1>

            <p className="header-description">
              Find nearby legal services, police stations,
              courts and legal aid centres.
            </p>
          </div>

          <div className="header-icon">📍</div>
        </div>

        <div className="location-card">
          <div className="location-card-icon">📍</div>

          <div className="location-card-content">
            <h2>Find Legal Services Near You</h2>

            <p>
              Detect your current location to explore nearby
              police stations, courts, legal aid centres and
              government offices.
            </p>

            <button
              className="location-button"
              onClick={detectLocation}
              disabled={loading}
            >
              {loading
                ? "Detecting Location..."
                : coordinates
                ? "📍 Refresh My Location"
                : "📍 Detect My Location"}
            </button>

            {locationStatus && (
              <p
                className={
                  coordinates
                    ? "location-status success"
                    : "location-status"
                }
                role="status"
                aria-live="polite"
              >
                {loading || searching ? "⏳ " : "📍 "}
                {locationStatus}
              </p>
            )}

            {coordinates && (
              <div className="location-coordinates">
                <span>🌐 Latitude</span>
                <strong>
                  {coordinates.latitude.toFixed(6)}
                </strong>

                <span>🌐 Longitude</span>
                <strong>
                  {coordinates.longitude.toFixed(6)}
                </strong>
              </div>
            )}
          </div>
        </div>

        <div className="section-heading">
          <div>
            <h2>Nearby Legal Services</h2>
            <p>
              Select a service to find nearby places and their
              distances from your location.
            </p>
          </div>
        </div>

        <div className="location-grid">
          <div className="location-service-card">
            <div className="service-icon">👮</div>
            <h3>Police Stations</h3>
            <p>
              Find nearby police stations for safety and
              assistance.
            </p>
            <button
              onClick={() => searchService("police stations")}
              disabled={searching}
            >
              View Locations
            </button>
          </div>

          <div className="location-service-card">
            <div className="service-icon">⚖️</div>
            <h3>Courts</h3>
            <p>
              Locate nearby courts and view available
              location details.
            </p>
            <button
              onClick={() => searchService("courts")}
              disabled={searching}
            >
              View Locations
            </button>
          </div>

          <div className="location-service-card">
            <div className="service-icon">🏛️</div>
            <h3>Legal Aid Centres</h3>
            <p>
              Find mapped legal offices and community
              assistance centres.
            </p>
            <button
              onClick={() => searchService("legal aid centres")}
              disabled={searching}
            >
              View Locations
            </button>
          </div>

          <div className="location-service-card">
            <div className="service-icon">🏢</div>
            <h3>Government Offices</h3>
            <p>
              Find nearby government offices listed in the
              available map data.
            </p>
            <button
              onClick={() => searchService("government offices")}
              disabled={searching}
            >
              View Locations
            </button>
          </div>
        </div>

        {coordinates && (
          <section className="nearby-results">
            <div className="section-heading">
              <div>
                <h2>
                  📍 {SERVICE_TYPES[selectedService].title}
                </h2>
                <p>
                  Places within 10 km, sorted by straight-line
                  distance.
                </p>
              </div>

              <button
                className="location-button"
                onClick={openGoogleMaps}
              >
                Open Google Maps
              </button>
            </div>

            {searching && (
              <div className="nearby-empty">
                Searching nearby places...
              </div>
            )}

            {!searching && nearbyPlaces.length === 0 && (
              <div className="nearby-empty">
                No results to display yet. Select a service
                above to search nearby places.
              </div>
            )}

            {!searching &&
              nearbyPlaces.map((place) => (
                <div
                  className="nearby-place-card"
                  key={place.id}
                >
                  <div className="nearby-place-details">
                    <h3>{place.name}</h3>
                    <p>{place.address}</p>
                    <strong>
                      📏 {place.distance.toFixed(2)} km away
                    </strong>
                  </div>

                  <button
                    className="nearby-directions-button"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&origin=${coordinates.latitude},${coordinates.longitude}&destination=${place.latitude},${place.longitude}&travelmode=driving`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    🧭 Directions
                  </button>
                </div>
              ))}
          </section>
        )}

        <div className="location-map-section">
          <h2>📍 Explore Locations on Map</h2>

          <p>
            {coordinates
              ? `Map search: ${SERVICE_TYPES[selectedService].title}`
              : "Detect your location to explore services near you."}
          </p>

          <iframe
            key={mapUrl}
            title="Nearby Legal Services Map"
            src={mapUrl}
            width="100%"
            height="400"
            style={{
              border: 0,
              borderRadius: "12px",
            }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

          <p className="map-attribution">
            Map search provided by Google Maps. Nearby place
            results use OpenStreetMap data.
          </p>
        </div>

        <div className="location-info">
          <div className="info-icon">⚠️</div>
          <div>
            <h3>Location Information</h3>
            <p>
              Distances are calculated in a straight line from
              your detected location, not by road. Map data may
              be incomplete. Verify the address and contact
              details before visiting.
            </p>
          </div>
        </div>

        <div className="location-disclaimer">
          <div className="disclaimer-icon">⚖️</div>
          <div>
            <h3>Important Notice</h3>
            <p>
              Your location is accessed only after you grant
              browser permission. This feature provides general
              guidance and does not automatically contact the
              police or emergency services.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Location;
