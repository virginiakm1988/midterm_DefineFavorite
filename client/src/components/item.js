import React, { Component } from 'react';
import x_img from '../images/x.png';
import '../assets/css/main.css';
import { Draggable } from 'react-beautiful-dnd';

import pic1 from '../images/thumbs/01.jpg';
import pic2 from '../images/thumbs/02.jpg';
import pic3 from '../images/thumbs/03.jpg';
import pic4 from '../images/thumbs/04.jpg';
import pic5 from '../images/thumbs/05.jpg';
import pic6 from '../images/thumbs/06.jpg';
import pic7 from '../images/thumbs/07.jpg';
let pics = [pic1, pic2, pic3, pic4, pic5, pic6, pic7]


class Item extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id : this.props.id,
            editName: this.props.name,
            colid: this.props.colid
        };   
    }
    deleteItem = ()=> {
        this.props.handleDelete(this.state.colid, this.state.id);
    }
    handleDoubleClick = ()=> {
        console.log("undefined now")
    }
    onMouseOver = () => {
        if (this.props.des!=''){
        this.setState({
            editName:''
        })
    }
    }
    onMouseLeave = () => {
        this.setState({
            editName:this.props.name
        })
    }
    render() {
        return(
            <Draggable draggableId={this.props.id} index={this.props.index}>
            {provided=>(
            <li className="favorite-app__item" 
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
                <div className="view">
                    <a href={this.props.url} className="a">
                        <img src={pics[this.props.picid]} alt="" />
                    </a>
                    <h3 className="favorite-app__item-name">{this.state.editName}
                        <span className="favorite-app__descript">{this.props.des}</span>
                    </h3>
                    {/* <div className="favorite-app__descript">{this.props.des}</div> */}
                    {/* <label className="favorite-app__item-name" onClick={this.handleDoubleClick}>{this.state.editName}</label> */}
                    <img className="favorite-app__item-x" src={x_img} onClick={this.deleteItem}/>
                    <a className="favorite-app__button_go" href={this.props.url}>Go!</a>
                    
                </div>
            </li>)}
            </Draggable>
        );
    }

}


export default Item;