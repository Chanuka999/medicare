import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, ActivityIndicator, TextInput } from 'react-native';
import { ChevronLeft, Calendar as CalendarIcon, Clock, MapPin, Plus, User as UserIcon } from 'lucide-react-native';
import apiClient from '../../api/api';
import { COLORS, SPACING } from '../../theme/colors';

const AppointmentScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptRes, docRes] = await Promise.all([
        apiClient.get('/patient/appointments'),
        apiClient.get('/patient/doctors')
      ]);
      setAppointments(aptRes.data.data?.appointments || []);
      setDoctors(docRes.data.data?.doctors || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#0f172a" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Health Portal</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput 
          placeholder="Search doctors, appointments..." 
          style={styles.searchBar}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabBar}>
         <Tab title="Upcoming" active={activeTab === 'Upcoming'} onPress={() => setActiveTab('Upcoming')} />
         <Tab title="History" active={activeTab === 'History'} onPress={() => setActiveTab('History')} />
         <Tab title="Find Doctors" active={activeTab === 'Doctors'} onPress={() => setActiveTab('Doctors')} />
      </View>

      {loading ? (
        <View style={styles.center}>
           <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll}>
          {activeTab === 'Upcoming' && (
            <>
              {appointments
                .filter(a => a.status === 'scheduled')
                .filter(a => (a.doctorId?.userId?.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
                .length > 0 ? appointments
                  .filter(a => a.status === 'scheduled')
                  .filter(a => (a.doctorId?.userId?.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((apt) => <AptCard key={apt._id} apt={apt} />) 
                : (
                <View style={styles.emptyContainer}>
                    <CalendarIcon color="#cbd5e1" size={80} />
                    <Text style={styles.emptyText}>No upcoming appointments</Text>
                </View>
              )}
            </>
          )}

          {activeTab === 'History' && (
            <>
              {appointments
                .filter(a => a.status !== 'scheduled')
                .filter(a => (a.doctorId?.userId?.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
                .length > 0 ? appointments
                  .filter(a => a.status !== 'scheduled')
                  .filter(a => (a.doctorId?.userId?.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((apt) => <AptCard key={apt._id} apt={apt} />)
                : (
                <View style={styles.emptyContainer}>
                    <Clock color="#cbd5e1" size={80} />
                    <Text style={styles.emptyText}>No appointment history</Text>
                </View>
              )}
            </>
          )}

          {activeTab === 'Doctors' && (
            <>
               {doctors
                 .filter(d => 
                   (d.userId?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                   (d.specialization || "").toLowerCase().includes(searchQuery.toLowerCase())
                 )
                 .map((doc) => (
                    <DocCard key={doc._id} doc={doc} navigation={navigation} />
               ))}
            </>
          )}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Booking')}>
         <Plus color="#fff" size={28} />
         <Text style={styles.fabText}>New Booking</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const AptCard = ({ apt }) => (
  <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
         <View style={styles.docImg}>
            <UserIcon color="#94a3b8" size={30} />
         </View>
         <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.docName}>{apt.doctorId?.userId?.name || "MD Specialist"}</Text>
            <Text style={styles.specialty}>{apt.doctorId?.specialization || "General"}</Text>
         </View>
         <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{apt.status}</Text>
         </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.detailsRow}>
         <View style={styles.detailItem}>
            <CalendarIcon color={COLORS.primary} size={16} />
            <Text style={styles.detailText}>{new Date(apt.appointmentDate).toLocaleDateString()}</Text>
         </View>
         <View style={styles.detailItem}>
            <Clock color={COLORS.primary} size={16} />
            <Text style={styles.detailText}>{apt.timeSlot?.startTime || apt.timeSlot || "N/A"}</Text>
         </View>
      </View>
  </TouchableOpacity>
);

const DocCard = ({ doc, navigation }) => (
  <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
         <View style={styles.docImg}>
            <Image 
               source={{ uri: `https://ui-avatars.com/api/?name=${doc.userId?.name || "Dr"}&background=0f766e&color=fff` }} 
               style={{ width: '100%', height: '100%', borderRadius: 15 }} 
            />
         </View>
         <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.docName}>Dr. {doc.userId?.name || "Specialist"}</Text>
            <Text style={styles.specialty}>{doc.specialization}</Text>
         </View>
         <TouchableOpacity style={styles.bookIconBtn} onPress={() => navigation.navigate('Booking', { doctor: doc })}>
            <Plus color={COLORS.primary} size={20} />
         </TouchableOpacity>
      </View>
  </TouchableOpacity>
);

const Tab = ({ title, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.activeTab]}>
    <Text style={[styles.tabText, active && styles.activeTabText]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfdfe' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, paddingTop: Platform.OS === 'android' ? 45 : 15
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 15 },
  searchBar: { backgroundColor: '#f1f5f9', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, fontSize: 14, color: '#1e293b' },
  tabBar: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontWeight: '700', color: '#94a3b8', fontSize: 14 },
  activeTabText: { color: '#0f172a' },
  scroll: { paddingHorizontal: 20, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  docImg: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  docName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  specialty: { fontSize: 13, color: '#94a3b8' },
  statusBadge: { backgroundColor: '#e0f2f1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { color: COLORS.primary, fontSize: 10, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
  detailsRow: { flexDirection: 'row', gap: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 13, color: '#1e293b', fontWeight: '800' },
  bookIconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0fdfa', justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 10, fontWeight: '600' },
  fab: { 
    position: 'absolute', bottom: 30, right: 30, left: 30, height: 60, borderRadius: 20, 
    backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    elevation: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15
  },
  fabText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});

export default AppointmentScreen;
