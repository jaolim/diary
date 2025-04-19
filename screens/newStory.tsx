import { useEffect, useRef, useState } from "react";
import { Image, Modal, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { StackNavigationProp } from '@react-navigation/stack';
import { CameraView, useCameraPermissions } from "expo-camera";

import { Story, NavigatorParams } from "../resources/customTypes";
import styles from "../resources/styles"
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "./homeScreen";
import dayjs from "dayjs";


type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function NewStory({ route }: any) {
    const db = useSQLiteContext();
    const navigation = useNavigation<navigatorProp>();
    const time = dayjs().toISOString();
    const [header, setHeader] = useState("");
    const [body, setBody] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [imageName, setImageName] = useState();
    const [imageBase64, setImageBase64] = useState('');
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false)
    const camera = useRef(null)

    const saveStory = async () => {

        if (route.params.img != '-1') {
            try {
                await db.runAsync(
                    'UPDATE stories SET header = (?), body = (?), time = (?) WHERE id = (?)', header, body, time, route.params.storyId
                )
            } catch (error) {
                console.error('Could not add story', error);
            }
        } else {
            try {
                await db.runAsync('INSERT INTO stories (id, time, header, body, image) VALUES (?, ?, ?, ?, ?)', time + 'User', time, header, body, '-1')
            } catch (error) {
                console.error('Could not add story', error);
            }

        }
        setIsDisabled(true)
        navigation.navigate('Home')
    }
/*
    const getImage = async () => {
        if (route.params.img != '-1') {
            try {
                const image = await db.runAsync('SELECT image FROM stories WHERE id = (?)', route.params.storyId)
                setImageBase64(image)
            } catch (error) {
                console.error("Unable to fetch image", error)
            }
        }
    }
*/
    return (
        <View style={styles.center}>
            <TextInput
                style={styles.inputTitle}
                label="Title"
                disabled={isDisabled}
                value={header}
                onChangeText={text => setHeader(text)}
            />
            <Image style={{ flex: 1 }} source={{ uri: `data:image/jpg;base64,${imageBase64}` }} />
            <TextInput
                style={styles.inputBody}
                label="Story"
                disabled={isDisabled}
                value={body}
                onChangeText={text => setBody(text)}
            />
            <View style={styles.row}>
            <Button mode="contained" onPress={saveStory}>
                Add Story
            </Button>
            <Button mode="contained" onPress={() => {
                navigation.navigate('Camera', { storyId: time + 'User' })
            }}>
                Take Picture
            </Button>
            <Button mode="contained" onPress={() => {
                navigation.navigate('Home')
            }}>
                Exit
            </Button>
            </View>
            <Text>{JSON.stringify(route.params)}</Text>
        </View>
    )
}
