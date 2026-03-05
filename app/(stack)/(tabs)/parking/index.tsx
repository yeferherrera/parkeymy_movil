import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProximamenteScreen() {
  return (
    <View style={styles.container}>

      {/* Círculo decorativo fondo */}
      <View style={styles.circuloGrande} />
      <View style={styles.circuloPequeno} />

      {/* Logo */}
      <Image
        source={require('../../../../assets/images/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Icono */}
      <View style={styles.iconContainer}>
        <Ionicons name="construct-outline" size={48} color="#004C97" />
      </View>

      {/* Texto */}
      <Text style={styles.titulo}>Próximamente</Text>
      <Text style={styles.subtitulo}>Estamos trabajando en esto</Text>

      <View style={styles.divider} />

      <Text style={styles.descripcion}>
        Esta funcionalidad estará disponible en la próxima versión de ParkeyMY.
        Estamos trabajando para ofrecerte la mejor experiencia.
      </Text>

      {/* Badge versión */}
      <View style={styles.versionBadge}>
        <Ionicons name="rocket-outline" size={14} color="#004C97" />
        <Text style={styles.versionText}>Disponible en v2.0</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    overflow: 'hidden',
  },

  circuloGrande: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#004C97',
    top: -width * 0.75,
    opacity: 0.06,
  },

  circuloPequeno: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: '#004C97',
    bottom: -width * 0.2,
    right: -width * 0.1,
    opacity: 0.05,
  },

  logo: {
    width: width * 0.6,
    height: 130,
    marginBottom: 40,
    borderRadius: 80,
  },

  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    shadowColor: '#004C97',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#004C97',
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  subtitulo: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
  },

  divider: {
    width: 48,
    height: 4,
    backgroundColor: '#004C97',
    borderRadius: 99,
    marginVertical: 24,
    opacity: 0.3,
  },

  descripcion: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },

  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 32,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },

  versionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#004C97',
  },
});