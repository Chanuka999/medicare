import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Mail, Lock, Heart, ArrowRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/api';
import { COLORS, SPACING } from '../../theme/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        const { token, user } = response.data.data;
        
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        Alert.alert("Success", `Welcome back, ${user.name}!`);
        
        if (user.role === 'doctor') {
            navigation.replace('DoctorDashboard');
        } else {
            navigation.replace('PatientDashboard');
        }
        
    } catch (err) {
        const msg = err.response?.data?.message || "Login failed. Check your credentials.";
        Alert.alert("Login Error", msg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Heart color="white" size={40} fill="white" />
          </View>
          <Text style={styles.title}>MediFlow Portal</Text>
          <Text style={styles.subtitle}>Enter your details to access your dashboard</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Mail color={COLORS.textLight} size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock color={COLORS.textLight} size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginBtn, loading && styles.disabledBtn]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
            {!loading && <ArrowRight color="white" size={20} />}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to Medicare Hospital? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { flexGrow: 1, padding: SPACING.l, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  logoCircle: { 
    width: 80, height: 80, 
    borderRadius: 24, 
    backgroundColor: COLORS.primary, 
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.m,
    ...Platform.select({
      ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15 },
      android: { elevation: 5 }
    })
  },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textLight, textAlign: 'center' },
  form: { width: '100%' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: SPACING.m,
    height: 60,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.text, fontWeight: '500' },
  forgot: { alignSelf: 'flex-end', marginBottom: SPACING.xl },
  forgotText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  loginBtn: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    ...Platform.select({
      ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 8 }
    })
  },
  disabledBtn: { opacity: 0.7 },
  loginBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xxl },
  footerText: { color: COLORS.textLight },
  registerLink: { color: COLORS.primary, fontWeight: '700' }
});

export default LoginScreen;
