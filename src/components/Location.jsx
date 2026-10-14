
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Location.css";

const SERVICE_TYPES = {
  "police stations": {
    title: "Police Stations",
  },
  courts: {
    title: "Courts",
  },
  "legal aid centres": {
    title: "Legal Aid Centres",
  },
  "government offices": {
    title: "Government Offices",
  },
};

const SEARCH_RADIUS = 10000;

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
  const [accuracy, setAccuracy] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedService, setSelectedService] =
    useState("legal aid centres");
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Detect the location supplied by the device/browser.
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Your browser does not support location services."
      );
      return;
    }

    setLoading(true);
    setLocationStatus("Detecting your current location...");
    setNearbyPlaces([]);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracyMeters = position.coords.accuracy;

        setCoordinates({ latitude, longitude });
        setAccuracy(accuracyMeters);

        if (accuracyMeters > 1000) {
          setLocationStatus(
            `Location detected, but accuracy is approximately ${(
              accuracyMeters / 1000
            ).toFixed(1)} km. Check your device location settings for better accuracy.`
          );
        } else {
          setLocationStatus(
            `Location detected. Estimated accuracy: ${Math.round(
              accuracyMeters
            )} metres.`
          );
        }

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Accuracy in metres:", accuracyMeters);

        setLoading(false);
      },
      (error) => {
        let message =
          "Unable to detect your current location.";

        if (error.code === 1) {
          message =
            "Location permission denied. Allow location access in Chrome settings and try again.";
        } else if (error.code === 2) {
          message =
            "Location unavailable. Enable Windows Location Services and check your device settings.";
        } else if (error.code === 3) {
          message =
            "Location request timed out. Check your connection and try again.";
        }

        setLocationStatus(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  };

  // Search mapped services within 10 km.
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
        nwr(around:${SEARCH_RADIUS},${latitude},${longitude})
        ["amenity"="police"];
      `,
      courts: `
        nwr(around:${SEARCH_RADIUS},${latitude},${longitude})
        ["amenity"="courthouse"];
      `,
      "legal aid centres": `
        nwr(around:${SEARCH_RADIUS},${latitude},${longitude})
        ["office"="lawyer"];
        nwr(around:${SEARCH_RADIUS},${latitude},${longitude})
        ["amenity"="community_centre"]["name"];
      `,
      "government offices": `
        nwr(around:${SEARCH_RADIUS},${latitude},${longitude})
        ["office"="government"];
      `,
    };

    const query = `
      [out:json][timeout:30];
      (
        ${tagQuery[service]}
      );
      out center tags;
    `;

    // Try a backup endpoint if the first map server is unavailable.
    const endpoints = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
    ];

    try {
      let data = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: `data=${encodeURIComponent(query)}`,
          });

          if (!response.ok) {
            throw new Error("Map server unavailable");
          }

          data = await response.json();
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!data) {
        throw lastError || new Error("Search failed");
      }

      const places = (data.elements || [])
        .map((place) => {
          const placeLat = place.lat ?? place.center?.lat;
          const placeLon = place.lon ?? place.center?.lon;

          if (
            typeof placeLat !== "number" ||
            typeof placeLon !== "number"
          ) {
            return null;
          }

          const tags = place.tags || {};

          const distance = getDistanceKm(
            latitude,
            longitude,
            placeLat,
            placeLon
          );

          if (distance > SEARCH_RADIUS / 1000) {
            return null;
          }

          return {
            id: `${place.type}-${place.id}`,
            name:
              tags.name ||
              tags["name:en"] ||
              SERVICE_TYPES[service].title,
            address: [
              tags["addr:street"],
              tags["addr:suburb"],
              tags["addr:city"] ||
                tags["addr:district"],
            ]
              .filter(Boolean)
              .join(", ") ||
              "Address not available in map data",
            latitude: placeLat,
            longitude: placeLon,
            distance,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);

      setNearbyPlaces(places);

      if (places.length > 0) {
        setLocationStatus(
          `Found ${places.length} place(s) within 10 km, sorted by straight-line distance.`
        );
      } else {
        setLocationStatus(
          "No matching places found within 10 km in the available map data. Try Google Maps for additional results."
        );
      }
    } catch (error) {
      console.error("Nearby search error:", error);

      setLocationStatus(
        "Unable to load nearby places. Please try again in a moment or use Google Maps."
      );
    } finally {
      setSearching(false);
    }
  };

  // Centre the embedded map on the detected coordinates.
  const mapUrl = coordinates
    ? `https://maps.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&z=15&output=embed`
    : "https://maps.google.com/maps?q=Kallakurichi%2C%20Tamil%20Nadu&z=13&output=embed";

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
                  coordinates && accuracy !== null &&
                  accuracy <= 1000
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

                <span>🎯 Accuracy</span>
                <strong>
                  {accuracy !== null
                    ? `${Math.round(accuracy)} metres`
                    : "Unavailable"}
                </strong>
              </div>
            )}
          </div>
        </div>

        <div className="section-heading">
          <div>
            <h2>Nearby Legal Services</h2>
            <p>
              Select a service to find nearby places and
              their distances from your location.
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
              Find nearby government offices listed in
              the available map data.
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
                  Places within 10 km, sorted by
                  straight-line distance.
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
              ? "Map centred on your detected coordinates."
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
            Map provided by Google Maps. Nearby place results
            use OpenStreetMap data.
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
