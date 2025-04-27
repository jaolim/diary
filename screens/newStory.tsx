import { useEffect, useRef, useState } from "react";
import { Image, Modal, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { StackNavigationProp } from '@react-navigation/stack';
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { Story, NavigatorParams } from "../resources/customTypes";
import styles from "../resources/styles"
import HomeScreen from "./homeScreen";

type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function NewStory({ route }: any) {
    const db = useSQLiteContext();
    const navigation = useNavigation<navigatorProp>();
    const time = dayjs().toISOString();
    const [header, setHeader] = useState("");
    const [body, setBody] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [imageName, setImageName] = useState();
    const [imageBase64, setImageBase64] = useState();
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(true)
    const camera = useRef(null)

    const snap = async () => {
        if (camera) {
            const photo = await camera.current.takePictureAsync({ base64: true });
            setImageName(photo.uri);
            setImageBase64(photo.base64);
        }
    }

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
                    <Button style={styles.row} mode="contained" onPress={() => setModalVisible(true)}>
                        Exit
                    </Button>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.center}>
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
            >
                <View style={styles.center}>
                    <TextInput
                        style={styles.inputTitle}
                        label="Title"
                        disabled={isDisabled}
                        value={header}
                        onChangeText={text => setHeader(text)}
                    />
                    <TextInput
                        style={styles.inputBody}
                        label="Story"
                        disabled={isDisabled}
                        value={body}
                        onChangeText={text => setBody(text)}
                    />
                    <Image style={{ flex: 1, minWidth: "100%" }} source={{ uri: `data:image/jpg;base64,${imageBase64}` }} />
                    <View style={styles.row}>
                        <Button mode="contained" onPress={saveStory}>
                            Add Story
                        </Button>
                        <Button mode="contained" onPress={() => {
                            setModalVisible(false)
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
            </Modal>

            <CameraView style={{ flex: 1, minWidth: "100%" }} ref={camera} />
            <View style={{ flex: 1 }}>
                {imageName && imageBase64 ? (
                    <>
                        <Image style={{ flex: 1, minWidth: "100%" }} source={{ uri: `data:image/jpg;base64,${imageBase64}` }} />
                    </>
                ) : (
                    <Text>Take a picture!. {JSON.stringify(route.params)}</Text>
                )}
            </View>
            <View style={styles.row}>
                <Button style={styles.margin} mode="contained" onPress={snap}>
                    Take Picture
                </Button>
                <Button style={styles.margin} mode="contained" onPress={() => setModalVisible(true)}>
                    Close Camera
                </Button>
            </View>
        </View>
    )
}
