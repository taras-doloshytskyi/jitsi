import Slider from '@react-native-community/slider';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MetronomeContext } from '../../../../base/context/MetronomeContext';
import JitsiScreen from '../../../../base/modal/components/JitsiScreen';

// import SpeakerStatsList from "../../../../speaker-stats/components/native/SpeakerStatsList";
// import SpeakerStatsSearch from "../../../../speaker-stats/components/native/SpeakerStatsSearch";
import BaseTheme from '../../../../base/ui/components/BaseTheme.native';

/**
 * Component that renders the list of speaker stats.
 *
 * @returns {React$Element<any>}
 */
const Metronome = () => {
    const { isPlaying, bpm, handleBpmChange, volume, handleVolumeChange, startStop }
        = useContext(MetronomeContext);

    return (
        <JitsiScreen
            style = { styles.screen }>
            <View style = { styles.container }>
                <View>

                    <Text style = { styles.label }>BPM: {bpm}</Text>
                    <Slider
                        maximumValue = { 240 }
                        minimumValue = { 60 }
                        onValueChange = { handleBpmChange }
                        step = { 1 }
                        style = { styles.slider }
                        value = { bpm } />
                </View>
                <View>
                    <Text style = { styles.label }>Volume: {volume.toFixed(2)}</Text>
                    <Slider
                        maximumValue = { 1 }
                        minimumValue = { 0 }
                        onValueChange = { handleVolumeChange }
                        step = { 0.01 }
                        style = { styles.slider }
                        value = { volume } />
                </View>
                <TouchableOpacity
                    onPress = { startStop }
                    style = { styles.button }>
                    <Text style = { styles.buttonText }>{isPlaying ? 'Stop' : 'Start'}</Text>
                </TouchableOpacity>
            </View>
        </JitsiScreen>
    );
};

const styles = StyleSheet.create({
    screen: {
        flexDirection: 'column',
        flex: 1,
        height: 'auto',
        paddingHorizontal: BaseTheme.spacing[3],
        backgroundColor: BaseTheme.palette.ui01
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
        textAlign: 'center'
    },
    slider: {
        width: 200,
        marginBottom: 20
    },
    button: {
        backgroundColor: '#008075',
        padding: 10,
        borderRadius: 5,
        marginTop: 20
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default Metronome;
