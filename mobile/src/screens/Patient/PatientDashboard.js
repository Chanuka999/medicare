import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions, SafeAreaView, Platform } from 'react-native';
import { Calendar, FileText, Bell, Search, User, LogOut, Plus, Activity, Heart } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '../../theme/colors';

const { width } = Dimensions.get('window');

const PatientDashboard = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) setUser(JSON.parse(data));
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Landing');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={{ uri: `https://ui-avatars.com/api/?name=${user?.name || "P"}&background=0f766e&color=fff&size=128` }}
            style={styles.profilePic}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.welcomeText}>Welcome Back,</Text>
            <Text style={styles.userName}>{user?.name || "Patient"}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
           <TouchableOpacity style={[styles.iconBtn, { marginRight: 10 }]} onPress={handleLogout}>
             <LogOut color="#ef4444" size={20} />
           </TouchableOpacity>
           <TouchableOpacity style={styles.iconBtn}>
             <Bell color={COLORS.text} size={20} />
             <View style={styles.dot} />
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color={COLORS.textLight} size={20} />
          <Text style={styles.searchPlaceholder}>Search for your doctor...</Text>
        </View>

        {/* Premium Banner */}
        <TouchableOpacity activeOpacity={0.9} style={styles.premiumBanner}>
           <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=1000' }} 
              style={styles.bannerImage}
              resizeMode="cover"
           />
           <View style={styles.bannerOverlay}>
              <Text style={styles.bannerBadge}>LIVE UPDATE</Text>
              <Text style={styles.bannerTitle}>Check Symptoms &{"\n"}Talk to AI Doctor</Text>
              <TouchableOpacity style={styles.bannerBtn}>
                 <Text style={styles.bannerBtnText}>Consult Now</Text>
              </TouchableOpacity>
           </View>
        </TouchableOpacity>

        {/* Main Services */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Main Services</Text>
        </View>
        
        <View style={styles.quickGrid}>
           <ModernCard 
              icon={<Calendar color="#0f766e" size={24} />} 
              title="Appointments" 
              desc="Book or Manage" 
              onPress={() => navigation.navigate('Appointments')}
           />
           <ModernCard 
              icon={<FileText color="#3b82f6" size={24} />} 
              title="Reports" 
              desc="Lab results" 
              onPress={() => navigation.navigate('Reports')}
           />
           <ModernCard icon={<Plus color="#8b5cf6" size={24} />} title="Pharmacy" desc="Buy Medicine" />
           <ModernCard icon={<Activity color="#f59e0b" size={24} />} title="Vitals" desc="Check Health" />
        </View>

        {/* Appointments Section */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Recent Appointments</Text>
           <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
              <Text style={styles.seeAll}>See All</Text>
           </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.aptCard} onPress={() => navigation.navigate('Appointments')}>
           <View style={styles.docAvatarContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400' }} 
                style={styles.docAvatar} 
              />
           </View>
           <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.docName}>Dr. Sahan Perera</Text>
              <Text style={styles.docSpecialty}>Cardiologist • General Hospital</Text>
              <View style={styles.statusRow}>
                  <View style={styles.timeTag}>
                     <Text style={styles.timeText}>09:30 AM</Text>
                  </View>
                  <Text style={styles.dateText}>Tomorrow, Jun 12</Text>
              </View>
           </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut color={COLORS.error} size={20} />
            <Text style={styles.logoutText}>Account Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modern FAB */}
      <TouchableOpacity style={styles.modernFab} onPress={() => navigation.navigate('Booking')}>
         <Plus color="#fff" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const ModernCard = ({ icon, title, desc, onPress }) => (
  <TouchableOpacity style={styles.modernItem} onPress={onPress}>
     <View style={styles.modernIconBox}>{icon}</View>
     <Text style={styles.modernTitle}>{title}</Text>
     <Text style={styles.modernDesc}>{desc}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfdfe' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 50 : 20, paddingBottom: 20
  },
  profilePic: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#e2e8f0' },
  welcomeText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  userName: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  headerActions: { flexDirection: 'row' },
  iconBtn: { 
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#fff', 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9',
    position: 'relative'
  },
  dot: { position: 'absolute', top: 12, right: 12, width: 7, height: 7, borderRadius: 4, backgroundColor: '#ef4444', borderWidth: 1.5, borderColor: '#fff' },
  scroll: { paddingHorizontal: 20, paddingBottom: 100 },
  searchContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    borderRadius: 20, padding: 15, marginBottom: 25, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2
  },
  searchPlaceholder: { marginLeft: 12, color: '#94a3b8', fontSize: 15 },
  premiumBanner: { 
    height: 180, borderRadius: 28, overflow: 'hidden', marginBottom: 30,
    elevation: 10, shadowColor: '#0f766e', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { 
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(15, 118, 110, 0.7)', padding: 20, justifyContent: 'center'
  },
  bannerBadge: { backgroundColor: '#f59e0b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', color: '#fff', fontSize: 10, fontWeight: '900', marginBottom: 10 },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  bannerBtn: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start', marginTop: 15 },
  bannerBtnText: { color: '#0f766e', fontWeight: '800', fontSize: 13 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  seeAll: { color: '#0f766e', fontWeight: '700', fontSize: 13 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  modernItem: { 
    width: (width - 55) / 2, backgroundColor: '#fff', padding: 15, borderRadius: 24, marginBottom: 15, 
    borderWidth: 1, borderColor: '#f1f5f9'
  },
  modernIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  modernTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  modernDesc: { fontSize: 12, color: '#64748b', marginTop: 4 },
  aptCard: { 
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 24, padding: 15, marginBottom: 20,
    borderWidth: 1, borderColor: '#f1f5f9'
  },
  docAvatarContainer: { width: 70, height: 70, borderRadius: 20, overflow: 'hidden' },
  docAvatar: { width: '100%', height: '100%' },
  docName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  docSpecialty: { color: '#94a3b8', fontSize: 12, marginVertical: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  timeTag: { backgroundColor: '#e0f2f1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  timeText: { color: '#0f766e', fontWeight: '800', fontSize: 10 },
  dateText: { color: '#64748b', fontSize: 11, fontWeight: '600' },
  logoutBtn: { 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', 
    backgroundColor: '#fff', padding: 15, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#fee2e2'
  },
  logoutText: { color: '#ef4444', fontWeight: '700', marginLeft: 10 },
  modernFab: { 
    position: 'absolute', bottom: 30, right: 30, width: 62, height: 62, borderRadius: 22, 
    backgroundColor: '#0f766e', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8
  }
});

export default PatientDashboard;
