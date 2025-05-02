import { FlatList, Image, ImageBackground, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useSQLiteContext } from "expo-sqlite";
import { Button, Card, Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import dayjs from "dayjs";

import { initializeDatabase } from "../resources/initializeDatabase";

import { NavigatorParams } from "../resources/customTypes";
import { Story } from "../resources/customTypes";
import styles from "../resources/styles"
import { useAuth } from "../resources/useAuth";
import { useBackground } from "../resources/useBackground";




type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function HomeScreen() {
    const navigation = useNavigation<navigatorProp>();
    const db = useSQLiteContext();
    const [stories, setStories] = useState<Story[]>()
    const [users, setUsers] = useState()
    const directory = `${FileSystem.documentDirectory}diary`
    const { active, user, login, logout } = useAuth();
    const { background, fetchBackground } = useBackground();

    const exampleStory = {
        id: '0',
        user: user,
        time: "123",
        header: "Example Story",
        body: "Body of text\nThis should be on a new line.",
        image: "-1",
        private: false
    }

    const testUser = {
        userId: '0',
        name: 'Tester',
        password: 'Password'
    }

    const getStories = async () => {
        try {
            const list = await db.getAllAsync('SELECT * from stories WHERE user = (?) OR private = false', user);
            setStories(list as Story[]);
        } catch (error) {
            console.error('Could not get stories', error);
        }
    }

    const getUsers = async () => {
        try {
            const list = await db.getAllAsync('SELECT * from users');
            setUsers(list as any);
        } catch (error) {
            console.error('Could not get users', error);
        }
    }

    const saveStory = async () => {
        try {
            await db.runAsync('INSERT INTO stories (id, user, time, header, body, image, private) VALUES (?, ?, ?, ?, ?, ?, ?)', exampleStory.id, exampleStory.user, exampleStory.time, exampleStory.header, exampleStory.body, exampleStory.image, exampleStory.private)
        } catch (error) {
            console.error('Could not add story', error);
        }
        getStories();
    }

    const addTestUser = async () => {

        try {
            await db.runAsync('INSERT INTO users (name, password) VALUES ( ?, ?)', testUser.name, testUser.password)
        } catch (error) {
            console.error('Could not add user', error)
        }
        getUsers();
    }

    const resetDB = async () => {
        try {
            await db.runAsync('DROP table stories')
        } catch (error) {
            console.error(error);
        }
        try {
            await db.runAsync('DROP table users')
        } catch (error) {
            console.error(error);
        }
        try {
            await db.runAsync('DROP table activeuser')
        } catch (error) {
            console.error(error);
        }
        initializeDatabase(db);

        try {
            await db.runAsync('DELETE from stories')
        } catch (error) {
            console.error(error);
        }
        try {
            await db.runAsync('DELETE from users')
        } catch (error) {
            console.error(error);
        }
        try {
            await db.runAsync('DELETE from activeuser')
        } catch (error) {
            console.error(error)
        }
        deletePictures();
        getUsers();
        getStories();
        active();
    }

    const deletePictures = async () => {
        FileSystem.deleteAsync(directory)
    }

    useEffect(() => {
        //resetDB();
        active();
        getUsers();
        getStories();
        if (!background) {
            fetchBackground();
        }
    }, [])

    useEffect(() => {
        getStories();
    }, [user])

    const handleSubmit = () => {
        login('Tester', 'Password')
        getStories();
    }

    return (
        <ImageBackground source={{ uri: background }} style={styles.center} resizeMode="cover">
            <View style={styles.center}>
                <Text style={styles.user}>
                    {user != null ? (
                        <>
                            User: {user}
                        </>
                    ) : (
                        'User: Guest'
                    )}
                </Text>
                <View style={styles.row}>
                    <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Signin')}>
                        Login
                    </Button>
                    <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Signup')}>
                        Sign up
                    </Button>
                    <Button style={styles.margin} mode="contained" onPress={() => logout()}>
                        Logout
                    </Button>
                </View>
                <View style={styles.row}>
                    <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('NewStory')} >
                        New Story
                    </Button>
                    <Button style={styles.margin} mode="contained" onPress={resetDB}>
                        Reset DB
                    </Button>
                </View>

                <Text variant="titleLarge" style={{ backgroundColor: "white", margin: 5 }}>Stories timeline</Text>
                <FlatList
                    keyExtractor={item => item.id}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('ViewStory', { id: item.id });
                            }}
                        >
                            <View>
                                <Card style={{ minWidth: "80%", margin: 5 }}>
                                    <Card.Title title={`${dayjs(item.time).format('DD/MM/YYYY - HH:mm')} by ${item.user}`} />
                                    <Card.Content>
                                        <Text variant="titleLarge">{item.header}</Text>
                                        <Text variant="bodyMedium">{item.body}</Text>
                                    </Card.Content>
                                    {item.image != '-1' ? (
                                        <Card.Cover source={{ uri: item.image }} />
                                    ) : (
                                        null
                                    )}
                                </Card>
                            </View>
                        </TouchableOpacity>

                    }
                    data={stories}
                />

            </View>
        </ImageBackground>
    )
}


/*
            <FlatList
                keyExtractor={item => item.name}
                renderItem={({ item }) =>
                    <View style={styles.borderBlue}>
                        <Text>Name: {item.name}</Text>
                        <Text>Password: {item.password}</Text>
                    </View>
                }
                data={users}
            />

                <Button style={styles.margin} mode="contained" onPress={saveStory}>
                    Test Add
                </Button>


            <View style={styles.row}>
                <Button style={styles.margin} mode="contained" onPress={addTestUser}>
                    Add test user
                </Button>
                <Button style={styles.margin} mode="contained" onPress={handleSubmit}>
                    Test login
                </Button>
                                <Button style={styles.margin} mode="contained" onPress={deletePictures}>
                    Delete Pictures
                </Button>
            </View>

                                <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ViewStory', { id: item.id });
                        }}
                    >
                        <View style={styles.borderBlue}>
                            {item.image != '-1' ? (
                                <>
                                    <Image style={{ height: 80, width: 80 }} source={{ uri: item.image }} />
                                </>
                            ) : (
                                null
                            )}
                            <Card>
                                <Card.Title title={`${dayjs(item.time).format('DD/MM/YYYY')} - ${item.user}`} />
                                <Card.Content>
                                    <Text variant="titleLarge">{item.header}</Text>
                                    <Text variant="bodyMedium">{item.body}</Text>
                                </Card.Content>
                                {item.image != '-1' ? (
                                    <Card.Cover source={{ uri: item.image }} />
                                ) : (
                                    null
                                )}
                            </Card>
                            <Text>ID: {item.id}</Text>
                            <Text>Name: {item.user}</Text>
                            <Text>Time: {item.time}</Text>
                            <Text>Header: {item.header}</Text>
                            <Text>Body: {item.body}</Text>
                            <Text>Image: {item.image}</Text>
                            <Text>Private: {item.private}</Text>
                        </View>
                    </TouchableOpacity>
*/