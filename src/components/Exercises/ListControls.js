import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';

export default function ListControls({ styles, search, setSearch, sort, setSort }) {
  return (
    <View style={styles.listControls}>
      <TextInput
        placeholder="Search exercises"
        placeholderTextColor="#888888"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 8 }}>
        {[
          { id: 'recommended', label: 'Recommended' },
          { id: 'duration', label: 'Duration' },
          { id: 'difficulty', label: 'Difficulty' },
        ].map(opt => (
          <TouchableOpacity key={opt.id} onPress={() => setSort(opt.id)} style={[styles.sortChip, sort === opt.id && styles.sortChipActive]}>
            <Text style={[styles.sortChipText, sort === opt.id && styles.sortChipTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
