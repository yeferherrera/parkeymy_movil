import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AppNav from '@/components/ui/nav';

export default function GenerarQRScreen() {

  // 🔹 Simulación de artículos registrados
  const [articulos, setArticulos] = useState([
    { id: '1', nombre: 'Portátil', selected: false },
    { id: '2', nombre: 'Mouse', selected: false },
    { id: '3', nombre: 'Teclado', selected: false },
    { id: '4', nombre: 'Audífonos', selected: false },
  ]);

  const toggleArticulo = (id:string) => {
    setArticulos(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const seleccionados = articulos.filter(a => a.selected);

  return (
    <View style={styles.container}>

        <AppNav title="" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generar código QR</Text>
        <Text style={styles.headerSubtitle}>
          Selecciona los artículos que vas a ingresar
        </Text>
      </View>

      {/* LISTA DE ARTÍCULOS */}
      <FlatList
        data={articulos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              item.selected && styles.cardSelected
            ]}
            onPress={() => toggleArticulo(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardText}>{item.nombre}</Text>

            {item.selected && (
              <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
            )}
          </TouchableOpacity>
        )}
      />

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.counter}>
          Artículos seleccionados: {seleccionados.length}
        </Text>

        <TouchableOpacity
          style={[
            styles.qrButton,
            seleccionados.length === 0 && styles.qrDisabled
          ]}
          disabled={seleccionados.length === 0}
          onPress={() => {
            // aquí ¡debo conectar despues el qr
            console.log('Generar QR con:', seleccionados);
          }}
        >
          <FontAwesome5 name="qrcode" size={24} color="#fff" />
          <Text style={styles.qrText}>Generar QR</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  header: {
    backgroundColor: '#004C97',
    paddingTop: 2,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
   
  },

  headerTitle: {
    textAlign: "center",
    color: '#fff',
    fontSize: 22,
   
  },

  headerSubtitle: {
    textAlign: "center",
    color: '#E0E7FF',
    marginTop: 10,
    fontSize: 14,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },

  cardSelected: {
    borderWidth: 1.5,
    borderColor: '#16A34A',
  },

  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },

  counter: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
  },

  qrButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 50,
  },

  qrDisabled: {
    backgroundColor: '#9CA3AF',
  },

  qrText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
