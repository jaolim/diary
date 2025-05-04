import { useState } from "react";
import { ImageBackground, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useSQLiteContext } from "expo-sqlite";

import { useAuth } from "../resources/useAuth";
import { useBackground } from "../resources/useBackground";
import styles from "../resources/styles";
import { NavigatorParams } from "../resources/customTypes";

type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function Signup() {
    const navigation = useNavigation<navigatorProp>();
    const { user, login, logout, register } = useAuth();
    const [users, setUsers] = useState<string[] | unknown[]>([]);
    const db = useSQLiteContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { background } = useBackground();

    const addUser = async (name: string, password: string) => {
        if (users.includes(name)) {
            alert('Choose a unique username');
        } else {
            register(name, password);
            login(name, password);
            navigation.navigate('Home');
        }
    }

    return (
        <ImageBackground source={{ uri: background }} style={styles.center} resizeMode="cover">
            <View style={styles.center}>
                {user ? (
                    <Text style={styles.user} variant="titleLarge">User: {user}</Text>
                ) : (
                    <Text style={styles.user} variant="titleLarge">User: Guest</Text>
                )}
                <View style={styles.row}>
                    <Button style={styles.margin} mode="contained" onPress={logout}>
                        Logout
                    </Button>
                    <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Home')}>
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
                <Button style={styles.margin} mode="contained" onPress={() => addUser(username, password)}>
                    Sign up
                </Button>
            </View>
        </ImageBackground>
    )

}