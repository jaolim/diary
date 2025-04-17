import { useState } from "react";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { StackNavigationProp } from '@react-navigation/stack';

import { Story, NavigatorParams } from "../resources/customTypes";
import styles from "../resources/styles"
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "./homeScreen";
import dayjs from "dayjs";


type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function NewStory() {
    const db = useSQLiteContext();
    const [header, setHeader] = useState("")
    const [body, setBody] = useState("")
    const [isDisabled, setIsDisabled] = useState(false)
    const navigation = useNavigation<navigatorProp>();

    const saveStory = async () => {
        const time = dayjs().toISOString()
        try {
            await db.runAsync('INSERT INTO stories (id, time, header, body) VALUES (?, ?, ?, ?)', time + header, time, header, body)
        } catch (error) {
            console.error('Could not add story', error);
        }
        setIsDisabled(true)
        navigation.navigate('Home')
    }

    return (
        <View style={styles.center}>
            <TextInput
                style={styles.inputTitle}
                label="Title"
                disabled={isDisabled}
                value={header}
                onChangeText={text => setHeader(text)}
            />
            <TextInput
                style={styles.inputBody}
                label="Story"
                disabled={isDisabled}
                value={body}
                onChangeText={text => setBody(text)}
            />
            <Button mode="contained" onPress={saveStory}>
                Add Story
            </Button>
            <Button mode="contained" onPress={() => navigation.navigate('Home')} >
                New Story
            </Button>
        </View>
    )
}