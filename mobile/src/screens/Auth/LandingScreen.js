import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { COLORS, SPACING } from '../../theme/colors';

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
              <Text style={styles.title}>Welcome To</Text>
              <Text style={styles.brand}>Medicare App</Text>
              <Text style={styles.subtitle}>Our app is ready for you. Access healthcare anywhere.</Text>
          </View>

          <View style={styles.buttonArea}>
            <TouchableOpacity 
                style={styles.primaryBtn} 
                onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.primaryBtnText}>Get Started Now</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  content: { flex: 1, padding: SPACING.l, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, color: 'white', fontWeight: '400' },
  brand: { fontSize: 42, color: 'white', fontWeight: '800' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginVertical: 10 },
  buttonArea: { width: '100%', alignItems: 'center' },
  primaryBtn: { 
    width: '90%', height: 62, backgroundColor: 'white', borderRadius: 18, 
    justifyContent: 'center', alignItems: 'center' 
  },
  primaryBtnText: { color: COLORS.primary, fontSize: 18, fontWeight: '700' },
});

export default LandingScreen;
