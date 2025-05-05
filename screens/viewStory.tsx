import { useEffect, useState } from "react";
import { FlatList, ImageBackground, Keyboard, ScrollView, View } from "react-native"
import { Button, Card, IconButton, Paragraph, Text, Title, TextInput } from "react-native-paper";
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
    // context variables
    const navigation = useNavigation<navigatorProp>();
    const db = useSQLiteContext();
    const { background } = useBackground();
    const { user } = useAuth();
    // variable for storing the story id from react navigation route
    const thisId = route.params.id;
    // comments list and comment input value variables
    const [comments, setComments] = useState<Comment[]>([]);
    const [comment, setComment] = useState('');
    // variable for disabling comment input field
    const [isDisabled, setIsDisabled] = useState(false);
    // variabled for currently displayed story
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
    const [isFirst, setIsFirst] = useState(true)

    // story getter from a database that calls setStory to save the query result
    const getStory = async () => {
        try {
            const getStory = await db.getAllAsync('SELECT * from stories WHERE id = (?)', thisId);
            setStory(getStory[0] as Story);
        } catch (error) {
            console.error('Error accessing database', error);
        }
    }

    // comments getter from a database that calls setComments to save the query result
    const getComments = async () => {
        try {
            const list = await db.getAllAsync('SELECT * from comments WHERE storyId = (?)', story.id);
            setIsFirst(true)
            setComments(list.reverse() as Comment[]);
        } catch (error) {
            console.error('Could not get stories', error);
        }
    }

    // deletes story and an associated image if there is one
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

    // adds a comment to database, resets comment input fiel, dimisses keyboard, and reloads comments list
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

    // deletes a comment and reloads comments
    const deleteComment = async (id: string) => {
        try {
            db.runAsync('DELETE from comments WHERE id = (?)', id);
        } catch (error) {
            console.error('Could not delete comment');
        }
        getComments();
    }

    // loads the story, loads comments, and disables comment field if viewed as a guest on page load
    useEffect(() => {
        getStory();
        getComments();
        if (!user) {
            setIsDisabled(true)
        }
    }, [])

    // loads comments if value of the story changes
    useEffect(() => {
        getComments();
    }, [story])

    // Story and comment view for a specific story with conditional delete buttons rendered based on story/comment ownership
    // The story is in a single Card component and comments are in Cards inside a FlatList
    return (
        <ImageBackground source={{ uri: background }} style={styles.center} resizeMode="cover">
            <View style={styles.center}>
                <View style={styles.row}>
                    <Button style={styles.margin} mode="contained" icon="home" onPress={() => navigation.navigate('Home')}>
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
                <ScrollView>
                    {story.id != '-1' ? (
                        <Card style={{ minWidth: "95%", width: 250 }}>
                            <Card.Title title={`${dayjs(story.time).format('DD/MM/YYYY - HH:mm')} by ${story.user}`} />
                            <View style={styles.row}>
                                <Card.Content>
                                    <Title>{story.header}</Title>
                                    <Paragraph>{story.body}</Paragraph>
                                    {story.image != '-1' ? (
                                        <Card.Cover source={{ uri: story.image }} style={{ minWidth: "40%" }} resizeMode="contain" />
                                    ) : (
                                        null
                                    )}
                                </Card.Content>
                            </View>
                        </Card>
                    ) : (
                        null
                    )}
                    <View style={styles.column}>
                        {comments.map((item, index) => {
                            return (
                                <Card style={styles.column}>
                                    <Card.Title title={`${dayjs(item.time).format('DD/MM/YYYY - HH:mm')} by ${item.user}`} />
                                        <Card.Content>
                                            <Paragraph>{item.comment}</Paragraph>
                                        </Card.Content>
                                        <Card.Actions>
                                            {user == item.user ? (
                                                <IconButton style={styles.marginWhite} icon="trash-can" size={20} onPress={() => deleteComment(item.id)} />
                                            ) : (
                                                null
                                            )}
                                        </Card.Actions>
                                </Card>
                            );
                        })}
                    </View>
                </ScrollView>
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
        </ImageBackground >
    )

}