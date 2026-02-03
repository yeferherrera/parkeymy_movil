import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";


export default function CustomButton({  title, icon, onPress }: { title: string; icon: string; onPress: () => void }) {
  
const onPressRegister = () => {
    console.log("Registrar artículo");
  };
const onPressQR = () => {
    console.log("QR");
  };  
const onPressSearch = () => {
    console.log("consultar registros");
  }; 
const onPressReports = () => {
    console.log("mis reportes");
  };   
const onPressHelp = () => {
    console.log("ayuda");
  };  
  
  
    const renderIcon = () => {
    switch (icon) {
      case "edit":
        return <MaterialIcons name="edit" size={22} color="#fff" />;
      case "qr":
        return <MaterialIcons name="qr-code-scanner" size={22} color="#fff" />;
      case "search":
        return <Ionicons name="search" size={22} color="#fff" />;
      case "report":
        return <FontAwesome5 name="file-alt" size={22} color="#fff" />;
      case "help":
        return <Ionicons name="help-circle" size={22} color="#fff" />;
      default:
        return null;
    }
    
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.5}>
      <View style={styles.content}>
        {renderIcon()}
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#004C97", // Azul SENA
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 10,
    
    
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
