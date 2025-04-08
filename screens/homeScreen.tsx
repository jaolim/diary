import { Button, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

import { NavigatorParams } from "../resources/customTypes";
import styles from "../resources/styles"

type homeScreenProp = StackNavigationProp<NavigatorParams>;

export default function HomeScreen () {
    const navigation = useNavigation<homeScreenProp>();

    return (
        <View style={styles.center}>
            <Text>HomeScreen</Text>
            <Text>Will be implemented shortly!</Text>
            <Button title="Add Story" onPress={() => navigation.navigate('NewStory')} />
        </View>
    )
}