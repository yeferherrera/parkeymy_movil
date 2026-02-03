import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SelectInput from '../../../components/input/selectInput';
import AppNav from '../../../components/ui/nav';
 
import CustomInput from '../../../components/input/customInput';


const router = useRouter();
const [descripcion, setDescripcion] = React.useState('');
const [identificacion, setIdentificacion] = React.useState('');
const [tipoArticulo, setTipoArticulo] = React.useState('');


const registrarArticulo = () => {
  return (
    <View style={styles.container}>
      
       <AppNav title="Registrar artículo" />
          
    
    <Text style={styles.title}></Text>

      {/* Inputs */}
      <CustomInput
        label="descripcion"
        placeholder="descripcion"
        value={descripcion}
        onChangeText={setDescripcion}
        />  

      <CustomInput
        label="identificacion"
        placeholder="identificacion"
        value={identificacion}
        onChangeText={setIdentificacion}
        
      />

        <SelectInput 
        label="Tipo de artículo"
        selectedValue={tipoArticulo}
        onValueChange={setTipoArticulo}
        options={[
          { label: 'Seleccione una opción', value: '' },
          { label: 'Electrónico', value: 'electrico' },
          { label: 'Vehículo', value: 'vehiculo' },
          { label: 'Personal', value: 'personal' },
        ]}
      />

      {/* Botón */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/home')}>
        <Text style={styles.buttonText}>confirmar</Text>
      </TouchableOpacity>

    {/* mensajes */}

    <Text style={{ color: 'red', marginTop: 40, alignItems: 'center' , textAlign: 'center', height: 90, width: '100%' }}>
        Error: por favor revise los campos
    </Text>

    <Text style={{ color: 'green', marginTop: 20 , textAlign: 'center', height: 90, width: '100%' }}>
        Error: por favor revise los campos
    </Text>
     

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

    width: 400,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: 50,
  
  },

  title: {
    fontSize: 28,
    color: '#004C97',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 40,
  },

  button: {
    backgroundColor: '#03c04a',
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

export default registrarArticulo