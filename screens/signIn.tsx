import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

import { useAuth } from "../resources/useAuth";
import styles from "../resources/styles";
import { NavigatorParams } from "../resources/customTypes";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function Signin() {
    const navigation = useNavigation<navigatorProp>();
    const { user, logout, login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const db = useSQLiteContext();

    return (
        <View>
            <Text>Login Screen</Text>
            <Text>{user}</Text>
            <View style={styles.row}>
                <Button style={styles.margin} mode="contained" onPress={logout}>
                    Test Logout
                </Button>
                <Button style={styles.margin} mode="contained" onPress={async () => await login(username, password)}>
                    Login
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
                label="Password"
                value={password}
                onChangeText={text => setPassword(text)}
            />
        </View>
    )
}