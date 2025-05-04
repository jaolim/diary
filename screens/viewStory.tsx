import { useEffect, useState } from "react";
import { FlatList, ImageBackground, Keyboard, View } from "react-native"
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSQLiteContext } from "expo-sqlite";
import * as FileSystem from 'expo-file-system';

import styles from "../resources/styles"
import { useBackground } from "../resources/useBackground";
import { Comment, NavigatorParams, Story } from "../resources/customTypes";
import { useAuth } from "../resources/useAuth";

type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function ViewStory({ route }: any) {
    const navigation = useNavigation<navigatorProp>();
    const db = useSQLiteContext();
    const { background } = useBackground();
    const { user } = useAuth();
    const thisId = route.params.id;
    const [comments, setComments] = useState<Comment[]>([]);
    const [comment, setComment] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
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
            const getStory = await db.getAllAsync('SELECT * from stories WHERE id = (?)', thisId);
            setStory(getStory[0] as Story);
        } catch (error) {
            console.error('Error accessing database', error);
        }
    }

    const getComments = async () => {
        try {
            const list = await db.getAllAsync('SELECT * from comments WHERE storyId = (?)', story.id);
            setComments(list.reverse() as Comment[]);
        } catch (error) {
            console.error('Could not get stories', error);
        }
    }

    const deleteStory = async () => {
        try {
            db.runAsync('DELETE from stories WHERE id = (?)', thisId)
            if (story.image != '-1') {
                FileSystem.deleteAsync(story.image);
            }
            try {
                db.runAsync('DELETE from comments WHERE storyId = (?)', thisId);
            } catch (error) {
                console.error('Could not delete comments');
            }
        } catch (error) {
            console.error('Could not delete story');
        }
    }

    const addComment = async () => {
        const time = dayjs().toISOString();
        try {
            await db.runAsync('INSERT INTO comments (id, user, storyId, time, comment) VALUES (?, ?, ?, ?, ?)', story.id + time + user, user, story.id, time, comment);
        } catch (error) {
            console.error('Could not add story', error);
        }
        setComment('');
        Keyboard.dismiss();
        getComments();
    }

    const deleteComment = async (id: string) => {
        try {
            db.runAsync('DELETE from comments WHERE id = (?)', id);
        } catch (error) {
            console.error('Could not delete comment');
        }
        getComments();
    }

    useEffect(() => {
        getStory();
        getComments();
        if (!user) {
            setIsDisabled(true)
        }
    }, [])

    useEffect(() => {
        getComments();
    }, [story])

    return (
        <ImageBackground source={{ uri: background }} style={styles.center} resizeMode="cover">
            <View style={styles.center}>
                <View style={styles.row}>
                    <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Home')}>
                        Home
                    </Button>
                    {user == story.user ? (
                        <IconButton style={styles.marginWhite} icon="trash-can" size={30} onPress={
                            () => {
                                deleteStory();
                                navigation.navigate('Home');
                            }
                        }>
                        </IconButton>
                    ) : (
                        null
                    )}
                </View>
                {story.id != '-1' ? (
                    <Card style={{ minWidth: "95%", width: 250 }}>
                        <Card.Title title={`${dayjs(story.time).format('DD/MM/YYYY - HH:mm')} by ${story.user}`} />
                        <View style={styles.row}>
                            <Card.Content>
                                <Text variant="titleLarge">{story.header}</Text>
                                <Text variant="bodyMedium">{story.body}</Text>
                            </Card.Content>
                            {story.image != '-1' ? (
                                <Card.Cover source={{ uri: story.image }} style={{ minWidth: "40%" }} resizeMode="contain" />
                            ) : (
                                null
                            )}
                        </View>
                    </Card>
                ) : (
                    null
                )}
                <FlatList
                    keyExtractor={item => item.id}
                    renderItem={({ item }) =>
                        <View style={styles.row}>
                            <Card style={{ width: "80%", margin: 5 }}>
                                <Card.Title title={`${dayjs(item.time).format('DD/MM/YYYY - HH:mm')} by ${item.user}`} />
                                <View style={styles.row}>
                                    <Card.Content>
                                        <Text variant="bodyMedium">{item.comment}</Text>
                                    </Card.Content>
                                    <Card.Actions>
                                        {user == item.user ? (
                                            <IconButton style={styles.marginWhite} icon="trash-can" size={30} onPress={() => deleteComment(item.id)} />
                                        ) : (
                                            null
                                        )}
                                    </Card.Actions>
                                </View>
                            </Card>
                        </View>
                    }
                    data={comments}
                />
            </View>
            <View style={styles.row}>
                <TextInput
                    style={styles.inputComment}
                    label="Comment"
                    disabled={isDisabled}
                    value={comment}
                    onChangeText={text => setComment(text)}
                />
                {user ? (
                    <Button style={styles.margin} mode="contained" onPress={addComment}>
                        Comment
                    </Button>
                ) : (
                    <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Signin')}>
                        Log in to comment
                    </Button>
                )}
            </View>
        </ImageBackground>
    )

}