import { View, Text } from 'react-native'
import React from 'react'
import CustomInput from '../../../components/input/customInput'
import { StyleSheet } from 'react-native';  
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';



const router = useRouter();

const [email, setEmail] = React.useState('');
const [password, setPassword] = React.useState('');




const loginScreen = () => {
  return (
    <View style={styles.container}>

      {/* Imagen desde assets */}
      <Image 
      source={require('../../../assets/images/Logo.png')} 
      style={styles.image}
      />

      {/* Título 
      <Text style={styles.title}>parkeymy</Text>*/}

      {/* Inputs */}
      <CustomInput
        label="Correo Electrónico"
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
      />

      <CustomInput
        label="Contraseña"
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botón */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/home')}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      {/* Texto final */}
      <TouchableOpacity >
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#F4F6F8',
  },

  image:{

    width: 200,
    height: 90,
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: 50,
  
  },

  title: {
    fontSize: 28,
    color: '#004C97',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },

  button: {
    backgroundColor: '#004C97',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  forgotText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
  },

});

export default loginScreen