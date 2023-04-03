import React, { useContext, useEffect, useState, useRef } from 'react';

import { Text, View, StyleSheet } from 'react-native';
import AgendaButton from './AgendaButton.js';
import { AgendaContext } from '../../../../base/context/AgendaContext.js';
import AgendaPanel from './AgendaPanel.js';
import { useSelector } from 'react-redux';

const AgendaPlayer = () => {
    const timer = useRef();
    const [currentTime, setCurTime] = useState();

    const {
        agendaItems,
        agendaDispatch,
        agendaState,
        api
    } = useContext(AgendaContext);

    console.log('agendaItemsagendaItems',{agendaItems});

    function calculateTimeLeft(evt) {
        let difference = agendaState.timing - +new Date();

        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            percent: 0,
        };
        if (difference <= 0 && agendaState.playing) {
            agendaDispatch({ type: "next", payload: { agendaItems } });
            return timeLeft;
        }

        if (difference > 0 && evt !== "reset") {
            let days = Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours = Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes = Math.floor((difference / 1000 / 60) % 60),
                seconds = Math.floor((difference / 1000) % 60);
            timeLeft = {
                days: days > 9 ? days : `0${days}`,
                hours: hours > 9 ? hours : `0${hours}`,
                minutes: minutes > 9 ? minutes : `0${minutes}`,
                seconds: seconds > 9 ? seconds : `0${seconds}`,
                percent:
                    100 -
                    Math.floor(
                        (difference / (1000 * 60) / agendaState.current.time) * 100
                    ),
            };
        }
        return timeLeft;
    }


    useEffect(() => {
        setCurTime(calculateTimeLeft());
        if (agendaState.current && agendaState.playing) {
            timer.current = setInterval(() => {
                setCurTime(calculateTimeLeft());
            }, 1000);
        }
        return () => clearInterval(timer.current);
    }, [agendaState.playing, agendaItems, agendaState.current]);

    return (
        <View style={styles.wrapper}>

            {
                agendaState?.playing ? (
                        (
                            agendaItems.length > 0 && (
                                <AgendaPanel currentTime={currentTime}/>
                            )
                        )

                    ) :
                    (
                        api?.conference?.isModerator() && (
                            <AgendaButton/>
                        )
                    )
            }


        </View>
    );
};

export default AgendaPlayer;

const styles = StyleSheet.create({
    wrapper: {},
});