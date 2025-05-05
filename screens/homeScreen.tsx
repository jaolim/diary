import { useEffect, useState } from "react";
import { Alert, FlatList, ImageBackground, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useSQLiteContext } from "expo-sqlite";
import { Button, Card, Paragraph, Text, Title } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import dayjs from "dayjs";

import { initializeDatabase } from "../resources/initializeDatabase";

import { NavigatorParams, Story } from "../resources/customTypes";
import styles from "../resources/styles"
import { useAuth } from "../resources/useAuth";
import { useBackground } from "../resources/useBackground";

type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function HomeScreen() {
    // Context variables
    const navigation = useNavigation<navigatorProp>();
    const db = useSQLiteContext();
    const { active, user, logout } = useAuth();
    const { background, fetchBackground } = useBackground();

    const directory = `${FileSystem.documentDirectory}diary` // directory variable for local image directory
    const [stories, setStories] = useState<Story[]>(); // stories list that will have its value assigned by getStories function via a database query

    // Stories getter for public stories or stories by current user
    const getStories = async () => {
        try {
            const list = await db.getAllAsync('SELECT * from stories WHERE user = (?) OR private = false', user);
            setStories(list.reverse() as Story[]);
        } catch (error) {
            console.error('Could not get stories', error);
        }
    }

    // Database reset and reinitializer
    const resetDB = async () => {
        try {
            await db.runAsync('DROP table stories');
        } catch (error) {
            console.error(error);
        }
        try {
            await db.runAsync('DROP table users');
        } catch (error) {
            console.error(error);
        }
        try {
            logout();
            await db.runAsync('DROP table activeuser');
        } catch (error) {
            console.error(error);
        }
        initializeDatabase(db);
        deletePictures();
        getStories();
        active();
    }

    // Confirmation popup for ResetDB call
    const resetDBPopup = async () => {
        Alert.alert('Confirm to reset database', 'Warning: this will delete all users, stories and pictures.', [
            {
                text: 'Cancel'
            },
            {
                text: 'Confirm',
                onPress: () => resetDB()
            }
        ]);
    }

    // Deletes saved pictures by clearing the local folder used by FileSystem
    const deletePictures = async () => {
        FileSystem.deleteAsync(directory);
    }

    // UseEffect on screen load that checks for active user in database, loads stories and loads background if one is not active, uncomment resetDB() to clear database on restart
    useEffect(() => {
        //resetDB();
        active();
        getStories();
        if (!background) {
            fetchBackground();
        }
    }, [])

    // UseEffect for reloading stories if active user changes
    useEffect(() => {
        getStories();
    }, [user])

    // HomeScreen view with background image via background context, active user status and navigation buttons on top and clickabale Cards generated in FlatList at bottom
    return (
        <ImageBackground source={{ uri: background }} style={styles.center} resizeMode="cover">
            <View style={styles.center}>
                {user ? (
                    <Text style={styles.user} variant="titleLarge">User: {user}</Text>
                ) : (
                    <Text style={styles.user} variant="titleLarge">User: Guest</Text>
                )}
                <View style={styles.row}>
                    <Button style={styles.margin} mode="contained" icon="login" onPress={() => navigation.navigate('Signin')}>
                        Login
                    </Button>
                    <Button style={styles.margin} mode="contained" icon="account" onPress={() => navigation.navigate('Signup')}>
                        Sign up
                    </Button>
                    <Button style={styles.margin} mode="contained" icon="logout" onPress={async () => {
                        const loggedOut = await logout();
                        if (loggedOut) {
                            getStories();
                        }
                    }}>
                        Logout
                    </Button>
                </View>
                <View style={styles.row}>
                    <Button style={styles.margin} mode="contained" icon="newspaper" onPress={() => navigation.navigate('NewStory')}>
                        New Story
                    </Button>
                    <Button style={styles.margin} mode="contained" icon="database" onPress={resetDBPopup} buttonColor="red">
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
                            <View>
                                <Card style={{ minWidth: "80%", margin: 5 }}>
                                    <Card.Title title={`${dayjs(item.time).format('DD/MM/YYYY - HH:mm')} by ${item.user}`} />
                                    <View>
                                        <Card.Content>
                                            <Title>{item.header}</Title>
                                            <Paragraph>{item.body}</Paragraph>
                                            {item.image != '-1' ? (
                                                <Card.Cover source={{ uri: item.image }} style={{ minWidth: "30%", paddingBottom:5 }} resizeMode='contain' />
                                            ) : (
                                                null
                                            )}
                                        </Card.Content>
                                    </View>
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
