import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform
} from 'react-native';

export default function CharactersListScreen({ navigation }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);       // initial loading
  const [loadingMore, setLoadingMore] = useState(false); // pagination loading
  const [query, setQuery] = useState('');
  const [nextUrl, setNextUrl] = useState('https://rickandmortyapi.com/api/character');
  const isFetchingRef = useRef(false);
  const debounceRef = useRef(null);

  // fetch page (or first page) using nextUrl or name query
  const fetchCharacters = async (reset = false) => {
    if (isFetchingRef.current) return;
    // if reset, start from base URL plus query
    let url = nextUrl;
    if (reset) {
      url = `https://rickandmortyapi.com/api/character${query ? `?name=${encodeURIComponent(query)}` : ''}`;
    }
    if (!url) return; // nothing to load (no next)
    try {
      isFetchingRef.current = true;
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(url);
      if (res.status === 404) {
        // no results for query
        setCharacters([]);
        setNextUrl(null);
        return;
      }
      const data = await res.json();
      if (reset) {
        setCharacters(data.results || []);
      } else {
        setCharacters(prev => [...prev, ...(data.results || [])]);
      }
      setNextUrl(data.info?.next || null);
    } catch (err) {
      console.warn('Erro ao buscar personagens:', err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // initial load
  useEffect(() => {
    // ensure nextUrl is base
    setNextUrl('https://rickandmortyapi.com/api/character');
    fetchCharacters(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // reset nextUrl and fetch first page for query
      setNextUrl(`https://rickandmortyapi.com/api/character${query ? `?name=${encodeURIComponent(query)}` : ''}`);
      fetchCharacters(true);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleEndReached = () => {
    if (!nextUrl || loadingMore || loading) return;
    fetchCharacters(false);
  };

  const getStatusColor = (status) => {
    if (status === 'Alive') return '#4CFF00';
    if (status === 'Dead') return '#FF0033';
    return '#9CA3AF';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CharacterDetail', { id: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.subtitle, { color: getStatusColor(item.status) }]}>
          {item.status} {item.species ? ` — ${item.species}` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#00FFAA" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Pesquisar personagem..."
        placeholderTextColor="#99FFD4"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        returnKeyType="search"
      />

      {loading && characters.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00FFAA" />
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReached={handleEndReached}
          onEndReachedThreshold={Platform.OS === 'android' ? 0.5 : 0.7}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !loading && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Nenhum personagem encontrado.</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    padding: 16
  },
  input: {
    backgroundColor: '#0F3460',
    color: '#E8FFFB',
    padding: 12,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#00FFAA'
  },
  list: {
    paddingBottom: 24
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#00FFAA'
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#00FFAA'
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E8FFFB',
    marginBottom: 6
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600'
  },
  footer: {
    padding: 12,
    alignItems: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  empty: {
    padding: 30,
    alignItems: 'center'
  },
  emptyText: {
    color: '#E8FFFB'
  }
});
