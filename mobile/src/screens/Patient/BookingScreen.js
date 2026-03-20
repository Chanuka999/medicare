import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Platform, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle, User } from 'lucide-react-native';
import apiClient from '../../api/api';
import { COLORS, SPACING } from '../../theme/colors';

const BookingScreen = ({ route, navigation }) => {
  const { doctor: initialDoctor } = route.params || {};
  
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor || null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingDocs, setFetchingDocs] = useState(!initialDoctor);

  const dates = [
    { id: 1, day: 'Mon', date: '12', full: '2024-06-12' },
    { id: 2, day: 'Tue', date: '13', full: '2024-06-13' },
    { id: 3, day: 'Wed', date: '14', full: '2024-06-14' },
    { id: 4, day: 'Thu', date: '15', full: '2024-06-15' },
    { id: 5, day: 'Fri', date: '16', full: '2024-06-16' },
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  useEffect(() => {
    if (!initialDoctor) {
      fetchDoctors();
    }
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await apiClient.get('/patient/doctors');
      setDoctors(res.data.data?.doctors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingDocs(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select doctor, date and time.");
      return;
    }

    try {
      setLoading(true);
      
      // Calculate a dummy end time (30 mins later)
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      let endMins = parseInt(minutes) + 30;
      let endHours = parseInt(hours);
      let endPeriod = period;

      if (endMins >= 60) {
        endMins -= 60;
        endHours += 1;
      }
      if (endHours > 12) endHours = 1;

      const formattedEnd = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')} ${endPeriod}`;

      console.log("Submitting booking:", {
        doctorId: selectedDoctor._id,
        appointmentDate: selectedDate.full,
        timeSlot: { startTime: selectedTime, endTime: formattedEnd },
        reason: reason || "General Checkup"
      });
      
      await apiClient.post('/patient/appointments', {
        doctorId: selectedDoctor._id,
        appointmentDate: selectedDate.full,
        timeSlot: { startTime: selectedTime, endTime: formattedEnd },
        reason: reason || "General Checkup"
      });
      
      if (Platform.OS === 'web') {
        alert("Booking Successful!");
        navigation.navigate('PatientDashboard');
      } else {
        Alert.alert("Success", "Appointment booked successfully!", [
          { text: "OK", onPress: () => navigation.navigate('PatientDashboard') }
        ]);
      }
    } catch (err) {
      console.error("Booking Error:", err);
      const errMsg = err.response?.data?.message || "Booking failed.";
      if (Platform.OS === 'web') {
        alert("Booking Error: " + errMsg);
      } else {
        Alert.alert("Failed", errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#0f172a" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Booking</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* 2. Main Content Split View */}
      <View style={[styles.mainWrapper, Platform.OS === 'web' && styles.webSplit]}>
        
        {/* Left Side: Selections */}
        <ScrollView 
          style={styles.leftColumn} 
          contentContainerStyle={styles.scroll} 
          showsVerticalScrollIndicator={false}
        >
          {/* Doctor Section */}
          <Text style={styles.sectionLabel}>Select Doctor</Text>
          {fetchingDocs ? (
            <ActivityIndicator color={COLORS.primary} style={{ margin: 20 }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.docScroll}>
               {(initialDoctor ? [initialDoctor] : doctors).map(doc => (
                 <TouchableOpacity 
                   key={doc._id} 
                   style={[styles.docCard, selectedDoctor?._id === doc._id && styles.activeDoc]}
                   onPress={() => setSelectedDoctor(doc)}
                 >
                    <View style={styles.avatarBox}>
                      <User color={selectedDoctor?._id === doc._id ? "#fff" : COLORS.primary} size={24} />
                    </View>
                    <Text style={[styles.docName, selectedDoctor?._id === doc._id && styles.activeText]}>{doc.userId?.name || "Dr"}</Text>
                    <Text style={[styles.docSub, selectedDoctor?._id === doc._id && styles.activeSub]}>{doc.specialization}</Text>
                 </TouchableOpacity>
               ))}
            </ScrollView>
          )}

          {/* Date Section */}
          <Text style={styles.sectionLabel}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
             {dates.map(d => (
               <TouchableOpacity 
                 key={d.id} 
                 style={[styles.dateCard, selectedDate?.id === d.id && styles.activeDate]}
                 onPress={() => setSelectedDate(d)}
               >
                  <Text style={[styles.dayText, selectedDate?.id === d.id && styles.activeText]}>{d.day}</Text>
                  <Text style={[styles.numText, selectedDate?.id === d.id && styles.activeText]}>{d.date}</Text>
               </TouchableOpacity>
             ))}
          </ScrollView>

          {/* Time Slots */}
          <Text style={styles.sectionLabel}>Available Slots</Text>
          <View style={styles.timeGrid}>
             {timeSlots.map(t => (
               <TouchableOpacity 
                 key={t} 
                 style={[styles.timeCard, selectedTime === t && styles.activeTime]}
                 onPress={() => setSelectedTime(t)}
               >
                  <Text style={[styles.timeSlotText, selectedTime === t && styles.activeText]}>{t}</Text>
               </TouchableOpacity>
             ))}
          </View>

          {/* On Mobile, Reason shows on bottom of scroll. On Web, it moves to sidebar */}
          {Platform.OS !== 'web' && (
            <>
              <Text style={styles.sectionLabel}>Reason for Visit</Text>
              <TextInput 
                placeholder="Describe your symptoms (optional)..." 
                multiline 
                numberOfLines={4}
                style={styles.reasonInput}
                value={reason}
                onChangeText={setReason}
              />
            </>
          )}
        </ScrollView>

        {/* Right Side: Sidebar (Visible on Web) */}
        {Platform.OS === 'web' && (
          <View style={styles.sidebar}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Doctor:</Text>
                <Text style={styles.summaryValue}>{selectedDoctor ? (selectedDoctor.userId?.name?.startsWith("Dr.") ? selectedDoctor.userId?.name : `Dr. ${selectedDoctor.userId?.name}`) : "Not Selected"}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Schedule:</Text>
                <Text style={styles.summaryValue}>{selectedDate ? `${selectedDate.day}, ${selectedDate.date} June` : "--"} {selectedTime ? `@ ${selectedTime}` : ""}</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>Reason for Visit</Text>
              <TextInput 
                placeholder="Type reason here..." 
                multiline 
                numberOfLines={6}
                style={styles.webReasonInput}
                value={reason}
                onChangeText={setReason}
              />

              <TouchableOpacity 
                style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
                onPress={() => {
                   console.log("Confirm button clicked!");
                   handleBooking();
                }}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <><CheckCircle color="#fff" size={20} /><Text style={styles.submitText}>Confirm Now</Text></>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Fixed Footer (Only for mobile) */}
      {Platform.OS !== 'web' && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
            onPress={handleBooking}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <><CheckCircle color="#fff" size={20} /><Text style={styles.submitText}>Confirm Appointment</Text></>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfdfe', height: Platform.OS === 'web' ? '100vh' : 'auto', overflow: 'hidden' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, paddingTop: Platform.OS === 'android' ? 45 : 15
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  mainWrapper: { flex: 1, flexDirection: 'column' },
  webSplit: { flexDirection: 'row', paddingHorizontal: 20, gap: 30 },
  leftColumn: { flex: 2 },
  sidebar: { flex: 1, paddingTop: 10 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 24, padding: 25, borderWidth: 1, borderColor: '#f1f5f9', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  summaryTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  summaryValue: { fontSize: 14, color: '#0f172a', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },
  webReasonInput: { backgroundColor: '#f8fafc', borderRadius: 15, padding: 15, height: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 20, fontSize: 14 },
  scroll: { paddingHorizontal: Platform.OS === 'web' ? 0 : 20, paddingBottom: 150, ...(Platform.OS === 'web' && { overflowY: 'auto' }) },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 15, paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    borderTopWidth: 1, borderTopColor: '#f1f5f9',
    elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 10,
    zIndex: 100
  },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 15, marginTop: 10 },
  docScroll: { marginBottom: 20 },
  docCard: { width: 140, backgroundColor: '#fff', padding: 15, borderRadius: 20, marginRight: 15, borderWidth: 1, borderColor: '#f1f5f9', alignItems: 'center' },
  activeDoc: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  avatarBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0fdfa', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  docName: { fontSize: 13, fontWeight: '700', color: '#0f172a', textAlign: 'center' },
  docSub: { fontSize: 11, color: '#94a3b8', marginTop: 3 },
  activeText: { color: '#fff' },
  activeSub: { color: 'rgba(255,255,255,0.7)' },
  dateScroll: { marginBottom: 25 },
  dateCard: { width: 65, height: 85, backgroundColor: '#fff', borderRadius: 18, marginRight: 12, borderWidth: 1, borderColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  activeDate: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dayText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  numText: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginTop: 5 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
  timeCard: { width: '31%', paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', alignItems: 'center' },
  activeTime: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeSlotText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  reasonInput: { backgroundColor: '#fff', borderRadius: 18, padding: 15, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 30 },
  submitBtn: { 
    height: 60, borderRadius: 20, backgroundColor: COLORS.primary, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    elevation: 5, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});

export default BookingScreen;
