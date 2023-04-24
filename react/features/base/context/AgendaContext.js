import React, { createContext, useEffect, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import axios from 'axios';
import { useSelector } from 'react-redux';


const apiUrl = "https://api.trivoh.com";

export const AgendaContext = createContext();

const initialState = {
    showList: true,
    playing: false,
    timing: 0,
    keep: 0,
    current: null,
    test: null,
    status: "default",
};

function reducer(draft, { type, payload }) {
    let minInSec;
    draft.status = type;
    switch (type) {
        case "play":
            if (!draft.current) return;
            minInSec = 1000 * 60 * draft.current?.time;
            draft.timing = +new Date() + minInSec;
            draft.playing = true;
            return;
        case "pause":
            draft.keep = draft.timing - Date.now();
            draft.playing = false;
            draft.showList = false;
            return;
        case "resume":
            draft.timing = +new Date() + draft.keep;
            draft.playing = true;
            return;
        case "next":
            let agenda = payload.agendaItems;
            let oldIndex = agenda.findIndex((v) => v.id === draft.current?.id);
            if (oldIndex > -1) {
                let newCurr = agenda[oldIndex + 1];
                if (newCurr) {
                    let minInSec = 1000 * 60 * newCurr.time;
                    draft.timing = +new Date() + minInSec;
                    draft.playing = true;
                    draft.current = newCurr;
                } else {
                    draft.playing = false;
                    draft.current = agenda[0];
                }
            }
            return;
        case "change":
            minInSec = 1000 * 60 * payload.current.time;
            draft.timing = +new Date() + minInSec;
            draft.playing = true;
            draft.current = payload.current;
            return;
        case "ag-change":
            minInSec = 1000 * 60 * payload.current.time;
            draft.timing = +new Date() + minInSec;
            draft.playing = false;
            draft.current = payload.current;
            return;
        case "add-current":
            draft.current = payload.current;
            return;
        case "showlist":
            draft.showList = !draft.showList;
            return;
        case "just-joined":
            draft.timing = payload.timing;
            draft.status = payload.status;
            draft.playing = payload.playing;
            return;
        case "reset":
            return initialState;
        default:
            return initialState;
    }
}


const AgendaProvider = ({ children }) => {

    const [agendaItems, setAgendaItems] = useState([]);
    const [totaltime, setTotalTime] = useState(0);
    const [state, dispatch] = useImmerReducer(reducer, initialState);

    const api = useSelector((state) => state["features/base/conference"]);

    const getAgendasFromServer = async () => {
        try {
            let res = await axios.get(
                `${apiUrl}/api/agenda/meeting/${api.room}`
            );
            if (res.data) {
                const newAgenda = []; //
                const data = res.data.data || [];
                data.forEach((v) => {
                    let dt = {
                        id: v.id,
                        title: v.title,
                        time: ~~v.duration,
                        description: v.details,
                        notes: v.notes,
                    };
                    newAgenda.push(dt);
                });
                setAgendaItems(newAgenda);
                let time = newAgenda.reduce((a, b) => a + b.time, 0);
                setTotalTime(time);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const agendaMonitor = (v) => {
        let data = JSON.parse(v.value);
        if (data.agenda) {
            setAgendaItems(data.agenda);
        }
        if (data.current) {
            dispatch({
                type: "add-current",
                payload: { current: data.current },
            });
        }
        if (data.flag) {
            const flag = data.flag;
            switch (flag) {
                case "change":
                    dispatch({ type: "pause" });
                    dispatch({
                        type: "change",
                        payload: { current: data.current },
                    });
                    break;
                case "next":
                    dispatch({ type: "next", payload: { agenda:agendaItems } });
                    break;
                case "just-joined":
                    if (state.status !== "default") return;
                    dispatch({
                        type: "add-current",
                        payload: { current: data.current },
                    });
                    dispatch({ type: flag, payload: data });
                    break;
                default:
                    dispatch({ type: flag });
                    break;
            }
        }
    };

    function shareAgenda(dt) {
        if (api?.conference?.isModerator())
            api.conference.sendCommandOnce("agenda-monitor", {
                value: JSON.stringify(dt),
            });
    }

    useEffect(() => {
        if (api.conference) {
            api.conference.addCommandListener("agenda-monitor", agendaMonitor);
            (async () => {
                console.log("is a moderator", api.conference.isModerator());
                if (agendaItems.length > 0 && !api?.conference?.isModerator())
                    return;
                await getAgendasFromServer();
            })();
        }
        return () => {
            if (api.conference) {
                api.conference.removeCommandListener(
                    "agenda-monitor",
                    agendaMonitor
                );
            }
        };
    }, [api]);

    function updateNewUser(id) {
        shareAgenda({
            agenda:agendaItems,
            timing: state.timing,
            playing: state.playing,
            current: state.current,
            status: state.status,
            flag: "just-joined",
        });
    }

    useEffect(() => {
        if (!state.current && agendaItems[0]) {
            dispatch({
                type: "add-current",
                payload: { current: agendaItems[0] },
            });
        }
        if (api?.conference && api?.conference?.isModerator()) {
            shareAgenda({ agendaItems });
        }
    }, [agendaItems]);

    useEffect(() => {
        if (api?.conference && api?.conference?.isModerator()) {
            const room = api.conference;
            room.on('conference.userJoined', updateNewUser);
        }
        return () => {
            if (api?.conference) {
                api.conference.off(
                    'conference.userJoined',
                    updateNewUser
                );
            }
        };
    }, [agendaItems, state.playing, state.current]);

    return (
        <AgendaContext.Provider
            value={{
                agendaItems,
                setAgendaItems,
                agendaDispatch: dispatch,
                agendaState: state,
                api,
                shareAgenda
            }}
        >
            {children}
        </AgendaContext.Provider>
    );
}

export default AgendaProvider;