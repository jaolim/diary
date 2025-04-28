import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native"

import { Button } from "react-native-paper";

import styles from "../resources/styles"
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

export default function ViewStory({ route }: any) {
    const navigation = useNavigation();
    const db = useSQLiteContext();
    const thisId = route.params.id;
    const [story, setStory] = useState<any>(
        {
            id: '-1',
            time: '-1',
            header: '-1',
            body: null,
            image: '-1',
        }
    );

    const getStory = async () => {
        try {
            const getStory = await db.getAllAsync('SELECT * from stories WHERE id = (?)', thisId)
            setStory(getStory[0])
        } catch (error) {
            console.error('Error accessing database', error)
        }
    }

    useEffect(() => {
        getStory();
    }, [])

    if (story.image != '-1') {
        return (
            <View style={styles.center}>
                <Image style={{ flex: 1, minWidth: "100%" }} source={{ uri: story.image }} />
                <Text>{JSON.stringify(story)}</Text>
                <Text>ID: {route.params.id}</Text>
                <View style={styles.row}>
                    <Button mode="contained" onPress={getStory}>
                        Manual Fetch
                    </Button>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.center}>
            <Text>{JSON.stringify(story)}</Text>
            <Text>ID: {route.params.id}</Text>
            <View style={styles.row}>
                <Button mode="contained" onPress={getStory}>
                    Manual Fetch
                </Button>
                <Button mode="contained" onPress={getStory}>
                    Manual Fetch
                </Button>
            </View>
        </View>
    )
}
