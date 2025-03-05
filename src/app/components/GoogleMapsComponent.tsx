"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { saveLocation, fetchLocations } from "@/app/actions/locationActions";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = { lat: 37.7749, lng: -122.4194 };

const GoogleMapComponent = () => {
  const [markers, setMarkers] = useState<{ lat: number; lng: number; title: string; description: string }[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number; title: string; description: string } | null>(null);
  const [newMarkerData, setNewMarkerData] = useState({ title: "", description: "" });
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    async function loadMarkers() {
      const locations = await fetchLocations();
      setMarkers(locations);
    }
    loadMarkers();
  }, []);

  const validateForm = () => {
    let isValid = true;
    let newErrors: { title?: string; description?: string } = {};

    if (newMarkerData.title.trim() === "") {
      newErrors.title = "Title is required.";
      isValid = false;
    }

    if (newMarkerData.description.trim() === "") {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {

    if (!validateForm()) {
      return;
    }

    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const newMarker = { lat, lng, title: newMarkerData.title, description: newMarkerData.description };

      setMarkers((prev) => [...prev, newMarker]);

      try {
        await saveLocation(newMarker);
      } finally {
        setNewMarkerData({ title: "", description: "" });
        setErrors({});
      }
    }
  }, [newMarkerData]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col bg-black p-4 rounded-lg shadow-md mb-4 w-full max-w-sm">
          <h3 className="text-xl font-bold text-center">Add a New Location</h3>
          
          <label className="mt-2 font-semibold">Title:</label>
          <input
            type="text"
            placeholder="Enter Title"
            value={newMarkerData.title}
            onChange={(e) => setNewMarkerData({ ...newMarkerData, title: e.target.value })}
            className="border p-2 rounded w-full"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <label className="mt-2 font-semibold">Description:</label>
          <textarea
            placeholder="Enter Description"
            value={newMarkerData.description}
            onChange={(e) => setNewMarkerData({ ...newMarkerData, description: e.target.value })}
            className="border p-2 rounded w-full"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <p className="text-gray-600 text-sm mt-2 text-center">Click on the map to place a marker.</p>
        </div>

        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onClick={handleMapClick}>
          {markers.map((marker, index) => (
            <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} onClick={() => setSelectedMarker(marker)} />
          ))}

          {selectedMarker && (
            <InfoWindow position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }} onCloseClick={() => setSelectedMarker(null)}>
              <div>
                <h3 className="font-bold">{selectedMarker.title}</h3>
                <p>{selectedMarker.description}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};


export default GoogleMapComponent;