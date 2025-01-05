import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const AccessCam = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleCameraAccess = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      Alert.alert('Photo Taken', 'Check your gallery to view the captured photo.');
    }
  };

  const handleGeolocationAccess = async () => {
    setErrorMessage(null); // Reset error message before fetching
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission denied. Unable to access location.');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = userLocation.coords;

      setLocation({ latitude, longitude }); // Update state with location

      // Fetch the human-readable address using reverse geocoding
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const { city, region, country } = reverseGeocode[0];
        setAddress(${city}, ${region}, ${country});
      }
    } catch (error) {
      setErrorMessage('Failed to fetch location. Please try again.');
      console.error('Geolocation Error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>React Native Geolocation & Camera</Text>

      <TouchableOpacity style={styles.button} onPress={handleCameraAccess}>
        <Text style={styles.buttonText}>Access Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGeolocationAccess}>
        <Text style={styles.buttonText}>Access Geolocation</Text>
      </TouchableOpacity>

      {errorMessage ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : location ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Your Location</Text>
          <Text style={styles.locationText}>Latitude: {location.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {location.longitude}</Text>
          {address && <Text style={styles.addressText}>Address: {address}</Text>}
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Location not fetched yet.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  messageContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  locationContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  addressText: {
    fontSize: 16,
    color: '#388e3c',
    marginTop: 10,
    textAlign: 'center',
  },
  placeholderContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
});

export default AccessCam;