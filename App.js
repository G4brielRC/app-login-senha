import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importar e inicializar Firebase
import { auth, db } from "./componentes/Firebase";
import { onAuthStateChanged } from "firebase/auth";

// Importar componentes
import Login from "./componentes/Login";
import Home from "./componentes/Home";
import Registro from "./componentes/Registro";
import Perfil from "./componentes/Perfil";
import Splash from "./componentes/SplashScreen";

const Stack = createStackNavigator();

export default function App() {
  // Monitorar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuário logado:", user.email);
        console.log("Firestore inicializado:", db ? "Sim" : "Não");
      } else {
        console.log("Nenhum usuário logado");
      }
    });

    // Limpar subscription
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
            title: "Login",
          }}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{
            title: "Cadastro",
            headerBackTitle: "Voltar",
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Início",
            headerLeft: () => null, // Remove botão voltar
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Perfil"
          component={Perfil}
          options={{
            title: "Meu Perfil",
            headerBackTitle: "Voltar",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
