import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from 'expo-router';


export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* FONDO DE CABECERA */}

      <View style={styles.headerBackground} />
      {/* LOGO */}
      <Image
        source={require('../../../assets/images/Logo.png')}
        style={styles.logo}
      />

      {/* BIENVENIDA */}
     
      <Text style={styles.welcome}>¡Bienvenido!</Text>

    <View style={styles.content}>

      

      {/* FILA 1 */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/stackInterno/registrarArticulo')}
        >
          <MaterialIcons name="edit" size={28} color="#fff" />
          <Text style={styles.text}>Registrar artículo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/stackInterno/generarQR')}
        >
          <FontAwesome5 name="qrcode" size={28} color="#fff" />
          <Text style={styles.text}>Generar QR</Text>
        </TouchableOpacity>
      </View>

      {/* FILA 2 */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/stackInterno/consultarRegistros')}
        >
          <Ionicons name="search-outline" size={28} color="#fff" />
          <Text style={styles.text}>Consultar registros</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/stackInterno/reportes')}
        >
          <MaterialIcons name="list-alt" size={28} color="#fff" />
          <Text style={styles.text}>Mis reportes</Text>
        </TouchableOpacity>
      </View>

      {/* FILA FINAL */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.push('/stackInterno/ayuda')}
        >
          <Ionicons name="help-circle-outline" size={26} color="#004C97" />
          <Text style={styles.textSecondary}>Ayuda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonSecondary, styles.logout]}
          onPress={() => router.replace('/login')}
        >
          <MaterialIcons name="logout" size={26} color="#DC2626" />
          <Text style={[styles.textSecondary, styles.logoutText]}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
    paddingTop: 40,
  },

  content: {
  marginTop: 80,
  width: '100%',
  alignItems: 'center',
},


  headerBackground: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 230,
  backgroundColor: '#004C97',
  borderBottomLeftRadius: 50,
  borderBottomRightRadius: 50,
},


  logo: {
    marginTop: 30, 
    width: 300,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  welcome: {
    fontSize: 30,
  fontWeight: '500',
  color: '#ffffff',
  letterSpacing: 0.4,


  },

  row: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 15,
  },

  button: {
    
    backgroundColor: '#004C97',
    width: '48%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 50,
  },

  buttonSecondary: {
    
    backgroundColor: '#FFFFFF',
    width: '48%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },

  logout: {
    borderColor: '#FCA5A5',
  },

  text: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  textSecondary: {
    marginTop: 6,
    color: '#004C97',
    fontSize: 14,
    fontWeight: '600',
  },

  logoutText: {
    color: '#DC2626',
  },
});
