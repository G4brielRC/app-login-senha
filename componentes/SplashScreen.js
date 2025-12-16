// componentes/SplashScreen.js

import React, { useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from 'firebase/auth'; // Importa a função de verificação
import { auth } from './Firebase'; // Importa a instância de autenticação

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // 1. Monitora o estado de autenticação do Firebase
    // Esta função espera o AsyncStorage carregar o estado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      
      // 2. Decide a navegação assim que o estado for conhecido
      if (user) {
        // Usuário logado no dispositivo
        navigation.replace("Home");
      } else {
        // Usuário deslogado
        navigation.replace("Login");
      }
      
      // A navegação acontece imediatamente após a verificação,
      // sem depender de um tempo fixo (4 segundos).
    });

    // 3. Limpa o listener
    return () => unsubscribe();
    
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      {/* ATENÇÃO: A URL da imagem que você usou acima é um link de REDIRECIONAMENTO do Google (url?sa=i&...) 
          e provavelmente não carrega a imagem em React Native.
          Use um link DIRETO para a imagem, ou use uma imagem local (require('./caminho/imagem.png')). */}
      <Image
        source={require('../assets/adaptive-icon.png')} // Exemplo de uso de imagem local (ajuste o caminho)
        style={styles.splashImage}
      />
      
      {/* O ActivityIndicator é exibido enquanto o Firebase verifica o estado */}
      <ActivityIndicator style={styles.loader} size="large" color="#000ff" />
      
      {/* Se o link for corrigido, você pode usar: 
      <Image
        source={{
          uri: "LINK_DIRETO_PARA_IMAGEM_AQUI",
        }}
        style={styles.splashImage}
      /> */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: { // Use splashContainer no View principal
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  splashImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;