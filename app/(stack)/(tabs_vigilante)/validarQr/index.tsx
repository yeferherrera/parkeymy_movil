
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, Alert, Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  estado_actual: string;
  foto_url: string | null; 
}

interface PreviewData {
  tipo_movimiento: 'ingreso' | 'salida';
  articulos: Articulo[];
  expira_en: string;
}

type Paso = 'escaner' | 'preview' | 'loading' | 'error';

export default function ValidarQrTab() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [paso, setPaso] = useState<Paso>('escaner');
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [codigoActual, setCodigoActual] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [validando, setValidando] = useState(false);

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setCodigoActual(data);
    setPaso('loading');

    try {
      const res = await api.get(`/qr/${data}/preview`);
      setPreview(res.data);
      setPaso('preview');
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message ?? 'QR inválido o expirado');
      setPaso('error');
    }
  };

  const handleValidar = async () => {
    try {
      setValidando(true);
      const res = await api.get(`/validar-qr/${codigoActual}`);
      const tipo = res.data.tipo;
      Alert.alert(
        tipo === 'ingreso' ? '✅ Ingreso registrado' : '✅ Salida registrada',
        `El movimiento de ${tipo} fue registrado correctamente.`,
        [{ text: 'OK', onPress: resetear }]
      );
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo validar');
      resetear();
    } finally {
      setValidando(false);
    }
  };

  const resetear = () => {
    setScanned(false);
    setPreview(null);
    setCodigoActual('');
    setErrorMsg('');
    setPaso('escaner');
  };

  // PERMISOS
  if (!permission) {
    return <View style={styles.center}><ActivityIndicator color="#16A34A" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={64} color="#D1D5DB" />
        <Text style={styles.permTitle}>Permiso de cámara</Text>
        <Text style={styles.permDesc}>Necesitamos acceso a tu cámara para escanear QR</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // LOADING
  if (paso === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.loadingText}>Verificando QR...</Text>
      </View>
    );
  }

  // ERROR
  if (paso === 'error') {
    return (
      <View style={styles.center}>
        <Ionicons name="close-circle" size={64} color="#E74C3C" />
        <Text style={styles.errorTitle}>QR Inválido</Text>
        <Text style={styles.errorDesc}>{errorMsg}</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={resetear}>
          <Text style={styles.resetText}>Escanear de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // PREVIEW — confirmación antes de validar
  if (paso === 'preview' && preview) {
    const esIngreso = preview.tipo_movimiento === 'ingreso';
    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={[
          styles.previewHeader,
          { backgroundColor: esIngreso ? '#16A34A' : '#E74C3C' }
        ]}>
          <Text style={styles.previewTipo}>
            {esIngreso ? '📥 INGRESO AL COMPLEJO' : '📤 SALIDA DEL COMPLEJO'}
          </Text>
          <Text style={styles.previewSub}>
            {preview.articulos.length} artículo{preview.articulos.length !== 1 ? 's' : ''}
          </Text>
        </SafeAreaView>

        <View style={{ flex: 1, padding: 20 }}>
          {preview.articulos.map((art) => (
  <View key={art.id} style={styles.artCard}>

    {/* FOTO o ícono */}
    {art.foto_url ? (
      <Image
        source={{ uri: art.foto_url }}
        style={styles.artFoto}
        resizeMode="cover"
      />
    ) : (
      <View style={styles.artIcon}>
        <Ionicons name="cube-outline" size={22} color="#004C97" />
      </View>
    )}

    <View style={{ flex: 1 }}>
      <Text style={styles.artNombre}>{art.nombre}</Text>
      <Text style={styles.artDesc}>{art.descripcion}</Text>
    </View>

    <View style={[styles.artEstado, esIngreso ? styles.ingresoBg : styles.salidaBg]}>
      <Text style={[styles.artEstadoText, { color: esIngreso ? '#16A34A' : '#E74C3C' }]}>
        {art.estado_actual}
      </Text>
    </View>
  </View>
))}

          <View style={styles.expiracion}>
            <Ionicons name="time-outline" size={14} color="#D97706" />
            <Text style={styles.expiracionText}>
              Expira: {new Date(preview.expira_en).toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <TouchableOpacity
            style={[styles.confirmarBtn, { backgroundColor: esIngreso ? '#16A34A' : '#E74C3C' }]}
            onPress={handleValidar}
            disabled={validando}
          >
            {validando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.confirmarText}>
                  {esIngreso ? 'Confirmar Ingreso' : 'Confirmar Salida'}
                </Text>
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelarBtn} onPress={resetear}>
            <Text style={styles.cancelarText}>Cancelar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // ESCÁNER
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleScan}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Overlay oscuro */}
      <View style={styles.overlay}>
        <SafeAreaView edges={['top']}>
          <Text style={styles.scanTitle}>Escanear QR</Text>
          <Text style={styles.scanSub}>Apunta la cámara al código QR del aprendiz</Text>
        </SafeAreaView>

        {/* Marco del QR */}
        <View style={styles.marco}>
          <View style={[styles.esquina, styles.esquinaTL]} />
          <View style={[styles.esquina, styles.esquinaTR]} />
          <View style={[styles.esquina, styles.esquinaBL]} />
          <View style={[styles.esquina, styles.esquinaBR]} />
        </View>

        <Text style={styles.scanHint}>El QR se detecta automáticamente</Text>
      </View>
    </View>
  );
}

const ESQUINA = 24;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F4F6F8', padding: 32, gap: 12,
  },

  // Permisos
  permTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  permDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  permBtn: {
    backgroundColor: '#16A34A', paddingHorizontal: 28,
    paddingVertical: 14, borderRadius: 14,
  },
  permBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Loading / Error
  loadingText: { fontSize: 16, color: '#6B7280' },
  errorTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
  errorDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  resetBtn: {
    backgroundColor: '#004C97', paddingHorizontal: 28,
    paddingVertical: 14, borderRadius: 14,
  },
  resetText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Escáner overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanTitle: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  scanSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', marginTop: 6 },
  scanHint: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },

  // Marco QR
  marco: {
    width: 240, height: 240,
    position: 'relative',
  },
  esquina: {
    position: 'absolute',
    width: ESQUINA, height: ESQUINA,
    borderColor: '#16A34A', borderWidth: 4,
  },
  esquinaTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  esquinaTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  esquinaBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  esquinaBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  // Preview
  previewHeader: {
    paddingTop: 52, paddingBottom: 20,
    paddingHorizontal: 20, alignItems: 'center',
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  previewTipo: { color: '#fff', fontSize: 20, fontWeight: '800' },
  previewSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },

  artCard: {
    backgroundColor: '#fff', borderRadius: 14,
    flexDirection: 'row', alignItems: 'center',
    padding: 14, marginBottom: 10,
    elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    gap: 12,
  },
  artFoto: {
  width: 52, height: 52,
  borderRadius: 12,
  marginRight: 14,
  flexShrink: 0,
},
  artIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center',
  },
  artNombre: { fontSize: 14, fontWeight: '700', color: '#111827' },
  artDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  artEstado: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8,
  },
  ingresoBg: { backgroundColor: '#D1FAE5' },
  salidaBg: { backgroundColor: '#FEE2E2' },
  artEstadoText: { fontSize: 11, fontWeight: '700' },

  expiracion: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FEF3C7', padding: 12,
    borderRadius: 12, marginTop: 8,
  },
  expiracionText: { fontSize: 13, color: '#D97706', fontWeight: '600' },

  footer: {
    backgroundColor: '#fff', padding: 16,
    borderTopWidth: 1, borderTopColor: '#E5E7EB',
    gap: 8,
  },
  confirmarBtn: {
    paddingVertical: 16, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  confirmarText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  cancelarBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelarText: { color: '#6B7280', fontSize: 15, fontWeight: '600' },
});