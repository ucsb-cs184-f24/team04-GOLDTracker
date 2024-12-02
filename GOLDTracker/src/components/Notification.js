import {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {COLORS, SPACING} from "../theme/theme";
import * as WebBrowser from 'expo-web-browser';


export default class Notification extends Component {
    render(){
        const {course} = this.props;
        const courseCode = course.courseId ? course.courseId.trim() : "N/A";
        return(
            <View style={styles.wrapper}>
                <View style={styles.courseContainer}>
                    <TouchableOpacity onPress={this.handlePress}>
                        <Text style={styles.courseHeader}>{`${courseCode} has available sections`}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    async handlePress(){
        await WebBrowser.openBrowserAsync("https://my.sa.ucsb.edu/gold/");
    }
}

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: SPACING.space_10,
        paddingHorizontal: SPACING.space_16,

    },
    courseContainer: {
        backgroundColor: COLORS.lightGrey,
        paddingTop: SPACING.space_8,
        paddingHorizontal: 0,
        borderRadius: 16,
        marginTop: SPACING.space_18,
    },
    courseCode: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.ucsbBlue,
        paddingVertical: SPACING.space_4,
        marginLeft: SPACING.space_8,
    },
    courseDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.space_4,
    },
    professorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    courseTime: {
        fontSize: 14,
        color: COLORS.black,
        flex: 1,
        marginLeft: SPACING.space_8,
    },
    courseProfessor: {
        fontSize: 14,
        color: COLORS.black,
        marginRight: SPACING.space_6,
    },
    detailsButton: {
        padding: 0,
    },
    sectionContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 16,
        marginTop: SPACING.space_4,
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    sectionTime: {
        width: 150,
        fontSize: 14,
        color: COLORS.black,
        marginLeft: SPACING.space_8,
    },
    sectionSpace: {
        width: 100,
        fontSize: 14,
        color: COLORS.black,
        textAlign: "left",
    },
    followButton: {
        width: 80,
        paddingVertical: SPACING.space_8,
        borderRadius: 16,
        alignItems: "center",

    },
    following: {
        backgroundColor: COLORS.lightBlue,
    },
    notFollowing: {
        backgroundColor: COLORS.darkBlue,
    },
    followText: {
        color: COLORS.white,
    },
    courseHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.space_4,
    },
});