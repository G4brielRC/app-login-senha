import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, // Para botões customizados
  StyleSheet, 
  Alert, 
  ActivityIndicator // Para feedback de carregamento
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "./Firebase";

const Registro = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false); // Novo estado de carregamento
  const [error, setError] = useState(''); // Estado para erros visíveis

  const validateForm = () => {
    setError(""); // Limpa erro anterior
    if (!name.trim()) {
      setError("Por favor, informe seu nome.");
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setError("Por favor, informe um email válido.");
      return false;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (!age.trim() || isNaN(age) || Number(age) <= 0) {
      setError("Por favor, informe uma idade válida.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm() || loading) return;

    setLoading(true); // Inicia o carregamento
    setError('');

    try {
      // 1. Cria o usuário no Firebase Auth (função nativa)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Salva dados adicionais no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        age: Number(age),
        email,
        // **IMPORTANTE:** REMOVEMOS A SENHA DAQUI POR SEGURANÇA.
        // O Firebase Auth já gerencia o hash da senha de forma segura.
      });
      // 

      Alert.alert("Sucesso!", "Usuário cadastrado com sucesso!", [
        { text: "OK", onPress: () => navigation.replace("Home") },
      ]);

    } catch (err) {
      // Tratamento de erros comuns do Firebase Auth
      let errorMessage = "Não foi possível cadastrar. Tente novamente.";
      if (err.code === 'auth/email-already-in-use') {
          errorMessage = 'Este email já está em uso.';
      } else if (err.code === 'auth/weak-password') {
          errorMessage = 'A senha deve ser mais forte (mínimo 6 caracteres).';
      }
      setError(errorMessage);
      console.log(err);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie Sua Conta</Text>
      <Text style={styles.subtitle}>Preencha seus dados para continuar</Text>

      {/* Input Nome */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      {/* Input Idade */}
      <TextInput
        style={styles.input}
        placeholder="Idade"
        placeholderTextColor="#888"
        value={age}
        keyboardType="numeric"
        onChangeText={setAge}
      />

      {/* Input Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Input Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha (Mínimo 6 caracteres)"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {/* Exibição de Erro */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Botão Cadastrar */}
      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={handleRegister} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>CADASTRAR</Text>
        )}
      </TouchableOpacity>
      
      {/* Botão para voltar ao Login */}
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>Já tenho uma conta (Login)</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: { 
    width: '100%', 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    marginVertical: 8, 
    backgroundColor: '#fff',
    fontSize: 16,
  },
  error: { 
    color: '#ff4d4d', 
    marginBottom: 10,
    marginTop: 5,
  },
  
  // Estilo do Botão Principal (Cadastrar)
  primaryButton: {
    width: '100%',
    backgroundColor: '#4CAF50', // Verde vibrante para ação principal
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Estilo do Botão Secundário (Voltar ao Login)
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent', // Transparente
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15, // Espaçamento maior
  },
  secondaryButtonText: {
    color: '#007AFF',
    textDecoration: 'underline',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Registro;