import { useRef, useState } from "react";
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

export default function Camera( {route}: any ) {
    const db = useSQLiteContext();
    const navigation = useNavigation<navigatorProp>();
    const camera = useRef(null)
    const [photoName, setPhotoName] = useState('');
    const [photoBase64, setPhotoBase64] = useState('');
    const [permission, requestPermission] = useCameraPermissions();

    const snap = async () => {
        if (camera) {
            const photo = await camera.current.takePictureAsync({ base64: true });
            setPhotoName(photo.uri);
            setPhotoBase64(photo.base64);
        }
    }

    const savePicture = async () => {
        try {
            await db.runAsync('INSERT INTO stories (id, time, header, body, image) VALUES (?, ?, ?, ?, ?)', route.params.storyId, '123', 'Placeholder', '123', 'TODO: way to save pictures')
        } catch (error){
            console.error("Unable save the picture", error)
        }
        navigation.navigate('NewStory', {img: '1', storyId: route.params.storyId})
    }

    if (!permission) {
        return (
            <View />
        )
    }
    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>Permission not granted</Text>
                <View style={styles.row}>
                    <Button style={styles.row} mode="contained" onPress={requestPermission}>
                        Request Permission
                    </Button>
                    <Button style={styles.row} mode="contained" onPress={() => navigation.navigate('NewStory', { img: '-1' })}>
                        Exit
                    </Button>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.center}>
            <CameraView style={{ flex: 1, minWidth: "100%" }} ref={camera} />
            <View style={{ flex: 1 }}>
                {photoName && photoBase64 ? (
                    <>
                        <Image style={{ flex: 1, minWidth: "100%" }} source={{ uri: `data:image/jpg;base64,${photoBase64}` }} />
                    </>
                ) : (
                    <Text>Take a picture!. {JSON.stringify(route.params)}</Text>
                )}
            </View>
            <View style={styles.row}>
                <Button style={styles.margin} mode="contained" onPress={snap}>
                    Take Picture
                </Button>
                <Button style={styles.margin} mode="contained" onPress={savePicture}>
                    Save Picture
                </Button>
                <Button style={styles.margin} mode="contained" onPress={() => navigation.navigate('NewStory', { img: '-1' })}>
                    Exit
                </Button>
            </View>
        </View>
    )

}