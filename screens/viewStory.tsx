import { useState } from "react";
import { Text, View } from "react-native"

import { Button } from "react-native-paper";

import styles from "../resources/styles"
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

export default function ViewStory({ route }: any) {
    const navigation = useNavigation();
    const db = useSQLiteContext();
    const thisId = route.params.id;
    const [story, setStory] = useState<any>();

    const getStory = async () => {
        try {
            const getStory  = await db.getAllAsync('SELECT * from stories WHERE id = (?)', thisId) 
            setStory(getStory[0])
        } catch (error) {
            console.error('Error accessing database', error)
        }
    }

    return (
        <View style={styles.center}>
            <Text>{JSON.stringify(story)}</Text>
            <Text>ID: {route.params.id}</Text>
            <Button mode="contained" onPress={getStory}>
                Test fetch
            </Button>
        </View>
    )
}