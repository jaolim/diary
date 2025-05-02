import { useEffect, useState } from "react";
import { ImageBackground, View } from "react-native"
import { Button, Card, Text } from "react-native-paper";
import dayjs from "dayjs";

import styles from "../resources/styles"
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSQLiteContext } from "expo-sqlite";

import { useBackground } from "../resources/useBackground";
import { Story } from "../resources/customTypes";
import { NavigatorParams } from "../resources/customTypes";
import { useAuth } from "../resources/useAuth";

type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function ViewStory({ route }: any) {
    const navigation = useNavigation<navigatorProp>();
    const { background } = useBackground();
    const db = useSQLiteContext();
    const thisId = route.params.id;
    const { user } = useAuth();
    const [story, setStory] = useState<Story>(
        {
            id: '-1',
            user: '-1',
            time: '-1',
            header: '-1',
            body: '-1',
            image: '-1',
            private: false
        }
    );

    const getStory = async () => {
        try {
            const getStory = await db.getAllAsync('SELECT * from stories WHERE id = (?)', thisId)
            setStory(getStory[0] as Story)
        } catch (error) {
            console.error('Error accessing database', error)
        }
    }

    const deleteStory = async () => {
        try {
            db.runAsync('DELETE from stories WHERE id = (?)', thisId)
        } catch (error) {
            console.error('Could not delete story')
        }
    }

    useEffect(() => {
        getStory();
    }, [])


    return (
        <ImageBackground source={{ uri: background }} style={styles.center} resizeMode="cover">
            <View style={styles.center}>

                <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Home')}>
                    Home
                </Button>

                <Card style={{ minWidth: "80%" }}>
                    <Card.Title title={`${dayjs(story.time).format('DD/MM/YYYY - HH:mm')} by ${story.user}`} />
                    <Card.Content>
                        <Text variant="titleLarge">{story.header}</Text>
                        <Text variant="bodyMedium">{story.body}</Text>
                    </Card.Content>
                    {story.image != '-1' ? (
                        <Card.Cover source={{ uri: story.image }} />
                    ) : (
                        null
                    )}
                </Card>
                {user == story.user ? (
                    <Button style={styles.margin} mode="contained" onPress={
                        () => {
                            deleteStory();
                            navigation.navigate('Home')
                        }
                    }>
                        Delete Story
                    </Button>
                ) : (
                    null
                )}
            </View>
        </ImageBackground>
    )

}