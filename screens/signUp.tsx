import { useEffect, useState } from "react";
import { ImageBackground, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useSQLiteContext } from "expo-sqlite";

import { useAuth } from "../resources/useAuth";
import { useBackground } from "../resources/useBackground";
import styles from "../resources/styles";
import { User } from "../resources/customTypes";
import { NavigatorParams } from "../resources/customTypes";

type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function Signup() {
    // context varaibles
    const navigation = useNavigation<navigatorProp>();
    const db = useSQLiteContext();
    const { user, login, logout, register } = useAuth();
    const { background } = useBackground();
    // react controlled variables for input fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // user list for checking if a name is already taken
    const [users, setUsers] = useState<string[]>([]);

    // fills the users list via a database query
    const getUsers = async () => {
        const data = await db.getAllAsync('SELECT name FROM users') as User[];
        setUsers(data.map((value) => value.name));
    }

    // calls register and login functions provided by authContext if the user name is unique
    const addUser = async (name: string, password: string) => {
        if (users.includes(name)) {
            alert('Choose a unique username');
        } else {
            register(name, password);
            login(name, password);
            navigation.navigate('Home');
        }
    }

    // fills the user list on page load
    useEffect(() => {
        getUsers();
    }, [])

    // sign up view with navigation buttons, input fields for user name and password and a sign up button for calling addUser function
    return (
        <ImageBackground source={{ uri: background }} style={styles.center} resizeMode="cover">
            <View style={styles.center}>
                {user ? (
                    <Text style={styles.user} variant="titleLarge">User: {user}</Text>
                ) : (
                    <Text style={styles.user} variant="titleLarge">User: Guest</Text>
                )}
                <View style={styles.row}>
                    <Button style={styles.margin} mode="contained" icon="logout" onPress={logout}>
                        Logout
                    </Button>
                    <Button style={styles.margin} mode="contained" icon="home" onPress={() => navigation.navigate('Home')}>
                        Home
                    </Button>
                </View>
                <TextInput
                    style={styles.inputTitle}
                    label="Name"
                    value={username}
                    onChangeText={text => setUsername(text)}
                />
                <TextInput
                    style={styles.inputTitle}
                    secureTextEntry={true}
                    label="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Button style={styles.margin} mode="contained" icon="account" onPress={() => addUser(username, password)}>
                    Sign up
                </Button>
            </View>
        </ImageBackground>
    )

}