import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { Card } from 'react-native-elements';

const CardView = ({ title, imageSource, onPress, fontColor }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card containerStyle={styles.cardContainer}>
                <ImageBackground source={imageSource} style={styles.imageBackground}>
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardTitle, {color: fontColor}]}>{title}</Text>
                    </View>
                </ImageBackground>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        overflow: 'hidden',
        padding: 0
    },
    imageBackground: {
        width: '100%',
        aspectRatio: 30 / 9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardContent: {
        padding: 0
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    },
});

export default CardView;