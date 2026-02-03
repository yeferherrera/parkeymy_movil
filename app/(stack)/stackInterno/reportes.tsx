import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import AppNav from '../../../components/ui/nav';

import { useRouter } from 'expo-router';
const router = useRouter();

export default function MisReportes() {
  const reportes = [
    {
      id: '1',
      titulo: 'Reporte de artículo electrónico',
      fecha: '10/01/2026',
      estado: 'Enviado',
    },
    {
      id: '2',
      titulo: 'Reporte de vehículo',
      fecha: '05/01/2026',
      estado: 'Pendiente',
    },
  ];

  return (
     
    <View style={styles.container}>

        <AppNav title="Mis reportes" />
    
      {/* Lista de reportes */}
      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <FontAwesome name="file-text" size={28} color="#004C97" />
            <View style={styles.cardInfo}>
              <Text style={styles.title}>{item.titulo}</Text>
              <Text style={styles.date}>Fecha: {item.fecha}</Text>
            </View>
            <Text
              style={[
                styles.status,
                item.estado === 'Enviado'
                  ? styles.sent
                  : styles.pending,
              ]}
            >
              {item.estado}
            </Text>
          </View>
        )}
      />
    {/* Botón nuevo reporte */}
      <TouchableOpacity style={styles.newButton} onPress={()=>{router.push('/stackInterno/nuevoReporte')}}>
        <FontAwesome name="plus" size={16} color="#fff" />
        <Text style={styles.newButtonText}>Nuevo reporte</Text>
      </TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },

  newButton: {
    flexDirection: 'row',
    backgroundColor: '#004C97',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
    
  },

  newButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  date: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  status: {
    fontSize: 12,
    fontWeight: '600',
  },

  sent: {
    color: '#16A34A',
  },

  pending: {
    color: '#F59E0B',
  },
});
