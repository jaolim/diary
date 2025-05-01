import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useSQLiteContext } from "expo-sqlite";
import { Button } from "react-native-paper";

import * as FileSystem from 'expo-file-system';

import { NavigatorParams } from "../resources/customTypes";
import { Story } from "../resources/customTypes";
import styles from "../resources/styles"
import { useAuth } from "../resources/useAuth";




type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function HomeScreen() {
    const navigation = useNavigation<navigatorProp>();
    const db = useSQLiteContext();
    const [stories, setStories] = useState<Story[]>()
    const [users, setUsers] = useState()
    const directory = `${FileSystem.documentDirectory}diary`

    const { user, login, logout } = useAuth();

    const exampleStory = {
        id: '0',
        user: 'Testaaja',
        time: "123",
        header: "Example Story",
        body: "Body of text\nThis should be on a new line.",
        image: "-1",
    }

    const testUser = {
        userId: '0',
        name: 'Tester',
        password: 'Password'
    }

    const getStories = async () => {
        try {
            const list = await db.getAllAsync('SELECT * from stories');
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
            console.error('Could not get stories', error);
        }
    }

    const saveStory = async () => {
        try {
            await db.runAsync('INSERT INTO stories (id, user, time, header, body, image) VALUES (?, ?, ?, ?, ?, ?)', exampleStory.id, exampleStory.user, exampleStory.time, exampleStory.header, exampleStory.body, exampleStory.image)
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
            await db.execAsync(`
     CREATE TABLE IF NOT EXISTS stories (
       id TEXT,
       user TEXT,
       time TEXT,
       header TEXT,
       body TEXT,
       image TEXT
     );
     `
            );
        } catch (error) {
            console.error(error);
        }
        try {
            await db.execAsync(`
     CREATE TABLE IF NOT EXISTS users (
       name TEXT,
       password TEXT
     );
     `
            );
        } catch (error) {
            console.error(error);
        }


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
        deletePictures();
        getUsers();
        getStories();
    }

    const deletePictures = async () => {
        FileSystem.deleteAsync(directory)
    }

    useEffect(() => {
        //resetDB();
        getUsers();
        getStories();
    }, [])

    const handleSubmit = () => {
        login('test', '123')
    }


    return (
        <View style={styles.center}>
            <Text style={{ color: "blue" }}>{user}</Text>
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
            <View style={styles.row}>
                <Button style={styles.margin} mode="contained" onPress={deletePictures}>
                    Delete Pictures
                </Button>
                <Button style={styles.margin} mode="contained" onPress={addTestUser}>
                    Add test user
                </Button>
                <Button style={styles.margin} mode="contained" onPress={handleSubmit}>
                    Test login
                </Button>
            </View>
            <View style={styles.row}>
                <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Signin')}>
                    Login screen
                </Button>
                <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Signup')}>
                    Sign up screen
                </Button>
                <Button style={styles.margin} mode="contained" onPress={() => logout()}>
                    Logout
                </Button>
            </View>
            <Text>
                {user != null ? (
                    <>
                        {user}
                    </>
                ) : (
                    'No user logged in'
                )}
            </Text>
            <FlatList
                keyExtractor={item => item.userId}
                renderItem={({ item }) =>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ViewStory', { id: item.id });
                        }}
                    >
                        <View style={styles.borderBlue}>
                            <Text>ID: {item.name}</Text>
                        </View>

                    </TouchableOpacity>

                }
                data={users}
            />

            <FlatList
                keyExtractor={item => item.id}
                renderItem={({ item }) =>
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
                            <Text>ID: {item.id}</Text>
                            <Text>Name: {item.user}</Text>
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
