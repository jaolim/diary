import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useSQLiteContext } from "expo-sqlite";
import { Button } from "react-native-paper";

import { NavigatorParams } from "../resources/customTypes";
import { Story } from "../resources/customTypes";
import styles from "../resources/styles"


type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function HomeScreen() {
    const navigation = useNavigation<navigatorProp>();
    const db = useSQLiteContext();
    const [stories, setStories] = useState<Story[]>()

    const exampleStory = {
        id: '0',
        time: "123",
        header: "Example Story",
        body: "Body of text\nThis should be on a new line.",
        image: "Test Image",
        imageName: "Test Image Name"
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
            await db.runAsync('INSERT INTO stories (id, time, header, body, image) VALUES (?, ?, ?, ?, ?)', exampleStory.id, exampleStory.time, exampleStory.header, exampleStory.body, exampleStory.image)
        } catch (error) {
            console.error('Could not add story', error);
        }
        getStories();
    }

    const resetDB = async () => {
        /* try {
             await db.runAsync('DROP table stories')
         } catch (error) {
             console.error(error);
         } */
        try {
            await db.runAsync('DELETE from stories')
        } catch (error) {
            console.error(error);
        }
        getStories();
    }

    useEffect(() => {
        //resetDB();
        getStories();
    }, [])

    return (
        <View style={styles.center}>
            <Text>Stories timeline</Text>
            <View style={styles.row}>
                <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('NewStory')} >
                    New Story
                </Button>
                <Button style={styles.margin} mode="contained" onPress={saveStory}>
                    Test Add
                </Button>
                <Button style={styles.margin} mode="contained" onPress={resetDB}>
                    Reset DB
                </Button>
            </View>
            <FlatList
                keyExtractor={item => item.id}
                renderItem={({ item }) =>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ViewStory', { id: item.id });
                        }}
                    >
                        <View style={styles.borderBlue}>

                            <Text>ID: {item.id}</Text>
                            <Text>Time: {item.time}</Text>
                            <Text>Header: {item.header}</Text>
                            <Text>Body: {item.body}</Text>
                            <Text>Image: {item.image}</Text>

                        </View>
                    </TouchableOpacity>

                }
                data={stories}
            />

        </View>
    )
}