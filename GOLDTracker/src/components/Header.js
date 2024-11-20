import React, { useState, useEffect } from 'react';
import { auth } from "../../firebaseConfig";
import { Avatar } from "react-native-paper";
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {

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
		<View style={styles.header}>
			<View style={styles.logoContainer}>
				<Image 
					source={require('../assets/ucsbLOGO.png')}
					style={styles.imageLogo}
					resizeMode='contain'
				/>
				<Text style={styles.title}>GoldTracker</Text>
			</View>

			{userInfo && (
				<View style={styles.userContainer}>
					<View style={styles.welcome}>
						<Text style={styles.welcome}>Welcome,</Text>
						<Text style={styles.welcome}>{userInfo.displayName}</Text>
					</View>
					<Avatar.Image
						source={{ uri: userInfo.image }}
						size={50} // Adjust size if needed
						style={styles.avatar}
					/>
				</View>
			)}  
		</View>
  	);
};

const styles = StyleSheet.create({
	header: {
		height: 120,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		backgroundColor: '#f8f8f8',
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5,
	},
	logoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 40,
	},
	imageLogo: {
		width: 50,
		height: 50,
		marginRight: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		
	},
	userContainer: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 40,
	},
	welcome: {
		marginTop: 3,
		left: -2,
	},
  });

export default Header;