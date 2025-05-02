import { StyleSheet } from "react-native";

export default StyleSheet.create({
    borderBlue: {
        padding: 10,
        margin: 5,
        borderWidth: 2,
        borderColor: "blue"
    },
    center: {
        paddingTop: 20,
        paddingBottom: 20,
        flex: 1,
        alignItems: 'center',
    },
    column: {
        flexDirection: "column",
        padding: 5,
        margin: 5
    },
    inputBody: {
        marginTop: 10,
        marginBottom: 10,
        height: 200,
        width: 300
    },
    inputComment: {
        marginTop: 10,
        marginBottom: 10,
        width: 200
    },
    inputTitle: {
        marginTop: 10,
        marginBottom: 10,
        width: 200,
    },
    margin: {
        margin: 5
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 5,
    },
    rowBorderBlue: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 2,
        borderColor: "blue"
    },
    title: {
        backgroundColor: "white",
        padding: 5
    },
    user: {
        color: "blue",
        backgroundColor: "white",
        padding: 5
    }
})