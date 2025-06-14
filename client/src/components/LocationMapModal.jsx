import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { GoogleMap, Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import toast from 'react-hot-toast';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 20.5937, // Approximate center of India
  lng: 78.9629,
};

const libraries = ['places'];

const LocationMapModal = ({ open, onClose, onSelectLocation, initialLocation }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Ensure this is set in your .env
    libraries,
  });

  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const onLoad = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
    if (initialLocation && initialLocation.city) {
      // Try to geocode initial location and set map center
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: `${initialLocation.city}, ${initialLocation.area || ''}` }, (results, status) => {
        if (status === 'OK' && results[0]) {
          mapInstance.setCenter(results[0].geometry.location);
          mapInstance.setZoom(12);
        }
      });
    }
  }, [initialLocation]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      console.log('Autocomplete place selected:', place);
      if (place.geometry && place.geometry.location) {
        setSelectedPlace(place);
        mapRef.current.panTo(place.geometry.location);
        mapRef.current.setZoom(15);
      } else {
        toast.error('Could not find location details for the selected place.');
      }
    }
  };

  const handleMapClick = useCallback((e) => {
    if (!e.latLng) return;

    console.log('Map clicked at coordinates:', e.latLng.lat(), e.latLng.lng());
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: e.latLng }, (results, status) => {
      console.log('Geocoding results for map click:', results, 'Status:', status);
      if (status === 'OK' && results[0]) {
        setSelectedPlace(results[0]);
        mapRef.current.panTo(e.latLng);
        mapRef.current.setZoom(15);
        toast.success(`Location selected: ${results[0].formatted_address}`);
      } else {
        toast.error('Could not get address for this location.');
      }
    });
  }, []);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Current position received:', position.coords.latitude, position.coords.longitude);
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            console.log('Geocoding results for current location:', results, 'Status:', status);
            if (status === 'OK' && results[0]) {
              setSelectedPlace(results[0]);
              mapRef.current.panTo(pos);
              mapRef.current.setZoom(15);
              toast.success(`Current location selected: ${results[0].formatted_address}`);
            } else {
              toast.error('Could not get address for your current location.');
            }
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
          toast.error(`Error getting current location: ${error.message || 'Permission denied'}.`);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const handleSelect = () => {
    console.log('Attempting to select location. Current selectedPlace:', selectedPlace);
    if (selectedPlace) {
      let city = '';
      let area = '';

      console.log('Selected place address components:', selectedPlace.address_components);
      for (const component of selectedPlace.address_components) {
        if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('sublocality_level_1') || component.types.includes('neighborhood')) {
          area = component.long_name;
        }
      }
      console.log('Extracted city:', city, 'Extracted area:', area);

      if (city || area) {
        const locationData = {
          city: city || selectedPlace.name || '',
          area: area || '',
          coordinates: [selectedPlace.geometry.location.lng(), selectedPlace.geometry.location.lat()],
          formattedAddress: selectedPlace.formatted_address
        };
        console.log('Sending location data:', locationData);
        onSelectLocation(locationData);
        onClose();
      } else {
        toast.error('Could not extract city or area from the selected location.');
      }
    } else {
      toast.error('Please select a location from the autocomplete suggestions or the map.');
    }
  };

  if (loadError) {
    return <Typography color='error'>Error loading maps: {loadError.message}</Typography>;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          Select Location
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {!isLoaded ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={onPlaceChanged}
              >
                <TextField
                  type='text'
                  placeholder='Search for a city or area'
                  fullWidth
                  variant='outlined'
                  sx={{ mb: 2 }}
                />
              </Autocomplete>
            </Box>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={handleMapClick}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {/* You can add markers here if needed */}
            </GoogleMap>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleCurrentLocation} variant='outlined' sx={{ mr: 1 }}>
          Current Location
        </Button>
        <Button onClick={handleSelect} variant='contained' disabled={!selectedPlace}>
          Select Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationMapModal; 