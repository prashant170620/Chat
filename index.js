const http = require('http');
const ws = require('ws');
const Url = require('url');
const qs = require('querystring');
const fs = require('fs');
const path = require('path');
const wsStack = [];


const WebSocket = new ws.Server({port:8000});

WebSocket.on('open',()=>{
    console.log('Websocket Server is start Lisening ... ');
});

WebSocket.on('connection',(ws)=>{
    console.log('Client connected');
   wsStack.push(ws);
   ws.on('message',function(data){
        console.log(data.toString());
        for(let i=0;i<wsStack.length;i++){
            if(wsStack[i]!=ws&&wsStack[i]!=undefined){
                wsStack[i].send(data.toString());
            }
        }
   });
   ws.on('close',function(code,msg){
        console.log('Clinet is disconnected','Code : ',code,'Error Mesage : ',msg.toString());
        for(let i=0;i<wsStack.length;i++){
            if(wsStack[i]==ws){
                delete wsStack[i];
                break;
            }
        }
   });
});

const Server = http.createServer(function(req,res){
    var url = Url.parse(req.url);
    console.log(url.path);
    switch(url.path){
        case '/':
            fs.readFile('index.html',(err,data)=>{
                if(err){
                    res.end('An error occure');
                }
                else{
                    res.end(data.toString());
                }
            });
            break;
        default :
                fs.readFile('.'+url.path,(err,data)=>{
                    if(err){
                        console.log('Error ')
                        res.end('An error occure');
                    }
                    else{
                        console.log(path.extname(url.path));
                        res.end(data.toString());
                    }
                });
    } 
});

Server.listen(3000,()=>{
    console.log('Server is Listening......');
});