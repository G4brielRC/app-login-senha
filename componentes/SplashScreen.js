import react, { useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View>
      <Image
        source={{
          uri: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.wallpapers.com%2Fimagens-de-rick-and-morty&psig=AOvVaw0LMbxZYdBHQH0c9FhyOB3A&ust=1758064758373000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCIDY54L0248DFQAAAAAdAAAAABAE",
        }}
        style={styles.splashImage}
      />
      <ActivityIndicator style={styles.loader} size="large" color="#000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
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