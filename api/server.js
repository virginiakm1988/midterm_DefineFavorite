var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const http = require('http').Server(app);
//const port = 9000

var app = express();
const router = express.Router();

var Item = require('./models/item');
var Cols = require('./models/column')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Routing
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
// // app.use('/users', usersRouter);
// app.use("/getItems", getItemsRouter);
// app.use("/getCols", getColsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// Socket.io serverSocket
// const serverSocket = require('socket.io')(http)
var server =require('http').createServer(app);
var serverSocket = require('socket.io')(server);
const port = 9000;
server.listen(port, () => console.log(`Listening on port ${port}`))
// Start server listening process.
// http.listen(port, () => {
//     console.log(`Server listening on port ${port}.`)
// })

// Connect to mongo
mongoose.connect('mongodb+srv://shiba:webshiba@cluster0-tg1a9.gcp.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
})
db = mongoose.connection
db.on('error', error => {
  console.log("QQQQQQQQQQQ")
  console.log(error)
})

let col_count = 0;
let id_global = 0;

router.get("/getItems", (req, res, next) => {
  console.log("getitem");
  Item.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});
router.get('/delete',(req, res, next)=>{
  col_count = 0;
      id_global = 0;
  Item.deleteMany({}, () => {
      // Emit cleared
    console.log("clear database")
  })
  Cols.deleteMany({}, () => {
    // Emit cleared
    console.log("clear database")
  })
})
router.get("/getCols", (req, res) => {
  Cols.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// error handler
db.once('open', () => {
  console.log('MongoDB connected!');

  serverSocket.on('connection', socket => {
    console.log('New client connected')
    
    const sendStatus = s => {
      socket.emit('status', s)
    }

    // first time
    Cols.find((err, col_data)=>{
      if (err) console.error(err);
      // col_data=data
      Item.find((err, mark_data)=>{
        if (err) console.error(err);
        // mark_data=data
        console.log('id_global in new init', id_global);      
      socket.emit('init', {col_data:col_data, mark_data:mark_data, col_count:col_count, id_global:id_global});
      })
    })
    


    // serverSocket.emit('init', {col_data:col_data, mark_data:mark_data});
    socket.on('refresh', (col_count)=>{
      Cols.find((err, col_data)=>{
        if (err) console.error(err);
        // col_data=data
        Item.find((err, mark_data)=>{
          if (err) console.error(err);
          // mark_data=data
        serverSocket.emit('refresh', {col_data:col_data, mark_data:mark_data, col_count:col_count, id_global:id_global});
        })
      })
      
      
    })
    // just like on the client side, we have a socket.on method that takes a callback function
    socket.on('newitem', (obj) => {
      console.log('id_global in new item', id_global);
      // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
      // we make use of the socket.emit method again with the argument given to use from the callback function above
      col_count+=1;
      id_global = obj.id_global;
      let item = obj.item;
      let colid = obj.colid;
      console.log('get new item: ', item)
      console.log('col id ', colid);
      let picid = item.picid;
			let id = item.id;
			let web_name = item.web_name;
			let url = item.url;
      let des = item.des;
      // save item
      const newitem = new Item({ picid, id, web_name, url, des});
      newitem.save(err => {
        if (err) console.error(err)

        // Saved!
        sendStatus({
            message: 'Item sent',
            clear: true
        })
      })

      // save col
      Cols.findOne({id:colid},function(err,obj) {
        if (err) { console.log(err) }
        if (obj){
          console.log("SEVRER: push in to exist col");
          Cols.update({id:colid}, { "$push": { marks : id } })
          .then(
            Cols.find((err, col_data)=>{
              if (err) console.error(err);
              // col_data=data
              Item.find((err, mark_data)=>{
                if (err) console.error(err);
                // mark_data=data
                console.log("length", mark_data.length);
              //socket.emit('update', {col_data:col_data, mark_data:mark_data, col_count:col_count});
              })
            })
          )
        } 
        else{
          console.log("SERVER: new col")
          // let newarr = [markid];
          const newcol = new Cols();
          newcol['id'] = colid;
          newcol.marks.push(id);
          console.log(newcol);
          
          newcol.save().then(
            Cols.find((err, col_data)=>{
              if (err) console.error(err);
              // col_data=data
              Item.find((err, mark_data)=>{
                if (err) console.error(err);
                // mark_data=data
                console.log("length", mark_data.length);
              //socket.emit('update', {col_data:col_data, mark_data:mark_data, col_count:col_count});
              })
            })
          )
        }

        
      })
    })
    socket.on('delete', (data) => {
      col_count = data.col_count;
      console.log("delete!")
      let markid = data.markid;
      let updated_col = data.col;
      let columnOrder = ["droppable-1","droppable-2", "droppable-3"]

      Item.findOneAndDelete({id:markid},function(err,obj) {
        if(err) console.error(err);
        else console.log(obj);
      })
      .then(
        columnOrder.map(colid=>{
          Cols.findOneAndUpdate({id:colid}, {marks: updated_col[colid].marks} ,function(err,obj){
            if (err) console.error(err);
            else{
              console.log(colid,obj);
            }
          })
        })
      )
      .then(
        Cols.find((err, col_data)=>{
          if (err) console.error(err);
          // col_data=data
          Item.find((err, mark_data)=>{
            if (err) console.error(err);
            // mark_data=data
          //socket.emit('update', {col_data:col_data, mark_data:mark_data, col_count:col_count});
          })
        })
      )
      .catch(err=>console.error(err));
      
    })

    socket.on('ondragendsame', (data)=>{
      Cols.findOneAndUpdate({id:data.id}, {marks:data.marks},function(err, doc){
        if(err) console.error(err);
        else{
          console.log(doc);
        }
      }).then(
        Cols.find((err, col_data)=>{
          if (err) console.error(err);
          // else {
          //   //socket.emit('update', {col_data:col_data, mark_data:null});
          // }
        })
      )
    })
    socket.on('ondragenddiff', (data)=>{
      Cols.findOneAndUpdate({id:data[0].id}, {marks:data[0].marks},function(err, doc){
        if(err) console.error(err);
        else{
          console.log(doc);
        }
      })
      .then(
        Cols.findOneAndUpdate({id:data[1].id}, {marks:data[1].marks},function(err, doc){
          if(err) console.error(err);
          else{
            console.log(doc);
          }
        })
      )
      .then(
        Cols.find((err, col_data)=>{
          if (err) console.error(err);
          // else {
          //   //socket.emit('update', {col_data:col_data, mark_data:null});
          // }
        })
      )
      
    })
    // disconnect is fired when a client leaves the server
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

    socket.on('clear', () => {
      col_count = 0;
      id_global = 0;
      // Remove all chats from collection
      Item.deleteMany({}, () => {
          // Emit cleared
        console.log("clear database")
        serverSocket.emit('cleared')
      })
      Cols.deleteMany({}, () => {
        // Emit cleared
        console.log("clear database")
        serverSocket.emit('cleared')
      })
    })
  })
})
module.exports = app;
