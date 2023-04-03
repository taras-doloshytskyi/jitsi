import React, { useContext } from 'react';

import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { AgendaContext } from '../../../../base/context/AgendaContext.js';
import { useSelector } from 'react-redux';

export const ButtonItem = ({ onPress, children }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>
                    {children}
                </Text>
            </View>
        </TouchableOpacity>
    );

};

const AgendaButton = () => {

    const {
        agendaItems,
        agendaDispatch,
        agendaState,
        shareAgenda
    } = useContext(AgendaContext);

    const {local} = useSelector((state)=>state['features/base/participants'])

    return (
        <>
            { (
                <View style={styles.container}>
                    {agendaItems?.length > 0 &&
                        <ButtonItem
                            onPress={(e) => {

                                const type = agendaState?.status === 'pause'
                                        ? 'resume'
                                        : 'play';
                                shareAgenda({ flag: type });
                                agendaDispatch({ type });
                            }}>
                            {agendaState?.status === 'pause' ? 'Resume' : 'Start'}{' '}
                            Agenda
                        </ButtonItem>

                    }

                    {/*// ) : (*/}
                    {/*//     <ButtonItem*/}
                    {/*//         // onPress={()=>(e) => setopen(true)}*/}
                    {/*//     >*/}
                    {/*//         Create Agenda*/}
                    {/*//         {' '+local?.role}*/}
                    {/*//     </ButtonItem>*/}
                    {/*// )}*/}
                </View>
            )}
        </>
    );
};

export default AgendaButton;
const styles = StyleSheet.create({
    container: {
    },
    button: {
        alignSelf: 'flex-start',
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor: '#f3f3f3',
        paddingHorizontal: 8,
        paddingVertical: 5,
        fontSize: 12,
        marginLeft: 5,
    },
    buttonText: {
        color: 'black',
    },
});