import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../services/api';

export default function ValidarQRScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [validando, setValidando] = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          Necesitamos acceso a la cámara para escanear el QR
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: any) => {
    if (scanned || validando) return;
    setScanned(true);
    setValidando(true);

    try {
      const response = await api.get(`/validar-qr/${data}`);
      const tipo = response.data.tipo;

      Alert.alert(
        tipo === 'ingreso' ? '✅ Ingreso registrado' : '✅ Salida registrada',
        response.data.message,
        [
          {
            text: 'Escanear otro',
            onPress: () => {
              setScanned(false);
              setValidando(false);
            },
          },
          {
            text: 'Cerrar',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'QR inválido o expirado';

      Alert.alert('❌ Error', msg, [
        {
          text: 'Intentar de nuevo',
          onPress: () => {
            setScanned(false);
            setValidando(false);
          },
        },
        {
          text: 'Cerrar',
          onPress: () => router.back(),
        },
      ]);
    } finally {
      setValidando(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Validar QR</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* CÁMARA */}
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* OVERLAY DE CARGA */}
      {validando && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.overlayText}>Validando QR...</Text>
        </View>
      )}

      {/* MARCO DEL QR */}
      <View style={styles.marcoContainer} pointerEvents="none">
        <View style={styles.marco}>
          <View style={[styles.esquina, styles.esquinaTL]} />
          <View style={[styles.esquina, styles.esquinaTR]} />
          <View style={[styles.esquina, styles.esquinaBL]} />
          <View style={[styles.esquina, styles.esquinaBR]} />
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {validando ? 'Validando...' : 'Alinea el código QR dentro del marco'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  header: {
    height: 90,
    backgroundColor: '#004C97',
    paddingTop: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },

  camera: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },

  overlayText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  marcoContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
  },

  marco: {
    width: 240,
    height: 240,
    position: 'relative',
  },

  esquina: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
  },

  esquinaTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  esquinaTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  esquinaBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  esquinaBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },

  footer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },

  footerText: { color: '#fff', fontSize: 14 },

  center: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  text: { fontSize: 16, textAlign: 'center', marginBottom: 16 },

  button: {
    backgroundColor: '#004C97',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: { color: '#fff', fontWeight: '600' },
});