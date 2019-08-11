var _temp;function _assertThisInitialized(self){if(self===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass;}/**
 * Client main
 *
 * Dependencies: client-core
 *
 * Sets up the main client models: Prefs, Teams, User, and PS.
 *
 * @author Guangcong Luo <guancongluo@gmail.com>
 * @license AGPLv3
 */










var PSPrefsDefaults={};var






PSPrefs=function(_PSModel){_inheritsLoose(PSPrefs,_PSModel);



























function PSPrefs(){var _this;
_this=_PSModel.call(this)||this;_this.dark=false;_this.nogif=null;_this.showjoins=null;_this.onepanel=false;_this.storageEngine='';_this.storage={};_this.origin='https://play.pokemonshowdown.com';

for(var _key in _assertThisInitialized(_this)){
var value=_assertThisInitialized(_this)[_key];
if(['storage','subscriptions','origin','storageEngine'].includes(_key))continue;
if(typeof value==='function')continue;
PSPrefsDefaults[_key]=value;
}


try{
if(window.localStorage){
_this.storageEngine='localStorage';
_this.load(JSON.parse(localStorage.getItem('showdown_prefs'))||{},true);
}
}catch(_unused){}return _this;
}var _proto=PSPrefs.prototype;_proto.



set=function set(key,value){
if(value===null){
delete this.storage[key];
this[key]=PSPrefsDefaults[key];
}else{
this.storage[key]=value;
this[key]=value;
}
this.update();
this.save();
};_proto.
load=function load(newPrefs,noSave){
this.fixPrefs(newPrefs);
Object.assign(this,PSPrefsDefaults);
this.storage=newPrefs;
this.update();
if(!noSave)this.save();
};_proto.
save=function save(){
switch(this.storageEngine){
case'localStorage':
localStorage.setItem('showdown_prefs',JSON.stringify(this.storage));}

};_proto.
fixPrefs=function fixPrefs(newPrefs){
var oldShowjoins=newPrefs['showjoins'];
if(oldShowjoins!==undefined&&typeof oldShowjoins!=='object'){
var showjoins={};
var serverShowjoins={global:oldShowjoins?1:0};
var showroomjoins=newPrefs['showroomjoins'];
for(var _roomid in showroomjoins){
serverShowjoins[_roomid]=showroomjoins[_roomid]?1:0;
}
delete newPrefs['showroomjoins'];
showjoins[Config.server.id]=serverShowjoins;
newPrefs['showjoins']=showjoins;
}

var isChrome64=navigator.userAgent.includes(' Chrome/64.');
if(newPrefs['nogif']!==undefined){
if(!isChrome64){
delete newPrefs['nogif'];
}
}else if(isChrome64){
newPrefs['nogif']=true;
alert('Your version of Chrome has a bug that makes animated GIFs freeze games sometimes, so certain animations have been disabled. Only some people have the problem, so you can experiment and enable them in the Options menu setting "Disable GIFs for Chrome 64 bug".');
}
};return PSPrefs;}(PSModel);















if(!window.BattleFormats)window.BattleFormats={};var




PSTeams=function(_PSStreamModel){_inheritsLoose(PSTeams,_PSStreamModel);




function PSTeams(){var _this2;
_this2=_PSStreamModel.call(this)||this;_this2.usesLocalLadder=false;_this2.list=[];_this2.byKey={};
try{
_this2.unpackAll(localStorage.getItem('showdown_teams'));
}catch(_unused2){}return _this2;
}var _proto2=PSTeams.prototype;_proto2.
getKey=function getKey(team){
if(!team)return'';
if(team.key)return team.key;
var key=Math.random().toString().substr(2,1);
for(var i=2;key in this.byKey;i++){
key=Math.random().toString().substr(2,i);
}
team.key=key;
this.byKey[key]=team;
return key;
};_proto2.
save=function save(){

};_proto2.
unpackAll=function unpackAll(buffer){
if(!buffer){
this.list=[];
return;
}

if(buffer.charAt(0)==='['&&!buffer.trim().includes('\n')){
this.unpackOldBuffer(buffer);
return;
}

this.list=[];for(var _i=0,_buffer$split=
buffer.split('\n');_i<_buffer$split.length;_i++){var line=_buffer$split[_i];
var team=this.unpackLine(line);
if(team)this.list.push(team);
}
this.update('team');
};_proto2.
unpackOldBuffer=function unpackOldBuffer(buffer){
alert("Your team storage format is too old for PS. You'll need to upgrade it at https://play.pokemonshowdown.com/recoverteams.html");
this.list=[];
return;
};_proto2.
unpackLine=function unpackLine(line){
var pipeIndex=line.indexOf('|');
if(pipeIndex<0)return null;
var bracketIndex=line.indexOf(']');
if(bracketIndex>pipeIndex)bracketIndex=-1;
var slashIndex=line.lastIndexOf('/',pipeIndex);
if(slashIndex<0)slashIndex=bracketIndex;
var format=bracketIndex>0?line.slice(0,bracketIndex):'gen7';
if(format&&format.slice(0,3)!=='gen')format='gen6'+format;
return{
name:line.slice(slashIndex+1,pipeIndex),
format:format,
packedTeam:line.slice(pipeIndex+1),
folder:line.slice(bracketIndex+1,slashIndex>0?slashIndex:bracketIndex+1),
iconCache:'',
key:''};

};return PSTeams;}(PSStreamModel);var






PSUser=function(_PSModel2){_inheritsLoose(PSUser,_PSModel2);function PSUser(){var _this3;for(var _len=arguments.length,args=new Array(_len),_key2=0;_key2<_len;_key2++){args[_key2]=arguments[_key2];}_this3=_PSModel2.call.apply(_PSModel2,[this].concat(args))||this;_this3.
name="Guest";_this3.
userid="guest";_this3.
named=false;_this3.
registered=false;_this3.
avatar="1";return _this3;}var _proto3=PSUser.prototype;_proto3.
setName=function setName(name,named,avatar){
this.name=name;
this.userid=toID(name);
this.named=named;
this.avatar=avatar;
this.update();
};return PSUser;}(PSModel);var












PSServer=function(){function PSServer(){this.
id='showdown';this.
host='sim2.psim.us';this.
port=8000;this.
altport=80;this.
registered=true;this.
prefix='/showdown';this.
protocol='https';this.
groups={
'~':{
name:"Administrator (~)",
type:'leadership',
order:10001},

'&':{
name:"Leader (&)",
type:'leadership',
order:10002},

'#':{
name:"Room Owner (#)",
type:'leadership',
order:10003},

"\u2605":{
name:"Host (\u2605)",
type:'staff',
order:10004},

'@':{
name:"Moderator (@)",
type:'staff',
order:10005},

'%':{
name:"Driver (%)",
type:'staff',
order:10006},

'*':{
name:"Bot (*)",
order:10007},

"\u2606":{
name:"Player (\u2606)",
order:10008},

'+':{
name:"Voice (+)",
order:10009},

' ':{
order:10010},

'!':{
name:"Muted (!)",
type:'punishment',
order:10011},

'✖':{
name:"Namelocked (\u2716)",
type:'punishment',
order:10012},

"\u203D":{
name:"Locked (\u203D)",
type:'punishment',
order:10013}};this.


defaultGroup={
order:10006.5};}var _proto4=PSServer.prototype;_proto4.

getGroup=function getGroup(symbol){
return this.groups[(symbol||' ').charAt(0)]||this.defaultGroup;
};return PSServer;}();var






















PSRoom=function(_PSStreamModel2){_inheritsLoose(PSRoom,_PSStreamModel2);

























function PSRoom(options){var _this4;
_this4=_PSStreamModel2.call(this)||this;_this4.title="";_this4.type='';_this4.notifying='';_this4.classType='';_this4.location='left';_this4.closable=true;_this4.connected=false;_this4.onParentEvent=null;_this4.width=0;_this4.height=0;_this4.parentElem=null;_this4.rightPopup=false;
_this4.id=options.id;
if(options.title)_this4.title=options.title;
if(!_this4.title)_this4.title=_this4.id;
if(options.type)_this4.type=options.type;
if(options.location)_this4.location=options.location;
if(options.parentElem)_this4.parentElem=options.parentElem;
if(_this4.location!=='popup'&&_this4.location!=='semimodal-popup')_this4.parentElem=null;
if(options.rightPopup)_this4.rightPopup=true;
if(options.connected)_this4.connected=true;return _this4;
}var _proto5=PSRoom.prototype;_proto5.
setDimensions=function setDimensions(width,height){
if(this.width===width&&this.height===height)return;
this.width=width;
this.height=height;
this.update('');
};_proto5.
receive=function receive(message){
throw new Error("This room is not designed to receive messages");
};_proto5.
send=function send(msg){
var id=this.id==='lobby'?'':this.id;
PS.send(id+'|'+msg);
};_proto5.
destroy=function destroy(){
if(this.connected){
this.send('/leave');
this.connected=false;
}
};return PSRoom;}(PSStreamModel);var


PlaceholderRoom=function(_PSRoom){_inheritsLoose(PlaceholderRoom,_PSRoom);function PlaceholderRoom(){var _this5;for(var _len2=arguments.length,args=new Array(_len2),_key3=0;_key3<_len2;_key3++){args[_key3]=arguments[_key3];}_this5=_PSRoom.call.apply(_PSRoom,[this].concat(args))||this;_this5.
queue=[];_this5.
classType='placeholder';return _this5;}var _proto6=PlaceholderRoom.prototype;_proto6.
receive=function receive(message){
this.queue.push(message);
};return PlaceholderRoom;}(PSRoom);














var PS=new(_temp=function(_PSModel3){_inheritsLoose(_temp,_PSModel3);


























































































function _temp(){var _this6;
_this6=_PSModel3.call(this)||this;_this6.down=false;_this6.prefs=new PSPrefs();_this6.teams=new PSTeams();_this6.user=new PSUser();_this6.server=new PSServer();_this6.connection=null;_this6.connected=false;_this6.isOffline=false;_this6.router=null;_this6.rooms={};_this6.roomTypes={};_this6.leftRoomList=[];_this6.rightRoomList=[];_this6.popups=[];_this6.leftRoom=null;_this6.rightRoom=null;_this6.room=null;_this6.activePanel=null;_this6.onePanelMode=false;_this6.leftRoomWidth=0;_this6.mainmenu=null;_this6.arrowKeysUsed=false;

_this6.addRoom({
id:'',
title:"Home",
type:'mainmenu'});


_this6.addRoom({
id:'rooms',
title:"Rooms",
type:'rooms'});


_this6.updateLayout();
window.addEventListener('resize',function(){return _this6.updateLayout();});return _this6;
}var _proto7=_temp.prototype;_proto7.

lineParse=function lineParse(str){
if(!str.startsWith('|')){
return['',str];
}
var index=str.indexOf('|',1);
var cmd=str.slice(1,index);
switch(cmd){
case'html':
case'raw':
case'challstr':
case'':
return[cmd,str.slice(index+1)];
case'c':
case'uhtml':
case'uhtmlchange':

var index2a=str.indexOf('|',index+1);
return[cmd,str.slice(index+1,index2a),str.slice(index2a+1)];
case'c:':

var index2b=str.indexOf('|',index+1);
var index3b=str.indexOf('|',index2b+1);
return[cmd,str.slice(index+1,index2b),str.slice(index2b+1,index3b),str.slice(index3b+1)];}

return str.slice(1).split('|');
};_proto7.



















getWidthFor=function getWidthFor(room){
switch(room.type){
case'mainmenu':
return{
minWidth:340,
width:628,
maxWidth:628,
isMainMenu:true};

case'chat':
case'rooms':
case'battles':
return{
minWidth:320,
width:570,
maxWidth:640};

case'battle':
return{
minWidth:320,
width:956,
maxWidth:1180};}


return{
minWidth:640,
width:640,
maxWidth:640};

};_proto7.
updateLayout=function updateLayout(){
var leftRoomWidth=this.calculateLeftRoomWidth();
if(this.leftRoomWidth!==leftRoomWidth){
this.leftRoomWidth=leftRoomWidth;
this.update(true);
}
};_proto7.
update=function update(layoutAlreadyUpdated){
if(!layoutAlreadyUpdated)this.updateLayout();
_PSModel3.prototype.update.call(this);
};_proto7.
receive=function receive(msg){
msg=msg.endsWith('\n')?msg.slice(0,-1):msg;
var roomid='';
if(msg.startsWith('>')){
var nlIndex=msg.indexOf('\n');
roomid=msg.slice(1,nlIndex);
msg=msg.slice(nlIndex+1);
}
var roomid2=roomid||'lobby';
var room=PS.rooms[roomid];
console.log("\u2705 "+(roomid?'['+roomid+'] ':'')+'%c'+msg,"color: #007700");for(var _i2=0,_msg$split=
msg.split('\n');_i2<_msg$split.length;_i2++){var line=_msg$split[_i2];
if(line.startsWith('|init|')){
room=PS.rooms[roomid2];
var _type=line.slice(6);
if(!room){
this.addRoom({
id:roomid2,
type:_type,
connected:true},
roomid==='staff'||roomid==='upperstaff');
room=PS.rooms[roomid2];
}else{
room.type=_type;
room.connected=true;
this.updateRoomTypes();
}
this.update();
continue;
}
if((line+'|').startsWith('|deinit|')){
room=PS.rooms[roomid2];
if(room){
room.connected=false;
this.removeRoom(room);
}
this.update();
continue;
}
if(room)room.receive(line);
}
if(room)room.update(null);
};_proto7.
send=function send(fullMsg){
var pipeIndex=fullMsg.indexOf('|');
var roomid=fullMsg.slice(0,pipeIndex);
var msg=fullMsg.slice(pipeIndex+1);
console.log("\u25B6\uFE0F "+(roomid?'['+roomid+'] ':'')+'%c'+msg,"color: #776677");
this.connection.send(fullMsg);
};_proto7.
isVisible=function isVisible(room){
if(this.leftRoomWidth===0){

return room===this.room;
}else{

return room===this.rightRoom||room===this.leftRoom;
}
};_proto7.
calculateLeftRoomWidth=function calculateLeftRoomWidth(){


if(!this.leftRoom||!this.rightRoom||this.onePanelMode){
return 0;
}




var left=this.getWidthFor(this.leftRoom);
var right=this.getWidthFor(this.rightRoom);
var available=document.body.offsetWidth;

var excess=available-(left.width+right.width);
if(excess>=0){

var leftStretch=left.maxWidth-left.width;
if(!leftStretch)return left.width;
var rightStretch=right.maxWidth-right.width;
if(leftStretch+rightStretch>=excess)return left.maxWidth;

return left.width+Math.floor(excess*leftStretch/(leftStretch+rightStretch));
}

if(left.isMainMenu){
if(available>=left.minWidth+right.width){
return left.minWidth;
}
return 0;
}

if(available>=left.width+right.minWidth){
return left.width;
}
return 0;
};_proto7.
createRoom=function createRoom(options){

if(!options.type){
var hyphenIndex=options.id.indexOf('-');
switch(hyphenIndex<0?options.id:options.id.slice(0,hyphenIndex+1)){
case'teambuilder':case'ladder':case'battles':case'rooms':
case'options':case'volume':case'teamdropdown':case'formatdropdown':
options.type=options.id;
break;
case'battle-':case'user-':case'team-':
options.type=options.id.slice(0,hyphenIndex);
break;
case'view-':
options.type='html';
break;
default:
options.type='chat';
break;}

}

if(!options.location){
switch(options.type){
case'rooms':
case'chat':
options.location='right';
break;
case'options':
case'volume':
case'user':
options.location='popup';
break;
case'teamdropdown':
case'formatdropdown':
options.location='semimodal-popup';
break;}

}

var roomType=this.roomTypes[options.type];
if(roomType&&roomType.title)options.title=roomType.title;
var Model=roomType?roomType.Model:PlaceholderRoom;
return new Model(options);
};_proto7.
updateRoomTypes=function updateRoomTypes(){
var updated=false;
for(var _roomid2 in this.rooms){
var room=this.rooms[_roomid2];
if(room.type===room.classType)continue;
var roomType=this.roomTypes[room.type];
if(!roomType)continue;

var options=room;
if(roomType.title)options.title=roomType.title;
var newRoom=new roomType.Model(options);
this.rooms[_roomid2]=newRoom;
if(this.leftRoom===room)this.leftRoom=newRoom;
if(this.rightRoom===room)this.rightRoom=newRoom;
if(this.activePanel===room)this.activePanel=newRoom;
if(this.room===room)this.room=newRoom;
if(_roomid2==='')this.mainmenu=newRoom;

if(options.queue){for(var _i3=0,_options$queue=
options.queue;_i3<_options$queue.length;_i3++){var line=_options$queue[_i3];
room.receive(line);
}
}
updated=true;
}
if(updated)this.update();
};_proto7.
focusRoom=function focusRoom(roomid){
if(this.leftRoomList.includes(roomid)){
this.leftRoom=this.rooms[roomid];
this.activePanel=this.leftRoom;
while(this.popups.length){this.leave(this.popups.pop());}
this.room=this.leftRoom;
}else if(this.rightRoomList.includes(roomid)){
this.rightRoom=this.rooms[roomid];
this.activePanel=this.rightRoom;
while(this.popups.length){this.leave(this.popups.pop());}
this.room=this.rightRoom;
}else if(this.rooms[roomid]){
this.room=this.rooms[roomid];
}else{
return false;
}
this.update();
if(this.room.onParentEvent)this.room.onParentEvent('focus',undefined);
return true;
};_proto7.
focusLeftRoom=function focusLeftRoom(){
var allRooms=this.leftRoomList.concat(this.rightRoomList);
var roomIndex=allRooms.indexOf(this.room.id);
if(roomIndex===-1){

return this.focusRoom('');
}
if(roomIndex===0){
return this.focusRoom(allRooms[allRooms.length-1]);
}
return this.focusRoom(allRooms[roomIndex-1]);
};_proto7.
focusRightRoom=function focusRightRoom(){
var allRooms=this.leftRoomList.concat(this.rightRoomList);
var roomIndex=allRooms.indexOf(this.room.id);
if(roomIndex===-1){

return this.focusRoom('');
}
if(roomIndex===allRooms.length-1){
return this.focusRoom(allRooms[0]);
}
return this.focusRoom(allRooms[roomIndex+1]);
};_proto7.
focusPreview=function focusPreview(room){
if(room!==this.room)return'';
var allRooms=this.leftRoomList.concat(this.rightRoomList);
var roomIndex=allRooms.indexOf(this.room.id);
if(roomIndex===-1){

return'';
}
var buf='  ';
if(roomIndex>1){
var leftRoom=this.rooms[allRooms[roomIndex-1]];
buf+="\u2190 "+leftRoom.title;
}
buf+=this.arrowKeysUsed?" | ":" (use arrow keys) ";
if(roomIndex<allRooms.length-1){
var rightRoom=this.rooms[allRooms[roomIndex+1]];
buf+=rightRoom.title+" \u2192";
}
return buf;
};_proto7.
addRoom=function addRoom(options,noFocus){
if(this.rooms[options.id]){
for(var i=0;i<this.popups.length;i++){
var popup=this.rooms[this.popups[i]];
if(popup.parentElem===options.parentElem){
while(this.popups.length>i){
var popupid=this.popups.pop();
this.leave(popupid);
}
return;
}
}
if(!noFocus)this.focusRoom(options.id);
return;
}
if(!noFocus){
while(this.popups.length&&this.popups[this.popups.length-1]!==options.parentRoomid){
var _popupid=this.popups.pop();
this.leave(_popupid);
}
}
var room=this.createRoom(options);
this.rooms[room.id]=room;
switch(room.location){
case'left':
this.leftRoomList.push(room.id);
if(!noFocus)this.leftRoom=room;
break;
case'right':
this.rightRoomList.push(room.id);
if(this.rightRoomList[this.rightRoomList.length-2]==='rooms'){
this.rightRoomList.splice(-2,1);
this.rightRoomList.push('rooms');
}
if(!noFocus||!this.rightRoom)this.rightRoom=room;
break;
case'popup':
case'semimodal-popup':
case'modal-popup':
this.popups.push(room.id);
break;}

if(!noFocus){
if(!this.popups.length)this.activePanel=room;
this.room=room;
}
if(options.queue){for(var _i4=0,_options$queue2=
options.queue;_i4<_options$queue2.length;_i4++){var line=_options$queue2[_i4];
room.receive(line);
}
}
return room;
};_proto7.
removeRoom=function removeRoom(room){
room.destroy();
delete PS.rooms[room.id];

var leftRoomIndex=PS.leftRoomList.indexOf(room.id);
if(leftRoomIndex>=0){
PS.leftRoomList.splice(leftRoomIndex,1);
}
if(PS.leftRoom===room){
PS.leftRoom=this.mainmenu;
if(PS.activePanel===room)PS.activePanel=this.mainmenu;
if(PS.room===room)PS.room=this.mainmenu;
}

var rightRoomIndex=PS.rightRoomList.indexOf(room.id);
if(rightRoomIndex>=0){
PS.rightRoomList.splice(rightRoomIndex,1);
}
if(PS.rightRoom===room){
var newRightRoomid=PS.rightRoomList[rightRoomIndex]||PS.rightRoomList[rightRoomIndex-1];
PS.rightRoom=newRightRoomid?PS.rooms[newRightRoomid]:null;
if(PS.activePanel===room)PS.activePanel=PS.rightRoom||PS.leftRoom;
if(PS.room===room)PS.room=PS.activePanel;
}

if(this.popups.length&&room.id===this.popups[this.popups.length-1]){
this.popups.pop();
PS.room=this.popups.length?PS.rooms[this.popups[this.popups.length-1]]:PS.activePanel;
}

this.update();
};_proto7.
closePopup=function closePopup(skipUpdate){
if(!this.popups.length)return;
this.leave(this.popups[this.popups.length-1]);
if(!skipUpdate)this.update();
};_proto7.
join=function join(roomid,side,noFocus){
this.addRoom({id:roomid,side:side},noFocus);
this.update();
};_proto7.
leave=function leave(roomid){
var room=PS.rooms[roomid];
if(room)this.removeRoom(room);
};return _temp;}(PSModel),_temp)();