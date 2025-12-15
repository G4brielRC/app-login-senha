import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "./Firebase";

const Registro = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Por favor, informe seu nome");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, informe seu email");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (!age.trim() || isNaN(age)) {
      Alert.alert("Erro", "Por favor, informe uma idade válida");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
     
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Salva no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        age: Number(age),
        email,
        password, 
      });

      Alert.alert("Sucesso!", "Usuário cadastrado com sucesso!", [
        { text: "OK", onPress: () => navigation.replace("Home") },
      ]);

    } catch (err) {
      Alert.alert("Erro", "Não foi possível cadastrar. Tente novamente.");
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={age}
        keyboardType="numeric"
        onChangeText={setAge}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Cadastrar" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: { width: "80%", padding: 10, borderWidth: 1, marginVertical: 5 },
});

export default Registro;
