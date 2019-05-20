import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'
import '../assets/css/main.css';
import Bookmark from '../components/item.js'
import { Droppable } from 'react-beautiful-dnd';


class Column extends Component {
    handleDelete = (colid, id) => {
        this.props.handleDelete(colid, id);
    }
    render(){
        let MarkItems = null;
        if (this.props.marks.length!=0) {
            MarkItems = this.props.marks.map((item, index) => <Bookmark name={item.web_name} 
            url={item.url}  id={item.id} picid={item.picid} key={item.id} des={item.des} 
            handleDelete={this.handleDelete} index={index} colid={this.props.column.id}/>);
        }
        return (
			<Droppable droppableId={this.props.column.id}>
                {(provided)=>(
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {MarkItems}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    }
}
export default Column;