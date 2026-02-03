import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

const App = () => {
  return (
    <Redirect href="(stack)/login" />
  )
}

export default App