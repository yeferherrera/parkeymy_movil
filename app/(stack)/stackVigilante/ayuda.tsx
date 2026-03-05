import React, { useState } from "react";
import { Modal, Linking, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AppNav from '@/components/ui/nav';
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const faqs = [
  {
    pregunta: '¿Qué hago si el QR no escanea?',
    respuesta: 'Pide al aprendiz que genere un nuevo QR. Los QR expiran después de cierto tiempo y solo pueden usarse una vez.'
  },
  {
    pregunta: '¿Qué significa cada estado de artículo?',
    respuesta: 'Registrado: aún no ha ingresado al complejo. En sede: está dentro del complejo. Retirado: salió del complejo.'
  },
  {
    pregunta: '¿Qué hago si el QR dice "inválido"?',
    respuesta: 'El QR puede estar expirado o ya fue usado. Pide al aprendiz que genere uno nuevo desde su app.'
  },
  {
    pregunta: '¿Puedo validar el mismo QR dos veces?',
    respuesta: 'No. Cada QR solo puede ser usado una vez. Después de validarlo queda marcado como usado automáticamente.'
  },
  {
    pregunta: '¿Cómo sé si es un QR de ingreso o salida?',
    respuesta: 'Al escanear el QR la app te muestra una pantalla de confirmación indicando claramente si es ingreso o salida antes de registrar.'
  },
  {
    pregunta: '¿Qué pasa si confirmo un movimiento por error?',
    respuesta: 'Comunícate con el administrador del sistema para que pueda corregir el movimiento manualmente.'
  },
];

export default function AyudaVigilanteScreen() {
  const [expandido, setExpandido] = useState<number | null>(null);
  const [modalContacto, setModalContacto] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
      <AppNav title="Ayuda" />

      {/* MODAL DE CONTACTO */}
      <Modal
        visible={modalContacto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalContacto(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
          onPress={() => setModalContacto(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              elevation: 20,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
            }}
          >
            {/* Icono */}
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: '#EEF5FF',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: 16,
            }}>
              <Ionicons name="headset-outline" size={32} color="#004C97" />
            </View>

            <Text style={{
              fontSize: 20,
              fontWeight: '800',
              color: '#111827',
              textAlign: 'center',
              marginBottom: 6,
            }}>
              Contacto soporte
            </Text>

            <Text style={{
              fontSize: 14,
              color: '#6B7280',
              textAlign: 'center',
              marginBottom: 24,
            }}>
              Estamos disponibles para ayudarte
            </Text>

            {/* Correo */}
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:yefersonyefersonherrera123@gmail.com')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: '#F8FAFC',
                borderRadius: 14,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#EEF5FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="mail-outline" size={20} color="#004C97" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '600' }}>CORREO</Text>
                <Text style={{ fontSize: 13, color: '#111827', fontWeight: '600' }} numberOfLines={1}>
                  yefersonyefersonherrera123@gmail.com
                </Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Teléfono */}
            <TouchableOpacity
              onPress={() => Linking.openURL('tel:+573176846802')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: '#F8FAFC',
                borderRadius: 14,
                padding: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#D1FAE5',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="call-outline" size={20} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '600' }}>TELÉFONO</Text>
                <Text style={{ fontSize: 13, color: '#111827', fontWeight: '600' }}>
                  +57 317 684 6802
                </Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalContacto(false)}
              style={{
                backgroundColor: '#004C97',
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Cerrar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* HEADER */}
      <View style={{
        backgroundColor: '#004C97',
        paddingTop: 2,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        marginBottom: 8,
      }}>
        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 22, fontWeight: '700' }}>
          Ayuda y soporte
        </Text>
        <Text style={{ textAlign: 'center', color: '#E0E7FF', marginTop: 6, fontSize: 14 }}>
          Todo lo que necesitas como vigilante
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

        {/* ACCIONES RÁPIDAS */}
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#374151', marginBottom: 12 }}>
          Accesos rápidos
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.push('/(stack)/stackVigilante/escanearQr')}
            style={{
              flex: 1,
              backgroundColor: '#D1FAE5',
              borderColor: '#16A34A',
              borderWidth: 1.5,
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Ionicons name="qr-code-outline" size={28} color="#16A34A" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#16A34A' }}>Escanear QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(stack)/stackVigilante/articulosFuera')}
            style={{
              flex: 1,
              backgroundColor: '#EEF5FF',
              borderColor: '#004C97',
              borderWidth: 1.5,
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Ionicons name="cube-outline" size={28} color="#004C97" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#004C97' }}>Artículos fuera</Text>
          </TouchableOpacity>
        </View>

        {/* GUÍA RÁPIDA */}
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#374151', marginBottom: 12 }}>
          Guía rápida
        </Text>

        <View style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
          elevation: 3,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}>
          {[
            { icon: 'qr-code-outline', color: '#16A34A', texto: 'Toca "Escanear QR" para abrir la cámara' },
            { icon: 'eye-outline', color: '#004C97', texto: 'Revisa los artículos del movimiento antes de confirmar' },
            { icon: 'checkmark-circle-outline', color: '#F39C12', texto: 'Confirma el ingreso o salida según corresponda' },
            { icon: 'shield-checkmark-outline', color: '#E74C3C', texto: 'El sistema actualiza los estados automáticamente' },
          ].map((item, i) => (
            <View key={i} style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingVertical: 10,
              borderBottomWidth: i < 3 ? 1 : 0,
              borderBottomColor: '#F3F4F6',
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#F8FAFC',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: '#374151', lineHeight: 20 }}>
                {item.texto}
              </Text>
            </View>
          ))}
        </View>

        {/* PREGUNTAS FRECUENTES */}
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#374151', marginBottom: 12 }}>
          Preguntas frecuentes
        </Text>

        {faqs.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setExpandido(expandido === index ? null : index)}
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
              elevation: 2,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
            }}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8 }}>
                {item.pregunta}
              </Text>
              <Ionicons name={expandido === index ? 'chevron-up' : 'chevron-down'} size={18} color="#9CA3AF" />
            </View>
            {expandido === index && (
              <Text style={{ fontSize: 13, color: '#6B7280', lineHeight: 20, marginTop: 10 }}>
                {item.respuesta}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        {/* CONTACTO */}
        <View style={{
          borderTopWidth: 1,
          borderColor: '#E0E0E0',
          paddingTop: 24,
          paddingBottom: 20,
          alignItems: 'center',
        }}>
          <TouchableOpacity onPress={() => setModalContacto(true)}>
            <Text style={{
              textAlign: 'center',
              fontSize: 16,
              color: '#3b49ca',
              fontWeight: '600',
              textDecorationLine: 'underline',
            }}>
              ¿Necesitas más ayuda? Contáctanos
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}