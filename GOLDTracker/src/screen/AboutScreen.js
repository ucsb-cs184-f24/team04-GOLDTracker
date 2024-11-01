import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const projectMembers = [
    {
        name: 'Allen Hu',
        experience: 'Example experience or roles.',
        email: 'allen.hu@example.com',
        profileImage: 'https://example.com/allen.jpg',
    },
    {
        name: 'Daniel Jesen',
        experience: 'Example experience or roles.',
        email: 'daniel.jesen@example.com',
        profileImage: 'https://example.com/daniel.jpg',
    },
    {
        name: 'June Bi',
        experience: 'Example experience or roles.',
        email: 'june.bi@example.com',
        profileImage: 'https://example.com/june.jpg',
    },
    {
        name: 'Karsten Lansing',
        experience: 'Example experience or roles.',
        email: 'karsten.lansing@example.com',
        profileImage: 'https://example.com/karsten.jpg',
    },
    {
        name: 'Simranjit Mann',
        experience: 'Example experience or roles.',
        email: 'simranjit.mann@example.com',
        profileImage: 'https://example.com/simranjit.jpg', // Replace with actual image URLs
    },
    {
        name: 'Xinyao Song',
        experience: 'Example experience or roles.',
        email: 'xinyao.song@example.com',
        profileImage: 'https://example.com/xinyao.jpg',
    },
];

const AboutScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.experience}>{item.experience}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Members</Text>
        <Text style={{textAlign: 'center',marginBottom: 20, fontSize:13}}>(listed in alphat order)</Text>
      <FlatList
        data={projectMembers}
        renderItem={renderItem}
        keyExtractor={(item) => item.email}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  experience: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  email: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
  },
});

export default AboutScreen;
