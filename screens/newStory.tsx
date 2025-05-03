import { useEffect, useRef, useState } from "react";
import { Image, Modal, View } from "react-native";
import { Button, Text, TextInput, ToggleButton } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { StackNavigationProp } from '@react-navigation/stack';
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import * as FileSystem from 'expo-file-system';

import { NavigatorParams } from "../resources/customTypes";
import styles from "../resources/styles"
import { useAuth } from "../resources/useAuth";

type navigatorProp = StackNavigationProp<NavigatorParams>;

export default function NewStory({ route }: any) {
    const time = dayjs().toISOString();
    const db = useSQLiteContext();
    const navigation = useNavigation<navigatorProp>();
    const [header, setHeader] = useState("");
    const [body, setBody] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [imageKey, setImageKey] = useState('-1')
    const [imageId, setImageId] = useState('-1')
    const [imageName, setImageName] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(true)
    const camera = useRef(null) as any
    const directory = `${FileSystem.documentDirectory}diary/`
    const { user } = useAuth();
    const [status, setStatus] = useState<'unchecked' | 'checked'>('unchecked');
    const [isPrivate, setIsPrivate] = useState(false)

    const onButtonToggle = () => {
        setStatus(status === 'unchecked' ? 'checked' : 'unchecked');
        setIsPrivate(isPrivate === false ? true : false)
    }

    const snap = async () => {
        if (camera) {
            const photo = await camera.current.takePictureAsync({ base64: true });
            setImageName(photo.uri);
            setImageBase64(photo.base64);
            setImageId(`Photo_User_${time}`)
        }
    }

    const saveStory = async () => {
        try {
            await db.runAsync('INSERT INTO stories (id, user, time, header, body, image, private) VALUES (?, ?, ?, ?, ?, ?, ?)', time + user, user, time, header, body, imageKey, isPrivate)
        } catch (error) {
            console.error('Could not add story', error);
        }

        setIsDisabled(true)
        navigation.navigate('Home')
    }

    const saveImage = async () => {
        if (imageKey != '-1') {
            FileSystem.deleteAsync(directory)
        }
        const path = `${directory}${imageId}.jpg`
        try {
            await FileSystem.copyAsync({ from: imageName, to: path })
            setImageKey(path)
        } catch (error) {
            console.error('Could not save image', error)
        }
    }

    const isLogged = () => {
        if (!user) {
            setIsDisabled(true);
        }
    }

    useEffect(() => {
        isLogged();
    }, [])

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
                    {user ? (
                        <Text style={styles.user} variant="titleLarge">User: {user}</Text>
                    ) : (
                        <Text style={styles.user} variant="titleLarge">User: Guest</Text>
                    )}
                    <View style={styles.row}>
                        <TextInput
                            style={styles.inputTitle}
                            label="Title"
                            disabled={isDisabled}
                            value={header}
                            onChangeText={text => setHeader(text)}
                        />
                        <ToggleButton
                            icon='adjust'
                            value='private'
                            status={status}
                            onPress={onButtonToggle}
                        />
                        <Text>
                            {status == 'unchecked' ? (
                                'Public'
                            ) : (
                                'Private'
                            )}
                        </Text>
                    </View>
                    <TextInput
                        style={styles.inputBody}
                        multiline={true}
                        label="Story"
                        disabled={isDisabled}
                        value={body}
                        onChangeText={text => setBody(text)}
                    />
                    {user ? (
                        <Image style={{ flex: 1, minWidth: "100%" }} source={{ uri: `data:image/jpg;base64,${imageBase64}` }} resizeMode="contain"/>
                    ) : (
                        <Text>Please log in before submitting stories</Text>
                    )}
                    <View style={styles.row}>
                        {imageName != '' && imageKey == '-1' ? (
                            <Button mode="contained" onPress={() => {
                                saveImage();
                            }}>
                                Accept picture
                            </Button>

                        ) : (
                            null
                        )}
                    </View>
                    <View style={styles.row}>
                        {user ? (
                            <Button mode="contained" onPress={saveStory}>
                                Add Story
                            </Button>
                        ) : (
                            null
                        )}
                        {user ? (
                            <Button mode="contained" onPress={() => {
                                setModalVisible(false)
                            }}>
                                Take Picture
                            </Button>
                        ) : (
                            <Button mode="contained" onPress={() => {
                                navigation.navigate('Signin')
                            }}>
                                Login
                            </Button>
                        )}
                        <Button mode="contained" onPress={() => {
                            if (imageKey != '-1') {
                                FileSystem.deleteAsync(imageKey)
                            }
                            navigation.navigate('Home')
                        }}>
                            Exit
                        </Button>
                    </View>
                </View>
            </Modal>

            <CameraView style={{ flex: 1, minWidth: "100%" }} ref={camera} />
            <View style={{ flex: 1 }}>
                {imageName && imageBase64 ? (
                    <>
                        <Image style={{ flex: 1, minWidth: "100%" }} source={{ uri: `data:image/jpg;base64,${imageBase64}` }} resizeMode="contain"/>
                    </>
                ) : (
                    <Text>Take a picture!.</Text>
                )}
            </View>
            <View style={styles.row}>
                <Button style={styles.margin} mode="contained" onPress={snap}>
                    Take Picture
                </Button>
                <Button style={styles.margin} mode="contained" onPress={() =>
                    setModalVisible(true)
                }>
                    Close Camera
                </Button>
            </View>
        </View>
    )
}