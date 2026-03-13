import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../utils/constants';

const AVATAR_SIZE = 52;

export default function NewMembersCarousel({ joinEvents }) {
  const members = useMemo(() => {
    if (!joinEvents || !Array.isArray(joinEvents)) return [];

    const seen = new Set();
    const result = [];

    joinEvents.forEach(event => {
      const user = event.users || {};
      const id = user.id || event.user_id;
      if (!id || seen.has(id)) return;
      seen.add(id);

      let name = 'Member';
      if (user.display_name && user.display_name.trim()) {
        name = user.display_name;
      } else if (user.first_name || user.last_name) {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        if (fullName) name = fullName;
      } else if (user.email) {
        name = user.email.split('@')[0];
      }

      const initial = name.charAt(0).toUpperCase();

      result.push({
        id,
        name,
        avatar: user.avatar_url || null,
        initial,
      });
    });

    return result;
  }, [joinEvents]);

  if (!members.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>New in Tribe</Text>
        <Text style={styles.count}>{members.length} new</Text>
      </View>
      <FlatList
        horizontal
        data={members}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <LinearGradient
              colors={['#3B5FE3', '#0EA5E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <View style={styles.avatarInner}>
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitial}>{item.initial}</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
            <Text numberOfLines={1} style={styles.memberName}>
              {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  count: {
    fontSize: 12,
    color: '#6B7280',
  },
  listContent: {
    paddingVertical: 4,
  },
  memberItem: {
    width: AVATAR_SIZE + 10,
    marginRight: 14,
    alignItems: 'center',
  },
  avatarRing: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  avatarInner: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.ACCENT,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  memberName: {
    marginTop: 4,
    fontSize: 11,
    color: '#111827',
  },
});

