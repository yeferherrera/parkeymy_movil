import React, { useState } from "react";
import { Modal, Linking, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AppNav from '../../../components/ui/nav';
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const faqs = [
  {
    pregunta: '¿Cómo registro un artículo?',
    respuesta: 'Ve a "Mis artículos" y toca el botón "+". Llena los campos requeridos y confirma el registro.'
  },
  {
    pregunta: '¿Cómo genero un QR de ingreso?',
    respuesta: 'Ve a la pestaña "Mi QR", selecciona los artículos que vas a ingresar y toca "Generar QR de ingreso".'
  },
  {
    pregunta: '¿Cuánto tiempo dura el QR?',
    respuesta: 'El QR expira en 2 horas desde su generación. Si expira, debes generar uno nuevo.'
  },
  {
    pregunta: '¿Qué significa cada estado de artículo?',
    respuesta: 'Registrado: aún no ha ingresado. En sede: está dentro del complejo. Retirado: salió del complejo.'
  },
  {
    pregunta: '¿Puedo editar un artículo que ya ingresó?',
    respuesta: 'No. Solo puedes editar artículos en estado "Registrado". Si está en sede debes esperar a retirarlo.'
  },
  {
    pregunta: '¿Cómo hago el QR de salida?',
    respuesta: 'Ve a "Mi QR", cambia el modo a "Salida", selecciona los artículos que están en sede y genera el QR.'
  },
];

export default function AyudaYSoporteScreen() {
  const [expandido, setExpandido] = useState<number | null>(null);
  const [modalContacto, setModalContacto] = useState(false); // 👈 nuevo estado

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
      <AppNav title="" />

      {/* ── MODAL DE CONTACTO ── */}
      <Modal
        visible={modalContacto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalContacto(false)}
      >
        {/* Fondo oscuro */}
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
          {/* Tarjeta — stopPropagation para que no cierre al tocar adentro */}
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

            {/* Título */}
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

            {/* Botón cerrar */}
            <TouchableOpacity
              onPress={() => setModalContacto(false)}
              style={{
                backgroundColor: '#004C97',
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                Cerrar
              </Text>
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
          Todo lo que necesitas saber
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

        {/* ACCIONES RÁPIDAS */}
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#374151', marginBottom: 12 }}>
          Accesos rápidos
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.push('/stackInterno/historial')}
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
            <Ionicons name="time-outline" size={28} color="#004C97" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#004C97' }}>Ver historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#FFF9E6',
              borderColor: '#F1C40F',
              borderWidth: 1.5,
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: 'center',
              gap: 8,
            }}
          onPress={() => router.push('/stackInterno/notificaciones')}>
            <Ionicons name="notifications-outline" size={28} color="#C79600" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#C79600' }}>Notificaciones</Text>
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
            { icon: 'add-circle-outline', color: '#16A34A', texto: 'Registra tus artículos desde "Mis artículos"' },
            { icon: 'qr-code-outline', color: '#004C97', texto: 'Genera un QR antes de entrar al complejo' },
            { icon: 'shield-checkmark-outline', color: '#F39C12', texto: 'Muéstrale el QR al vigilante en la entrada' },
            { icon: 'exit-outline', color: '#E74C3C', texto: 'Al salir genera un QR de salida' },
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