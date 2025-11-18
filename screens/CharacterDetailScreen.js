import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';

export default function CharacterDetailScreen({ route }) {
  // accept either id (preferred) or a passed character object
  const { id, character: passedCharacter } = route.params || {};
  const [character, setCharacter] = useState(passedCharacter || null);
  const [loading, setLoading] = useState(!passedCharacter);

  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      if (character || !id) return;
      try {
        setLoading(true);
        const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        const data = await res.json();
        if (mounted) setCharacter(data);
      } catch (err) {
        console.warn('Erro ao buscar detalhe:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDetail();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00FFAA" />
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#E8FFFB' }}>Personagem não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <Text style={styles.name}>{character.name}</Text>

      <View style={styles.card}>
        <Text style={styles.info}>Status: <Text style={{ color: character.status === 'Alive' ? '#4CFF00' : character.status === 'Dead' ? '#FF0033' : '#9CA3AF', fontWeight: '700' }}>{character.status}</Text></Text>
        <Text style={styles.info}>Espécie: <Text style={styles.value}>{character.species}</Text></Text>
        <Text style={styles.info}>Gênero: <Text style={styles.value}>{character.gender}</Text></Text>
        <Text style={styles.info}>Origem: <Text style={styles.value}>{character.origin?.name}</Text></Text>
        <Text style={styles.info}>Localização atual: <Text style={styles.value}>{character.location?.name}</Text></Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#1A1A2E'
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 4,
    borderColor: '#00FFAA',
    marginBottom: 18
  },
  name: {
    fontSize: 30,
    fontWeight: '800',
    color: '#E8FFFB',
    marginBottom: 18
  },
  card: {
    backgroundColor: '#16213E',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FFAA'
  },
  info: {
    fontSize: 20,
    color: '#E8FFFB',
    marginBottom: 12
  },
  value: {
    fontWeight: '700'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E'
  }
});
