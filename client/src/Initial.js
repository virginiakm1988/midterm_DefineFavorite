import socketIOClient from 'socket.io-client'

const initialData = {
    marks: {
    },
    columns: {
        "droppable-1":{
            id: "droppable-1",
            marks:[
                // 'task1'
            ]
        },
        "droppable-2":{
            id: "droppable-2",
            marks:[]
        },
        "droppable-3":{
            id: "droppable-3",
            marks:[]
        }
    },
    columnOrder: ["droppable-1","droppable-2", "droppable-3"],
    socket : socketIOClient('localhost:9000'),
    intervalIsSet:null
};

export default initialData;