import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchCloudinaryImages } from '../services/cloudinary';

export default function BuildGallery({ folderTag = 'custom-builds' }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function loadGallery() {
      setLoading(true);
      const fetchedImages = await fetchCloudinaryImages(folderTag);
      if (isMounted) {
        setImages(fetchedImages);
        setLoading(false);
      }
    }

    loadGallery();
    return () => { isMounted = false; };
  }, [folderTag]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.image} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 10,
  },
});