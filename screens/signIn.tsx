import { useState } from "react";
import { ImageBackground, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

import { useAuth } from "../resources/useAuth"
import { useBackground } from "../resources/useBackground";
import styles from "../resources/styles";
import { NavigatorParams } from "../resources/customTypes";

type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function Signin() {
    // context variables
    const navigation = useNavigation<navigatorProp>();
    const { user, logout, login } = useAuth();
    const { background } = useBackground();
    // react controlled variables for input fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // variable for disabling input fields
    const [isDisabled, setIsDisabled] = useState(false);

    //Log in view with some navigation buttons and user/password inputs, login verification is handled via authContext function login
    return (
        <ImageBackground source={{ uri: background }} style={styles.center} resizeMode="cover">
            <View style={styles.center}>
                {user ? (
                    <Text style={styles.user} variant="titleLarge">User: {user}</Text>
                ) : (
                    <Text style={styles.user} variant="titleLarge">User: Guest</Text>
                )}

                <View style={styles.row}>
                    <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('Home')}>
                        Home
                    </Button>
                    <Button style={styles.margin} mode="contained" onPress={logout}>
                        Logout
                    </Button>
                </View>
                <TextInput
                    style={styles.inputTitle}
                    label="Name"
                    value={username}
                    onChangeText={text => setUsername(text)}
                    disabled={isDisabled}
                />
                <TextInput
                    style={styles.inputTitle}
                    secureTextEntry={true}
                    label="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    disabled={isDisabled}
                />
                <Button style={styles.margin} mode="contained" onPress={async () => {
                    const logged = await login(username, password);
                    if (logged) {
                        navigation.navigate('Home');
                    }
                }}>
                    Login
                </Button>

            </View>
        </ImageBackground>
    )
}