import React, { useContext, useState } from 'react';

import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { AgendaContext } from '../../../../base/context/AgendaContext.js';
import { useSelector } from 'react-redux';
import { ButtonItem } from './AgendaButton.js';

const AgendaPanel = ({ currentTime }) => {
    const [full, setFull] = useState(false);

    const { local } = useSelector(
        (state) => state['features/base/participants']);
    console.log({ local });
    const {
        agendaItems,
        agendaDispatch,
        agendaState,
        shareAgenda,
        api
    } = useContext(AgendaContext);


    const changeCurrent = (v) => {
        if (api?.conference?.isModerator()) {
            agendaDispatch({
                type: "change",
                payload: { current: v },
            });
            shareAgenda({ flag: "change", current: v });
        }
    };

    return (
        <TouchableOpacity onPress={() => setFull(prev => !prev)}
                          style={[
                              styles.container, full ? { height: 'auto' } : {
                                  overflow: 'hidden',
                              },
                          ]}>
            <View
                style={[
                    styles.progressItem,
                    { width: `${currentTime?.percent}%` },
                ]}
            ></View>
            <View style={styles.bodyContainer}>
                <View>

                    <Text>{agendaState?.current?.title || 'title'}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text
                    >{`${currentTime?.minutes || 0}:${currentTime?.seconds ||
                    0}`}</Text>

                    <Text>{' / ' + (agendaState?.current?.time || 20) +
                        ' mins'}</Text>
                </View>


            </View>
            <View style={styles.fullMode}>
                <View style={{ marginBottom: 10 }}>
                    <Text>
                        {agendaState?.current?.description ||
                            'description'}
                    </Text>
                </View>

                <View
                    style={{
                        marginTop: 5,
                        fontSize: '12px',
                        fontWeight: 'bold',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <ButtonItem
                        onPress={(e) => {
                            agendaDispatch({ type: 'pause' });
                            shareAgenda({ flag: 'pause' });
                        }}
                    >
                        Pause
                    </ButtonItem>
                    <ButtonItem
                        onPress={(e) => agendaDispatch({ type: 'showlist' })}
                    >
                        {!agendaState.showList ? 'Agenda List' : 'Close List'}
                    </ButtonItem>

                </View>
            </View>
            {agendaState.showList ? (
                    <View style={styles.listContainer}>
                        {agendaItems.map((v, i) => (
                            <TouchableOpacity
                                style={{
                                    flexDirection:'row',
                                    paddingVertical:10,
                                    paddingHorizontal:15,
                                    justifyContent:'space-between',
                                    borderRadius:20,
                                    backgroundColor:
                                        v.id === agendaState.current?.id
                                            ? "#bb7b0588"
                                            : "",
                                }}
                                onPress={() => changeCurrent(v)}
                                key={v.id}
                            >
                                <Text>
                                    {i + 1}: {v.title}
                                </Text>
                                <Text>{v.time}-mins </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )
                : null
            }

        </TouchableOpacity>
    );
};

export default AgendaPanel;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: '#f3f3f3',
        borderColor: '#66666666',
        paddingVertical: 5,
        borderRadius: 20,
        height: 27,
        width: '100%',
        // height: 'auto',
    },
    progressItem: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        borderRadius: 20,
        backgroundColor: '#00807544',
    },
    bodyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    fullMode: {
        padding: 10,
    },
    listContainer: {
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 120,
        borderRadius: 20,
        padding: 10,
    },
});