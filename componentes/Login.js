import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, // Usaremos para botões customizados
  StyleSheet, 
  Alert, 
  ActivityIndicator // Adicionado para feedback de lentidão (Problema 2)
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Removido sendPasswordResetEmail
import { auth } from './Firebase'; // Removido db, pois não é usado aqui

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Novo estado de carregamento

  // Função de recuperação de senha removida

  const handleLogin = async () => {
    if (!email || !password) {
        setError('Por favor, preencha todos os campos.');
        return;
    }
    
    setLoading(true); // Inicia o carregamento
    setError(''); // Limpa erros anteriores

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (err) {
      // Tratamento de erro mais específico do Firebase (opcional, mas útil)
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          errorMessage = 'Email ou senha inválidos.';
      } else if (err.code === 'auth/invalid-email') {
          errorMessage = 'O formato do email é inválido.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo(a)!</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>
      
      {/* Campo Email */}
      <TextInput
        style={styles.input}
        placeholder="Seu Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* Campo Senha */}
      <TextInput
        style={styles.input}
        placeholder="Sua Senha"
        placeholderTextColor="#888"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      
      {/* Exibição de Erro */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      {/* Botão Entrar */}
      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={handleLogin} 
        disabled={loading} // Desabilita o botão enquanto carrega
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>ENTRAR</Text>
        )}
      </TouchableOpacity>
      
      {/* Espaçamento maior entre os botões (Resolvendo seu pedido) */}
      <View style={styles.spacer} /> 
      
      {/* Botão Cadastrar */}
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={() => navigation.navigate('Registro')}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>CRIAR CONTA</Text>
      </TouchableOpacity>
      
      {/* Botão "Esqueci a senha" foi removido conforme solicitado */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 30, // Adiciona padding ao redor
    backgroundColor: '#f5f5f5', // Fundo levemente cinza
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
    marginBottom: 30, // Espaçamento após o subtítulo
  },
  input: { 
    width: '100%', 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#ddd', // Borda mais suave
    borderRadius: 8, // Borda arredondada
    marginVertical: 8, // Espaçamento vertical
    backgroundColor: '#fff',
    fontSize: 16,
  },
  error: { 
    color: '#ff4d4d', // Vermelho mais vibrante para erros
    marginBottom: 10,
    marginTop: 5,
  },
  
  // Estilo do Botão Principal (Entrar)
  primaryButton: {
    width: '100%',
    backgroundColor: '#007AFF', // Azul padrão do iOS/App
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20, // Mais espaço acima
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Espaçamento entre os botões (Pedido de espaçamento maior)
  spacer: {
    height: 15, // Espaçamento maior aqui
  },
  
  // Estilo do Botão Secundário (Cadastrar)
  secondaryButton: {
    width: '100%',
    backgroundColor: '#fff', // Fundo branco
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1, // Borda leve
    borderColor: '#007AFF', // Borda com cor primária
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;