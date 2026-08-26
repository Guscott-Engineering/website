import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';

// ---- 1. Global Web Styles & Reset -----------------------------------------
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      background-color: #0a0a0a;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      scroll-behavior: smooth;
    }
    .ge-header--light {
      background-color: rgba(255, 255, 255, 0.9) !important;
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #e5e5e5 !important;
    }
  `;
  document.head.appendChild(style);
}

// ---- 2. Cloudinary Configuration & Data Fetching ---------------------------
const CLOUD_NAME = 'guscottengineeringcomputers'; // Cloudinary Cloud Name

const fetchCloudinaryImages = async (folderTag) => {
  try {
    const response = await fetch(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${folderTag}.json`
    );
    const data = await response.json();
    return data.resources.map((file) => ({
      id: file.public_id,
      uri: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v${file.version}/${file.public_id}.${file.format}`,
      thumbUri: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_thumb,w_150/v${file.version}/${file.public_id}.${file.format}`,
    }));
  } catch (error) {
    console.error('Error loading Cloudinary images:', error);
    return [];
  }
};

// ---- 3. Interactive Gallery Component --------------------------------------
function MachineGallery({ machineId, folderTag, title }) {
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      const data = await fetchCloudinaryImages(folderTag);
      setImages(data);
      if (data.length > 0) {
        setActiveImage(data[0].uri);
      }
      setLoading(false);
    }
    loadGallery();
  }, [folderTag]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00ffcc" style={{ marginVertical: 40 }} />;
  }

  if (images.length === 0) return null;

  return (
    <View style={styles.machineCard} id={machineId}>
      <Text style={styles.machineTitle}>{title}</Text>
      
      {/* Main Machine Image */}
      {activeImage && (
        <Image source={{ uri: activeImage }} style={styles.mainImage} />
      )}

      {/* Thumbnails Row */}
      <View style={styles.thumbContainer}>
        {images.map((img) => {
          const isActive = activeImage === img.uri;
          return (
            <TouchableOpacity
              key={img.id}
              onPress={() => setActiveImage(img.uri)}
              style={[styles.geThumb, isActive && styles.geThumbActive]}
            >
              <Image source={{ uri: img.thumbUri }} style={styles.thumbImage} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ---- 4. Main App Layout & Interactivity ------------------------------------
export default function App() {
  const scrollViewRef = useRef(null);
  const [isHeaderLight, setIsHeaderLight] = useState(false);
  const [availableY, setAvailableY] = useState(0);

  // ---- Smooth-Scroll CTA Handler -------------------------------------------
  const scrollToAvailable = () => {
    if (Platform.OS === 'web') {
      const target = document.getElementById('available');
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 72;
        window.scrollTo({ top: top, behavior: 'smooth' });
        return;
      }
    }
    scrollViewRef.current?.scrollTo({ y: availableY - 72, animated: true });
  };

  // ---- Adaptive Header Tone Scroll Handler ---------------------------------
  const handleScroll = (event) => {
    if (Platform.OS !== 'web') return;
    
    const tonedElements = document.querySelectorAll('[data-tone]');
    let tone = 'dark';
    const probe = 36; // Midpoint of header bar height

    tonedElements.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) {
        tone = el.getAttribute('data-tone');
      }
    });

    setIsHeaderLight(tone === 'light');
  };

  return (
    <SafeAreaView style={styles.body}>
      {/* Floating Header */}
      <View style={[styles.geHeader, isHeaderLight && styles.geHeaderLight]}>
        <Text style={[styles.headerTitle, isHeaderLight && styles.textDark]}>
          GUSCOTT ENGINEERING
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={scrollToAvailable}>
          <Text style={styles.ctaText}>See What's Available</Text>
        </TouchableOpacity>
      </View>

      {/* Main Page Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Dark Hero Section */}
        <View style={styles.heroSection} data-tone="dark">
          <Text style={styles.heroHeading}>Custom Workstations & Engineering</Text>
          <Text style={styles.heroSub}>
            High-performance custom computing built to specification.
          </Text>
        </View>

        {/* Dynamic Build Galleries */}
        <View 
          id="available" 
          data-tone="dark" 
          style={styles.section}
          onLayout={(e) => setAvailableY(e.nativeEvent.layout.y)}
        >
          <MachineGallery 
            machineId="m1" 
            folderTag="custom-builds" 
            title="Featured Workstation" 
          />
        </View>

        {/* Light Section (Testing Adaptive Header Tone Switching) */}
        <View style={styles.lightSection} data-tone="light">
          <Text style={styles.lightSectionText}>
            Custom Component & Hardware Quotes
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---- 5. Stylesheet ---------------------------------------------------------
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    paddingTop: 80,
  },
  geHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  geHeaderLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  textDark: {
    color: '#000000',
  },
  ctaButton: {
    backgroundColor: '#00ffcc',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  ctaText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
  },
  heroSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroHeading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 18,
    color: '#aaaaaa',
    marginTop: 10,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  machineCard: {
    width: '100%',
    maxWidth: 900,
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#262626',
  },
  machineTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 480,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  thumbContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 12,
  },
  geThumb: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
    overflow: 'hidden',
  },
  geThumbActive: {
    borderColor: '#00ffcc',
  },
  thumbImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  lightSection: {
    backgroundColor: '#ffffff',
    padding: 60,
    marginTop: 40,
    alignItems: 'center',
  },
  lightSectionText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
  },
});