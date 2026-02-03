import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import CustomInput from '@/components/input/customInput';
import SelectInput from '@/components/input/selectInput';
import AppNav from '@/components/ui/nav';

export default function NuevoReporte() {
  const [tipoReporte, setTipoReporte] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppNav title="Mis reportes" />
      
      {/* Tipo de reporte */}
      <SelectInput
        label="Tipo de reporte"
        selectedValue={tipoReporte}
        onValueChange={setTipoReporte}
        options={[
          { label: 'Seleccione una opción', value: '' },
          { label: 'Artículo', value: 'articulo' },
          { label: 'Vehículo', value: 'vehiculo' },
          { label: 'Incidente', value: 'incidente' },
        ]}
      />

      {/* Título */}
      <CustomInput
        label="Título del reporte"
        placeholder="Ej: Daño en artículo electrónico"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* Descripción */}
      <CustomInput
        label="Descripción"
        placeholder="Describe el reporte..."
        value={descripcion}
        onChangeText={setDescripcion}
        
        
      />

      {/* Fecha (informativa) */}
      <View style={styles.dateBox}>
        <Text style={styles.dateLabel}>Fecha</Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Botón enviar */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Enviar reporte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
  },

  dateBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  dateLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },

  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  button: {
    backgroundColor: '#004C97',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
