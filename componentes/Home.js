import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert } from 'react-native';
import { auth } from './Firebase';
import { signOut } from 'firebase/auth';

const Home = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.email}>{userEmail}</Text>
      <Image 
        source={{ uri: 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <View style={styles.buttonContainer}>
        <Button 
          title="Ver Perfil" 
          onPress={() => navigation.navigate('Perfil')} 
        />
        <View style={styles.spacer} />
        <Button 
          title="Sair" 
          onPress={handleLogout} 
          color="#ff4444"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 10 
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20
  },
  image: { 
    width: 150, 
    height: 150, 
    borderRadius: 75,
    marginBottom: 30 
  },
  buttonContainer: {
    width: '80%'
  },
  spacer: {
    height: 10
  }
});

export default Home;