import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

const QRScreen = () => {
  return (
    <Redirect href="/stackInterno/generarQR" />
  )
}

export default QRScreen