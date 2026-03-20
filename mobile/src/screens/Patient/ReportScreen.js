import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Platform, Image, ActivityIndicator } from 'react-native';
import { ChevronLeft, Search, FileText, Download, Share2, Calendar } from 'lucide-react-native';
import apiClient from '../../api/api';
import { COLORS, SPACING } from '../../theme/colors';

const ReportScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/patient/medical-records');
      setReports(res.data.data?.records || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r => 
    r.title?.toLowerCase().includes(search.toLowerCase()) || 
    r.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#0f172a" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Reports</Text>
        <TouchableOpacity style={styles.backBtn} onPress={fetchRecords}>
            <Share2 color="#0f172a" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
         <Search color="#94a3b8" size={20} />
         <TextInput 
            placeholder="Search by report name..." 
            style={styles.input} 
            value={search}
            onChangeText={setSearch}
         />
      </View>

      {loading ? (
        <View style={styles.center}>
           <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll}>
          <Text style={styles.sectionTitle}>Recent Reports ({filteredReports.length})</Text>

          {filteredReports.map((report) => (
            <View key={report._id} style={styles.reportCard}>
               <View style={styles.iconBox}>
                  <FileText color="#fff" size={24} />
               </View>
               <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <View style={styles.metaRow}>
                      <Text style={styles.metaText}>{report.category || "General"}</Text>
                      <View style={styles.dot} />
                      <Text style={styles.metaText}>{new Date(report.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.sizeText}>Uploaded by Dr. {report.doctor?.name || "MD"}</Text>
               </View>
               <TouchableOpacity style={styles.dlBtn}>
                  <Download color={COLORS.primary} size={20} />
               </TouchableOpacity>
            </View>
          ))}

          {filteredReports.length === 0 && (
             <View style={styles.emptyContainer}>
                <FileText color="#cbd5e1" size={80} />
                <Text style={styles.emptyText}>No reports found</Text>
             </View>
          )}

          <View style={styles.banner}>
              <View style={{ flex: 1 }}>
                  <Text style={styles.bannerTitle}>Missing a Report?</Text>
                  <Text style={styles.bannerText}>Contact our lab support if your latest reports are not showing here.</Text>
              </View>
              <TouchableOpacity style={styles.contactBtn}>
                  <Text style={styles.contactText}>Get Help</Text>
              </TouchableOpacity>
          </View>
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
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, backgroundColor: '#fff', 
    borderRadius: 18, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 20
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1e293b' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 50, marginBottom: 20 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 10, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#64748b', marginBottom: 15 },
  reportCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, 
    borderRadius: 22, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 15, elevation: 1 
  },
  iconBox: { width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  reportTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', mx: 8, marginHorizontal: 8 },
  sizeText: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  dlBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0fdfa', justifyContent: 'center', alignItems: 'center' },
  banner: { 
    backgroundColor: '#0f172a', padding: 25, borderRadius: 24, marginTop: 20,
    flexDirection: 'row', alignItems: 'center'
  },
  bannerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  bannerText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 5, lineHeight: 18 },
  contactBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, marginLeft: 15 },
  contactText: { color: '#fff', fontWeight: '800', fontSize: 12 }
});

export default ReportScreen;
