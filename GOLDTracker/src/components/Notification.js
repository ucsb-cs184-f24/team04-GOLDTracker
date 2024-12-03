import {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {COLORS, SPACING} from "../theme/theme";
import * as WebBrowser from 'expo-web-browser';


export default class Notification extends Component {
    render() {
        const {course} = this.props;
        const courseCode = course.courseId ? course.courseId.trim() : "N/A";
        const courseProfessor = course.classSections[0]?.instructors[0] ? course.classSections[0]?.instructors[0].instructor : "TBA"
        return (
            <View style={styles.container}>
                <View style={styles.element}>
                    <TouchableOpacity onPress={this.handlePress}>
                        <Text style={styles.text}>{`${courseCode.replace(/\s+/, " ")} with ${courseProfessor} has available sections`}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    async handlePress() {
        await WebBrowser.openBrowserAsync("https://my.sa.ucsb.edu/gold/");
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    element: {
        backgroundColor: COLORS.darkBlue,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 18
    },
    text: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        paddingRight: 5,
        fontFamily: "Nunito-Regular",
    }
});