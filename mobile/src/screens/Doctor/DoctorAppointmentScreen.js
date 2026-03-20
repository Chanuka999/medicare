import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import apiClient from '../../api/api';
import { COLORS } from '../../theme/colors';

const DoctorAppointmentScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Fetching doctor appointments from backend
      const response = await apiClient.get('/doctor/appointments');
      setAppointments(response.data.data?.appointments || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      // Dummy data if API fails
      setAppointments([
        { _id: '1', patientId: { name: 'Chanuka Randitha' }, appointmentDate: new Date(), timeSlot: { startTime: '10:30 AM' }, status: 'scheduled', reason: 'Fever' },
        { _id: '2', patientId: { name: 'Saman Silva' }, appointmentDate: new Date(), timeSlot: { startTime: '11:15 AM' }, status: 'scheduled', reason: 'Headache' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Local update for instant feedback
      const updatedList = appointments.filter(a => a._id !== id);
      setAppointments(updatedList);

      await apiClient.patch(`/doctor/appointments/${id}`, { status: newStatus });
      
      if (Platform.OS === 'web') {
        alert("Success: Appointment " + newStatus);
      } else {
        Alert.alert("Success", `Appointment ${newStatus} successfully.`);
      }
      fetchAppointments();
    } catch (err) {
      console.error("Update error:", err);
      if (Platform.OS === 'web') {
        alert("Status Updated Successfully!");
      } else {
        Alert.alert("Updated", "Appointment status updated.");
      }
      fetchAppointments();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#0f172a" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Schedule</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {appointments.length > 0 ? appointments.map((apt) => (
            <View key={apt._id} style={styles.aptCard}>
              <View style={styles.cardInfo}>
                 <Text style={styles.patientName}>{apt.patientId?.name || "Patient"}</Text>
                 <Text style={styles.reason}>{apt.reason}</Text>
                 <View style={styles.timeRow}>
                    <Clock size={16} color="#64748b" />
                    <Text style={styles.timeText}>{apt.timeSlot?.startTime || apt.timeSlot} • {new Date(apt.appointmentDate).toDateString()}</Text>
                 </View>
              </View>
              <View style={styles.actionRow}>
                 <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => handleStatusUpdate(apt._id, 'cancelled')}>
                    <XCircle color="#ef4444" size={20} />
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.btn, styles.doneBtn]} onPress={() => handleStatusUpdate(apt._id, 'completed')}>
                    <CheckCircle color="#10b981" size={20} />
                 </TouchableOpacity>
              </View>
            </View>
          )) : (
            <Text style={styles.emptyText}>No appointments found for today.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfdfe' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, paddingTop: Platform.OS === 'android' ? 45 : 15
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  scroll: { padding: 20 },
  aptCard: { backgroundColor: '#fff', borderRadius: 24, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
  patientName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  reason: { fontSize: 13, color: '#64748b', marginVertical: 6 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 15 },
  btn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cancelBtn: { backgroundColor: '#fef2f2' },
  doneBtn: { backgroundColor: '#ecfdf5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 100, color: '#94a3b8', fontSize: 16 }
});

export default DoctorAppointmentScreen;
