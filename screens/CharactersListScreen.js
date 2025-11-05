import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import axios from 'axios';

export default function CharactersListScreen({ navigation }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCharacters = async () => {
    if (!hasNextPage) return;

    try {
      page === 1 ? setLoading(true) : setLoadingMore(true);

      const response = await axios.get(
        `https://rickandmortyapi.com/api/character?page=${page}`
      );

      setCharacters(prev => [...prev, ...response.data.results]);

      if (response.data.info.next) setPage(prev => prev + 1);
      else setHasNextPage(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { character: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.status} - {item.species}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="large" color="#00ff00" animating={true} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" animating={true} />
      </View>
    );
  }

  return (
    <FlatList
      data={characters}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      onEndReached={fetchCharacters}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 10 },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden'
  },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 10, justifyContent: 'center' },
  name: { fontWeight: 'bold', fontSize: 16 }
});
