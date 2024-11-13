import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CartFetch from '../components/CartFetch';

const CartScreen = () => {
  const [classes, setClasses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : (
        <CartFetch setClasses={setClasses} setErrorMessage={setErrorMessage} />
      )}
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
