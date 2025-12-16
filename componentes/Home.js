import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { auth } from './Firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Importa Firestore
import { db } from './Firebase';

const Home = ({ navigation }) => {
  const [userName, setUserName] = useState('Usuário');
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        // 1. Tenta buscar o nome do usuário no Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserName(docSnap.data().name || 'Usuário'); 
        } else {
          // Se não encontrar no Firestore, usa o email ou um nome genérico
          setUserName(user.email.split('@')[0]); 
        }
      }
      setLoading(false);
    };

    fetchUserName();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redireciona para o Login, o App.js cuidará de remover a rota Home
      navigation.replace('Login'); 
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair.');
    }
  };
  
  // Exibe o indicador de carregamento enquanto busca o nome
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Carregando dados do usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mensagem de Boas-vindas com o nome do Firestore */}
      <Text style={styles.title}>Bem-vindo(a),</Text>
      <Text style={styles.userNameText}>{userName}!</Text>
      
      <View style={styles.buttonContainer}>
        {/* Botão Ver Perfil */}
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => navigation.navigate('Perfil')} 
        >
          <Text style={styles.primaryButtonText}>VER MEU PERFIL</Text>
        </TouchableOpacity>
        
        <View style={styles.spacer} />
        
        {/* Botão Sair */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout} 
        >
          <Text style={styles.logoutButtonText}>SAIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  title: { 
    fontSize: 24, 
    color: '#666',
  },
  userNameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  spacer: {
    height: 15,
  },
  
  // Botão Principal (Ver Perfil)
  primaryButton: {
    backgroundColor: '#007AFF', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Botão Sair
  logoutButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;