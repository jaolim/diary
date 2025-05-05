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

export default function NewStory() {
    //context variables
    const db = useSQLiteContext();
    const navigation = useNavigation<navigatorProp>();
    const { user } = useAuth();
    // Story related variables
    const time = dayjs().toISOString();
    const [header, setHeader] = useState("");
    const [body, setBody] = useState("");
    const [isPrivate, setIsPrivate] = useState(false)
    const [buttonMode, setButtonMode] = useState<'outlined' | 'contained'>('outlined')
    const [isDisabled, setIsDisabled] = useState(false);
    //camera and image related variables
    const camera = useRef(null) as any
    const [imageKey, setImageKey] = useState('-1')
    const [imageId, setImageId] = useState('-1')
    const [imageName, setImageName] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [permission, requestPermission] = useCameraPermissions();
    const directory = `${FileSystem.documentDirectory}diary/`
    // Controls if main page via Modal or the CameraView is visible
    const [modalVisible, setModalVisible] = useState(true)

    // Function for toggling public/private button
    const onButtonToggle = () => {
        setButtonMode(buttonMode === 'outlined' ? 'contained' : 'outlined');
        setIsPrivate(isPrivate === false ? true : false);
    }

    // Takes picture
    const snap = async () => {
        if (camera) {
            const photo = await camera.current.takePictureAsync({ base64: true });
            setImageKey('-1');
            setImageName(photo.uri);
            setImageBase64(photo.base64);
            setImageId(`Photo_User_${time}`);
        }
    }

    // Saves Story to local database
    const saveStory = async () => {
        try {
            await db.runAsync('INSERT INTO stories (id, user, time, header, body, image, private) VALUES (?, ?, ?, ?, ?, ?, ?)', time + user, user, time, header, body, imageKey, isPrivate);
        } catch (error) {
            console.error('Could not add story', error);
        }

        setIsDisabled(true);
        navigation.navigate('Home');
    }

    // Saves image from cache to permanent local storage
    const saveImage = async () => {
        if (imageKey != '-1') {
            FileSystem.deleteAsync(directory);
        }
        const path = `${directory}${imageId}.jpg`
        try {
            await FileSystem.copyAsync({ from: imageName, to: path });
            setImageKey(path);
        } catch (error) {
            console.error('Could not save image', error);
        }
    }

    // Checks if a user is active and disables text inputs if not
    const isLogged = () => {
        if (!user) {
            setIsDisabled(true);
        }
    }

    // Calls for a logged user check on page load
    useEffect(() => {
        isLogged();
    }, [])

    // This is an empty view for when camera permission is still loading
    if (!permission) {
        return (
            <View />
        )
    }

    // This is the view for requesting Camera permission
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

    // This view defaults to a Modal with text inputs for a new story that can be dismissed to reveal a camera view for taking a picture to add to that story, also has some conditional renders if no user is signed in
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
                        <Button style={styles.margin} icon="adjust" mode={buttonMode} onPress={onButtonToggle} disabled={isDisabled}>
                            {isPrivate ? (
                                'Private'
                            ) : (
                                'Public'
                            )}
                        </Button>
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
                        <Image style={{ flex: 1, minWidth: "100%" }} source={{ uri: `data:image/jpg;base64,${imageBase64}` }} resizeMode="contain" />
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
                            <Button mode="contained" icon="content-save" onPress={saveStory}>
                                Add Story
                            </Button>
                        ) : (
                            null
                        )}
                        {user ? (
                            <Button mode="contained" icon="camera" onPress={() => {
                                setModalVisible(false);
                            }}>
                                Take Picture
                            </Button>
                        ) : (
                            <Button mode="contained" icon="login" onPress={() => {
                                navigation.navigate('Signin');
                            }}>
                                Login
                            </Button>
                        )}
                        <Button mode="contained" icon="home" onPress={() => {
                            if (imageKey != '-1') {
                                FileSystem.deleteAsync(imageKey);
                            }
                            navigation.navigate('Home');
                        }}>
                            Exit
                        </Button>
                    </View>
                </View>
            </Modal>

            <CameraView style={{
                flex: 1, height: 1, width: 230
            }} ref={camera}
                pictureSize='720x480'
            />
            <View style={{ flex: 1 }}>
                {imageName && imageBase64 ? (
                    <>
                        <Image style={{ flex: 1, minWidth: "100%" }} source={{ uri: `data:image/jpg;base64,${imageBase64}` }} resizeMode="contain" />
                    </>
                ) : (
                    <Text>Take a picture!.</Text>
                )}
            </View>
            <View style={styles.row}>
                <Button style={styles.margin} icon="camera" mode="contained" onPress={snap}>
                    Take Picture
                </Button>
                <Button style={styles.margin} mode="contained" icon="close" onPress={() =>
                    setModalVisible(true)
                }>
                    Close Camera
                </Button>
            </View>
        </View>
    )
}