import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { auth } from '../../firebaseConfig';
import { Avatar } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { COLORS } from '../theme/theme';

const Header = ({
  title,
  showImage,
  showUser,
  showBackButton,
  navigation,
}) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserInfo({
          displayName: user.displayName,
          email: user.email,
          image: user.photoURL,
        });
      } else {
        setUserInfo(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Left Container */}
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}
          {showImage && (
            <Image
              source={require('../assets/images/gold.png')}
              style={styles.imageLogo}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Title Container */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Right Container */}
        <View style={styles.rightContainer}>
          {showUser && userInfo && (
            <View style={styles.userContainer}>
              <View style={styles.avatarBorder}>
                <Avatar.Image
                  source={{ uri: userInfo.image }}
                  size={35}
                  style={styles.avatar}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.orange,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange,
  },
  leftContainer: {
    width: 50, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 15,
  },
  backButton: {
    marginRight: 5,
  },
  imageLogo: {
    width: 50,
    height: 50,
  },
  titleContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Rowdies-Light',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  rightContainer: {
    width: 50, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
  },
  userContainer: {},
  avatarBorder: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 50,
    padding: 0,
  },
  avatar: {
    backgroundColor: '#fff',
  },
});

export default Header;
