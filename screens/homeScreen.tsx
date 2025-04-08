import { FlatList, Text, View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { Appbar } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { Button } from "react-native-paper";

import { NavigatorParams } from "../resources/customTypes";
import { Story } from "../resources/customTypes";
import styles from "../resources/styles"

type homeScreenProp = StackNavigationProp<NavigatorParams>;

export default function HomeScreen() {
    const navigation = useNavigation<homeScreenProp>();
    const db = useSQLiteContext();
    const [stories, setStories] = useState<Story[]>()

    const exampleStory = {
        id: 0,
        time: "123",
        header: "Example Story",
        body: "Body of text\nThis should be on a new line.",
    }

    const getStories = async () => {
        try {
            const list = await db.getAllAsync('SELECT * from stories');
            setStories(list as Story[]);
        } catch (error) {
            console.error('Could not get stories', error);
        }
    }

    const saveStory = async () => {
        try {
            await db.runAsync('INSERT INTO stories (id, time, header, body) VALUES (?, ?, ?, ?)', exampleStory.id, exampleStory.time, exampleStory.header, exampleStory.body)
        } catch (error) {
            console.error('Could not add story', error);
        }
        getStories();
    }

    const resetDB = async () => {
        try {
            await db.runAsync('DELETE FROM stories')
        } catch (error) {
            console.error(error);
        }
        getStories();
    }

    return (
        <View style={styles.center}>
            <Text>HomeScreen</Text>
            <Text>Will be implemented shortly!</Text>
            <Button mode="contained" onPress={() => navigation.navigate('NewStory')} >
                New Story
            </Button>
            <Button mode="contained" onPress={saveStory}>
                Test Add
            </Button>
            <Button mode="contained" onPress={resetDB}>
                Test Reset DB
            </Button>
            <FlatList
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) =>
                    <View>
                        <Text>ID: {item.id}, Time: {item.time}, Header: {item.header}, Body: {item.body}</Text>
                    </View>
                }
                data={stories}
            />

        </View>
    )
}