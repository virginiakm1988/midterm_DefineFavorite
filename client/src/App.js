import React, { Component } from 'react';
import './assets/css/main.css';
import Column from './container/Main'
import { DragDropContext } from 'react-beautiful-dnd';
import initial_state from './Initial'
import { fail } from 'assert';

let id_global = 0;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function IndexofProperty(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i] === value) {
            return i;
        }
    }
    return -1;
}
let col_count = 0;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = initial_state;
	}
	componentDidMount() {
		//this.socket_refresh();

		this.state.socket.on("update", data=>{
			console.log(data);
			if (data.col_count) {col_count = data.col_count}
			let col_data = data.col_data;
			let items = data.mark_data;
			let marks = {};
			if (items!=null) { 
				if (items.length!=0) 
					{items.map(item=>{ marks[item.id] = item});
				id_global = items.length;}
			}
			if (col_data.length!=0) {
				let cols = {...this.state.columns};
				const curr_col = cols;
				col_data.map(col=>{ curr_col[col.id].marks = Array.from(col.marks)});
				console.log("updata", curr_col);
				if(items==null || items.length==0){
					this.setState({
						columns: curr_col
					})
				}
				else{
					this.setState({
						marks: marks,
						columns: curr_col
					})
				}
			}	
		})

		this.state.socket.on("init", data=>{
			console.log(data);
			if (data.col_count) {col_count = data.col_count}
			id_global = data.id_global;
			console.log('init',id_global);
			let col_data = data.col_data;
			let items = data.mark_data;
			let marks = {};
			if (items!=null) { 
				if (items.length!=0) 
				{items.map(item=>{ marks[item.id] = item});
			}
		}
			if (col_data.length!=0) {
				let cols = {...this.state.columns};
				const curr_col = cols;
				col_data.map(col=>{ curr_col[col.id].marks = Array.from(col.marks)});
				if(items.length==0){
					this.setState({
						columns: curr_col
					})
				}
				else{
					this.setState({
						marks: marks,
						columns: curr_col
					})
				}
			}	
		})


		// if (!this.state.intervalIsSet) {
		// 	  let interval = setInterval(this.socket_refresh,2000);
		// 	  this.setState({ intervalIsSet: interval });
		// }
}
	componentWillUnmount() {
		this.socket_refresh();
		if (this.state.intervalIsSet) {
		  clearInterval(this.state.intervalIsSet);
		  this.setState({ intervalIsSet: null });
		}
		console.log(this.state);
	}
	socket_refresh = () => {
		this.state.socket.emit('refresh', {col_count:col_count});
		this.state.socket.on("refresh", data=>{
			console.log(data);
			col_count = data.col_count;
			let col_data = data.col_data;
			let items = data.mark_data;
			let marks = {};
			if (items) {items.map(item=>{ marks[item.id] = item});
			id_global = items.length;}
			if (col_data) {
				let cols = {...this.state.columns};
				const curr_col = cols;
				col_data.map(col=>{ curr_col[col.id].marks = Array.from(col.marks)});
				if(!items){
					this.setState({
						columns: curr_col
					})
				}
				else{
					this.setState({
						marks: marks,
						columns: curr_col
					})
				}
			}
			
		})
	}

	handleSubmit = (event) => { 
			let web_name = document.getElementsByName('name')[0].value;
			let web_url = document.getElementsByName('url')[0].value;
			let web_des = document.getElementsByName('des')[0].value;
		// if (event.key === 'Enter' && event.shiftKey === false){
			if (web_name!=='' && web_url!==''){
				let id_in_str = 'mark'+id_global.toString();
				let url = '';
				if (web_url.search('http')==-1){
					url = 'http://'+web_url;
				}
				else{
					url = web_url;
				}
				let item = {
					picid: getRandomInt(7),
					id: id_in_str,
					web_name: web_name,
					url: url,
					des: web_des
				}
				// set Stete
				for (var i=0; i<3; i++){
					if (this.state.columns[this.state.columnOrder[i]].marks.length===0){
						col_count = i;
						break;
					}
				}
				let colid = this.state.columnOrder[col_count%3];
				col_count += 1

				let cols = {...this.state.columns};
				const curr_col = cols;
				curr_col[colid].marks.push(id_in_str);
				let marks = {...this.state.marks};
				const curr_mark = marks;
				curr_mark[id_in_str] = item;

				this.setState({ 
					marks: curr_mark,
					columns: curr_col
					// url: '',
					// des: '',
					// name: ''
				})

				this.state.socket.emit("newitem", {item: item, colid: colid, id_global:id_global+1});
				//blank
				document.getElementsByName('name')[0].value = '';
				document.getElementsByName('url')[0].value = '';
				document.getElementsByName('des')[0].value = '';

				id_global += 1;
			}
		//	event.preventDefault();
		//}
	}
	handleKey = (event) => { 
		if (event.key == '`'){
			console.log("clear database")
			this.state.socket.emit('clear');
		}
		if (event.key === 'Enter' && event.shiftKey === false){
			let id_in_str = 'mark'+id_global.toString();
			let web_name = document.getElementsByName('name')[0].value;
			let web_url = document.getElementsByName('url')[0].value;
			let web_des = document.getElementsByName('des')[0].value;
			if (web_name!=='' && web_url!==''){
				let url = '';
				if (web_url.search('http')==-1){
					url = 'http://'+web_url;
				}
				else{
					url = web_url;
				}
				let item = {
					picid: getRandomInt(7),
					id: id_in_str,
					web_name: web_name,
					url: url,
					des: web_des
				}
				//set state
				for (var i=0; i<3; i++){
					if (this.state.columns[this.state.columnOrder[i]].marks.length===0){
						col_count = i;
						break;
					}
				}
				let colid = this.state.columnOrder[col_count%3];
				col_count += 1
				let cols = {...this.state.columns};
				const curr_col = cols;
				curr_col[colid].marks.push(id_in_str);

				let marks = {...this.state.marks};
				const curr_mark = marks;
				curr_mark[id_in_str] = item;
				
				this.setState({ 
					marks: curr_mark,
					columns: curr_col
					// url: '',
					// des: '',
					// name: ''
				})
				this.state.socket.emit("newitem", {item: item, colid: colid, id_global:id_global+1});
				//this.state.socket.emit("update_col", {'colid': colid, 'markid':id_in_str});
				//blank
				document.getElementsByName('name')[0].value = '';
				document.getElementsByName('url')[0].value = '';
				document.getElementsByName('des')[0].value = '';

				id_global += 1;
			}
			event.preventDefault();
			document.getElementsByName('name')[0].focus();
		}
	}
	handleDelete = (colid, markid) => {
		console.log("In App!"+colid+" "+markid);
		let mark_idx = IndexofProperty(this.state.columns[colid].marks, 'id', markid);
		console.log(mark_idx);
		//let arr = [...this.state.columns[colid]];
		let cols = {...this.state.columns};
		const curr_col = cols;
		let marks = {...this.state.marks};
		const curr_mark = marks;

		if (mark_idx!=-1){
			delete curr_mark[markid];
			curr_col[colid].marks.splice(mark_idx, 1);
			if (curr_col[colid].marks.length === 0 && colid!=='droppable-3'){
				console.log("move");
				let nextline = '';
				let lastline = '';
				if (colid === 'droppable-1'){
					nextline = 'droppable-2';
					lastline = 'droppable-3';

				}
				if (colid === 'droppable-2') {
					nextline = 'droppable-3';
				}
				if (curr_col[nextline].marks.length!==0){
					let move = curr_col[nextline].marks[0];
					curr_col[nextline].marks.splice(0, 1);
					curr_col[colid].marks.push(move);
					if (nextline === 'droppable-2' && curr_col[nextline].marks.length === 0 &&
					curr_col[lastline].marks.length !== 0){
						let move = curr_col[lastline].marks[0];
						curr_col[lastline].marks.splice(0, 1);
						curr_col[nextline].marks.push(move);
						if (curr_col[lastline].marks.length === 0){
							col_count = 2;
						}
						else{
							col_count = 0;
						}
					}
				}
				else {
					col_count = (nextline==='droppable-2')?0:1;
				}
			}
			for (var i=0; i<3; i++){
				if (this.state.columns[this.state.columnOrder[i]].marks.length===0){
					col_count = i;
					break;
				}
			}
			this.state.socket.emit('delete', {markid: markid, col:curr_col, col_count:col_count});
			this.setState({
				columns: curr_col,
				marks: curr_mark
			});
		}
		
	}
	onDragEnd = (result)=> {
		const { destination, source, draggableId } = result;
		if (!destination) {
            console.log("destination empty");
            return
		}
		if (destination.droppableId === source.droppableId &&
			destination.index === source.index){
				return;
			}
		
		const start = this.state.columns[source.droppableId];
		const finish = this.state.columns[destination.droppableId];
		
		if (start === finish) {
			const newTaskIds = Array.from(start.marks);
			newTaskIds.splice(source.index, 1);
			newTaskIds.splice(destination.index, 0, draggableId);
			
			const newColumn = {
				...start,
				marks: newTaskIds
			};
			let cols = {...this.state.columns};
			const curr_col = cols;
			curr_col[newColumn.id]= newColumn;
			this.state.socket.emit('ondragendsame', curr_col[newColumn.id]);
			this.setState({
				columns:curr_col
			})
			return;
		}

		const startTaskIds = Array.from(start.marks);
		startTaskIds.splice(source.index, 1);
		const newStart = {
			...start,
			marks: startTaskIds,
		};

		const finishTaskIds = Array.from(finish.marks);
		finishTaskIds.splice(destination.index, 0,draggableId);
		const newFinish = {
			...finish,
			marks: finishTaskIds,
		};
		let cols = {...this.state.columns};
		const curr_col = cols;
		curr_col[newStart.id] = newStart;
		curr_col[newFinish.id] = newFinish;
		this.state.socket.emit('ondragenddiff', [curr_col[newStart.id], curr_col[newFinish.id]])
		this.setState({
			columns:curr_col
		})

	}
  

	render() {
		console.log(this.state);

		let renderCols=this.state.columnOrder.map(colId => {
			// console.log(this.state.columns[colId].marks.splice());
			const column = this.state.columns[colId];
			const marks = column.marks.map(markId=>this.state.marks[markId]);
			return (<Column key={column.id} column={column} marks={marks} handleDelete={this.handleDelete}/>);
		})

		return (
		// <div style={{ textAlign: "center" }}>
		// 	<button onClick={() => this.send() }>Change Color</button>

		// 	<button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
		// 	<button id="red" onClick={() => this.setColor('red')}>Red</button>
		<DragDropContext onDragEnd={this.onDragEnd}>
			<div id="wrapper">
				<head>
					<title>Define My Favorite</title>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="stylesheet" href="assets/css/main.css" />
				</head>
				<header id="header">
					<h1 className="favorite-app__title">DEFINE FAVORITE</h1>
					<h1>Open too many pages in your browser? Define your own <strong>Bookmark</strong> here!</h1>
				</header>
				<section className="favorite-app__main">
					<input className="favorite-app__input" name="name" placeholder="Name"  onKeyPress={this.handleKey}></input>
					<input className="favorite-app__input" name="url" placeholder="URL"  onKeyPress={this.handleKey}></input>
					<textarea className="favorite-app__textarea" name="des" placeholder="(Optional)Wrinting some description here..."  onKeyPress={this.handleKey}></textarea>
					<input type='button' value='Submit!' className="favorite-app__button" onClick={this.handleSubmit} ></input>
				</section>
				{/* <DragDropContext onDragEnd={this.onDragEnd}> */}
					<section id="main">
					<section className="thumbnails">
						{renderCols}
						{/* <h3>{this.state.columns['droppable-1'].marks[0]}</h3> */}
					</section>
					</section>
				{/* </DragDropContext> */}
				<footer id="footer">
						<p>&copy; Untitled. All rights reserved. Design: <a href="#">Lun</a>.</p>
				</footer>
			</div>
			</DragDropContext>
		);
	}
	}

export default App;

