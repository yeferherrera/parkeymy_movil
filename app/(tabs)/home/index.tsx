import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons"; 
import WelcomeTitle from '../../../components/welcomeTitle/WelcomeTitle';


import { useRouter } from 'expo-router';
const router = useRouter();

const onPressQR = () => {
    console.log("QR");
  };  
const onPressReports = () => {
    console.log("mis reportes");
  };   
const onPressHelp = () => {
    console.log("ayuda");
  };  


const homeScreen = () => {
  return (
     <View style={styles.container}>

    

      <WelcomeTitle />

      {/* Fila 1 */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/stackInterno/registrarArticulo')} >
          <MaterialIcons name="edit" size={30} color="#fff" />
          <Text style={styles.text}>Registrar artículo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onPressQR}>
          <FontAwesome5 name="qrcode" size={30} color="#fff" />
          <Text style={styles.text}>Validar QR</Text>
        </TouchableOpacity>
      </View>

      {/* Fila 2 */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={()=> router.push('/stackInterno/consultarRegistros')}>
          <Ionicons name="search-outline" size={30} color="#fff" />
          <Text style={styles.text}>Consultar registros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={()=> router.push('/stackInterno/reportes')}>
          <MaterialIcons name="list-alt" size={30} color="#fff" />
          <Text style={styles.text}>Mis reportes</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de ayuda – centrado */}
      <TouchableOpacity style={[styles.buttonHelp]} onPress={() => router.push('/stackInterno/ayuda')}>
        <Ionicons name="help-circle-outline" size={30} color="#fff" />
        <Text style={styles.text}>Ayuda</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: "center",
    
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#004C97", // Azul SENA
    width: "48%",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonHelp: {
    backgroundColor: "#004C97",
    width: "60%",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  text: {
    marginTop: 8,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});


export default homeScreen