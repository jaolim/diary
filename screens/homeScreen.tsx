import { FlatList, Image, ImageBackground, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useSQLiteContext } from "expo-sqlite";
import { Button, Card, Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import dayjs from "dayjs";

import { initializeDatabase } from "../resources/initializeDatabase";

import { NavigatorParams, User } from "../resources/customTypes";
import { Story } from "../resources/customTypes";
import styles from "../resources/styles"
import { useAuth } from "../resources/useAuth";
import { useBackground } from "../resources/useBackground";




type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function HomeScreen() {
    const navigation = useNavigation<navigatorProp>();
    const db = useSQLiteContext();
    const [stories, setStories] = useState<Story[]>()
    const directory = `${FileSystem.documentDirectory}diary`
    const { active, user, logout } = useAuth();
    const { background, fetchBackground } = useBackground();

    const getStories = async () => {
        try {
            const list = await db.getAllAsync('SELECT * from stories WHERE user = (?) OR private = false', user);
            setStories(list.reverse() as Story[]);
        } catch (error) {
            console.error('Could not get stories', error);
        }

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
        //getUsers();
        getStories();
        active();
    }

    const deletePictures = async () => {
        FileSystem.deleteAsync(directory)
    }

    useEffect(() => {
        //resetDB();
        //getUsers();
        active();
        getStories();
        if (!background) {
            fetchBackground();
        }
    }, [])

    useEffect(() => {
        getStories();
    }, [user])

    return (
        <ImageBackground source={{ uri: background }} style={styles.center} resizeMode="cover">
            <View style={styles.center}>
                {user ? (
                    <Text style={styles.user} variant="titleLarge">User: {user}</Text>
                ) : (
                    <Text style={styles.user} variant="titleLarge">User: Guest</Text>
                )}
                <View style={styles.row}>
                    <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Signin')}>
                        Login
                    </Button>
                    <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Signup')}>
                        Sign up
                    </Button>
                    <Button style={styles.margin} mode="contained" onPress={async () => {
                        const loggedOut = await logout();
                        if (loggedOut) {
                            getStories();
                        }
                    }}>
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
                                    <View style={styles.row}>
                                        <Card.Content>
                                            <Text variant="titleLarge">{item.header}</Text>
                                            <Text variant="bodyMedium">{item.body}</Text>
                                        </Card.Content>
                                        {item.image != '-1' ? (
                                            <Card.Cover source={{ uri: item.image }} style={{minWidth:"30%"}} resizeMode='contain'/>
                                        ) : (
                                            null
                                        )}
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
