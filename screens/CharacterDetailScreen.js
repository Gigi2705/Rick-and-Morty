import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function CharacterDetailScreen({ route }) {
  const { character } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <Text style={styles.name}>{character.name}</Text>
      <Text>Status: {character.status}</Text>
      <Text>Espécie: {character.species}</Text>
      <Text>Gênero: {character.gender}</Text>
      <Text>Origem: {character.origin.name}</Text>
      <Text>Localização: {character.location.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  image: { width: 200, height: 200, borderRadius: 100, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 }
});
