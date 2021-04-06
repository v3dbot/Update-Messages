console.log("server starting");
require('dotenv').config();
const express = require("express");
/*const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
}); 
rl.setPrompt("> ");

rl.on('line', (input) => {
  if(input.toLowerCase().indexOf("send \"") != -1){
	  let args = input.split("send \"")[1].split("\" ");
	  if(args.length == 3 && args[0] == ""){
		  args.shift();
	  }else if(args.length > 3){
		  console.error("Something went wrong");
		  process.stdout.write("> ");
		  return;
	  }
	  const req = {};
	  req.body = {};
	  req.body.msg = args[0];
	  req.body.server = args[1].split("#")[0];
	  req.body.channel = args[1].split("#")[1];
	  const res = {};
	  res.send = function(msg){if(msg != "success"){console.log(msg)}};
	  //res.send = function(){};
	  sendMSG(req, res);
  }else if(input.toLowerCase().indexOf("list ") != -1 && input.split("list ").length == 2){
	  const list = input.split("list ")[1].toLowerCase();
	  if(list == "updated"){
		  console.log(channels);
	  }else if(list == "servers" || list == "server" || list == "guild" || list == "guilds"){
		  console.log(bot.guilds.cache.array());
	  }else if(list == "channels" || list == "channel"){
		  console.log(bot.channels.cache.array());
	  }
  }else if(input.toLowerCase().indexOf("cls") != -1){console.clear();}
  //process.stdout.write("> ");
  rl.prompt();
});*/
const fs = require('fs');
const cors = require('cors');
let app = express();
let channels = {};
let guilds = {};
let server = app.listen(81, listening);
const Discord = require('discord.js');
let bot = new Discord.Client();
let msgs = [];
const bodyParser = require("body-parser");
const token = process.env.TOKEN;
function listening(){
  console.log("listening. . .");
}
bot.login(token);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  updateChannels();
  //process.stdout.write("> ");
  //rl.prompt();
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public_html"));

app.get(`/guilds`, listGuilds);
app.get(`/channels`, listChannels);
app.get(`/list`, listUpdated);

app.post(`/send`, sendMSG);

function sendMSG(req, res){
  args = req.body;
  if(channels[args.server] && channels[args.server][args.channel] && channels[args.server][args.channel].type == 'text'){
	if(args.embed == "on"){
		const embed = new Discord.MessageEmbed()
		.setColor(args.col)
		.setTitle(args.msg);
		/*.addFields(
			{ name: '​', value: args.msg },
		);*/
		channels[args.server][args.channel].send(embed);
		res.send("success");
		console.log(`Sent \"${args.msg}\" in ${args.server}#${args.channel} with colour ${args.col}`);
	}else if(args.embed != "on"){
		channels[args.server][args.channel].send(args.msg);
		res.send("success");
		console.log(`Sent \"${args.msg}\" in ${args.server}#${args.channel} as text`);
	}
  }else{
    res.send(`${args.server}#${args.channel} is not a text channel`);
  }
}

//#c5044c

function listUpdated(req, res){
	res.set("Content-Language", "en-US");
	res.send(channels);
}
function listGuilds(req, res){
	res.set("Content-Language", "en-US");
	res.send(bot.guilds.cache.array());
}

function listChannels(req, res){
	res.set("Content-Language", "en-US");
	res.send(bot.channels.cache.array());
}

function updateChannels(){
	const gArray=bot.guilds.cache.array();
	const cArray=bot.channels.cache.array();
	for(let i = 0; i < gArray.length; i++){
		guilds[gArray[i].id] = gArray[i];
	}
	for(let i = 0; i < gArray.length; i++){
		channels[gArray[i].name] = {};
	}
	for(let i = 0; i < cArray.length; i++){
		channels[guilds[cArray[i].guild.id].name][cArray[i].name] =cArray[i];
	}
}
