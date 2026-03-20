import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Calendar, Users, Clipboard, LogOut, Bell, ChevronRight, Clock, UserCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/api';
import { COLORS } from '../../theme/colors';

const DoctorDashboard = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ today: 0, pending: 0, completed: 0 });

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Fetch dummy stats for now
      setStats({ today: 12, pending: 4, completed: 8 });
    } catch (err) {
      console.error("Error fetching doctor data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Landing');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome, Doctor</Text>
          <Text style={styles.userName}>Dr. {user?.name || "Specialist"}</Text>
        </View>
        <View style={styles.headerActions}>
           <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
              <LogOut color="#ef4444" size={20} />
           </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          {/* Stats Section */}
          <View style={styles.statsGrid}>
             <StatCard title="Today" value={stats.today} icon={<Calendar color="#0f766e" size={20} />} color="#f0fdfa" />
             <StatCard title="Pending" value={stats.pending} icon={<Clock color="#f59e0b" size={20} />} color="#fffbeb" />
             <StatCard title="Done" value={stats.completed} icon={<UserCheck color="#3b82f6" size={20} />} color="#eff6ff" />
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Management</Text>
          <View style={styles.actionGrid}>
             <ActionItem title="Schedule" icon={<Calendar color="#fff" size={24} />} color="#0f766e" onPress={() => navigation.navigate('DrAppointments')} />
             <ActionItem title="Patients" icon={<Users color="#fff" size={24} />} color="#3b82f6" onPress={() => navigation.navigate('DrAppointments')} />
             <ActionItem title="Reports" icon={<Clipboard color="#fff" size={24} />} color="#8b5cf6" onPress={() => navigation.navigate('Reports')} />
          </View>

          {/* Upcoming Appointments List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Main Appointments</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Manage All</Text></TouchableOpacity>
          </View>

          {[1, 2, 3].map((item) => (
             <TouchableOpacity key={item} style={styles.aptCard} onPress={() => navigation.navigate('DrAppointments')}>
                <View style={styles.patientAvatar}>
                   <Text style={styles.avatarText}>P{item}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                   <Text style={styles.patientName}>Chanuka Randitha</Text>
                   <Text style={styles.aptType}>General Checkup • 10:30 AM</Text>
                </View>
                <ChevronRight color="#cbd5e1" size={20} />
             </TouchableOpacity>
          ))}

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
     <View style={styles.statIcon}>{icon}</View>
     <Text style={styles.statValue}>{value}</Text>
     <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const ActionItem = ({ title, icon, color, onPress }) => (
  <TouchableOpacity style={styles.actionColumn} onPress={onPress}>
     <View style={[styles.actionIcon, { backgroundColor: color }]}>{icon}</View>
     <Text style={styles.actionTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfdfe' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 50 : 20, paddingBottom: 25
  },
  welcomeText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  userName: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  iconBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { width: '31%', padding: 15, borderRadius: 24, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginVertical: 4 },
  statTitle: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 15 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  actionColumn: { alignItems: 'center', width: '30%' },
  actionIcon: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: '#475569' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAll: { color: '#0f766e', fontWeight: '700', fontSize: 13 },
  aptCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 24, marginBottom: 15, borderWidth: 1, borderColor: '#f1f5f9' },
  patientAvatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontWeight: '800', color: '#0f766e' },
  patientName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  aptType: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default DoctorDashboard;
