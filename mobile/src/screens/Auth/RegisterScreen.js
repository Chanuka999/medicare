import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Mail, Lock, User, Phone, CheckCircle2, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/api';
import { COLORS, SPACING } from '../../theme/colors';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [isDoctor, setIsDoctor] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    
    setLoading(true);
    try {
        const response = await apiClient.post('/auth/register', {
            ...form,
            role: isDoctor ? 'doctor' : 'patient',
            gender: 'other' // Placeholder as we don't have a picker yet
        });
        
        Alert.alert("Success", "Account created successfully! Please login.");
        navigation.navigate('Login');
    } catch (err) {
        const msg = err.response?.data?.message || "Registration failed. Try again.";
        Alert.alert("Error", msg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color={COLORS.text} size={24} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Join Medicare</Text>
          <Text style={styles.subtitle}>Start your healthcare journey with us</Text>
          
          <View style={styles.roleToggle}>
             <TouchableOpacity 
               style={[styles.roleBtn, !isDoctor && styles.activeRole]} 
               onPress={() => setIsDoctor(false)}
             >
                <Text style={[styles.roleText, !isDoctor && styles.activeRoleText]}>Patient</Text>
             </TouchableOpacity>
             <TouchableOpacity 
               style={[styles.roleBtn, isDoctor && styles.activeRole]} 
               onPress={() => setIsDoctor(true)}
             >
                <Text style={[styles.roleText, isDoctor && styles.activeRoleText]}>Doctor</Text>
             </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formArea}>
          <View style={styles.inputBox}>
            <User color={COLORS.textLight} size={20} />
            <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={(val) => setForm({...form, name: val})} />
          </View>

          <View style={styles.inputBox}>
            <Mail color={COLORS.textLight} size={20} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={form.email} onChangeText={(val) => setForm({...form, email: val})} autoCapitalize="none" />
          </View>

          <View style={styles.inputBox}>
            <Phone color={COLORS.textLight} size={20} />
            <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={form.phone} onChangeText={(val) => setForm({...form, phone: val})} />
          </View>

          <View style={styles.inputBox}>
            <Lock color={COLORS.textLight} size={20} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={(val) => setForm({...form, password: val})} />
          </View>

          <TouchableOpacity style={[styles.regBtn, loading && styles.disabled]} onPress={handleRegister} disabled={loading}>
            <Text style={styles.regBtnText}>{loading ? 'Creating Account...' : 'Register'}</Text>
            {!loading && <CheckCircle2 color="white" size={20} />}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
            <Text style={{color: COLORS.textLight}}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{color: COLORS.primary, fontWeight: '700'}}>Login</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { flexGrow: 1, padding: SPACING.l, paddingTop: 60 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  header: { marginBottom: SPACING.xxl },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginBottom: 5 },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: 15 },
  roleToggle: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, marginTop: 10 },
  roleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeRole: { backgroundColor: COLORS.primary },
  roleText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  activeRoleText: { color: '#fff' },
  formArea: { width: '100%', marginTop: 10 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', 
    borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0',
    paddingHorizontal: 15, marginBottom: SPACING.m, height: 62
  },
  input: { flex: 1, marginLeft: 10, color: COLORS.text, fontSize: 15 },
  regBtn: {
    backgroundColor: COLORS.primary, height: 65, borderRadius: 20,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12,
    marginTop: 10, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5
  },
  disabled: { opacity: 0.7 },
  regBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40, paddingBottom: 20 }
});

export default RegisterScreen;
