import React, { createContext, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Sound from 'react-native-sound';

const click = new Sound(require('./../../../../sounds/metronome1.wav'), Platform.OS === 'ios' ? null : Sound.MAIN_BUNDLE, error => {
    if (error) {
        console.log('failed to load the sound', error);

        return;
    }
});

export const MetronomeContext = createContext();

const MetronomeProvider = ({ children }) => {
    const [ volume, setVolume ] = useState(1); // початкове значення гучності
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ bpm, setBpm ] = useState(100);

    const timerRef = useRef(null);

    const playClick = () => {
        click.play(success => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
        });
    };

    const handleBpmChange = newBpm => {
        setBpm(newBpm);

        if (isPlaying) {
            clearInterval(timerRef.current);
            timerRef.current = setInterval(playClick, 60 / newBpm * 1000);
        }
    };

    const startStop = () => {
        if (isPlaying) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
        } else {
            timerRef.current = setInterval(playClick, 60 / bpm * 1000);
            setIsPlaying(true);
            playClick();
        }
    };

    const handleVolumeChange = newVolume => {
        setVolume(newVolume);
        click.setVolume(newVolume);
    };

    return (
        <MetronomeContext.Provider
            value = {{
                handleVolumeChange,
                startStop,
                handleBpmChange,
                volume,
                isPlaying,
                bpm
            }}>
            {children}
        </MetronomeContext.Provider>
    );
};

export default MetronomeProvider;
