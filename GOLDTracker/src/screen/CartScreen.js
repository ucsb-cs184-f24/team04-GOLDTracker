import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CartFetch from '../components/CartFetch';
import {useFocusEffect} from "@react-navigation/native";

const CartScreen = () => {
  const [classes, setClasses] = useState([]);

  return (
    <View style={styles.container}>
      <CartFetch setClasses={setClasses} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  errorMessage: {
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CartScreen;
