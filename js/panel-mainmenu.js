function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass;}/**
 * Main menu panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var



MainMenuRoom=function(_PSRoom){_inheritsLoose(MainMenuRoom,_PSRoom);function MainMenuRoom(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_PSRoom.call.apply(_PSRoom,[this].concat(args))||this;_this.
classType='mainmenu';_this.
userdetailsCache=




{};_this.
roomsCache=





{};return _this;}var _proto=MainMenuRoom.prototype;_proto.
receive=function receive(line){var _this2=this;
var tokens=PS.lineParse(line);
switch(tokens[0]){
case'challstr':
PSLoginServer.query({
act:'upkeep',
challstr:tokens[1]},
function(res){
if(!res)return;
if(!res.loggedin)return;
_this2.send("/trn "+res.username+",0,"+res.assertion);
});
return;
case'updateuser':
PS.user.setName(tokens[1],tokens[2]==='1',tokens[3]);
return;
case'queryresponse':
this.handleQueryResponse(tokens[1],JSON.parse(tokens[2]));
return;
case'pm':
this.handlePM(tokens[1],tokens[2],tokens[3]);
return;
case'formats':
this.parseFormats(tokens);
return;}

var lobby=PS.rooms['lobby'];
if(lobby)lobby.receive(line);
};_proto.
parseFormats=function parseFormats(formatsList){
var isSection=false;
var section='';

var column=0;

window.BattleFormats={};
for(var j=1;j<formatsList.length;j++){
var entry=formatsList[j];
if(isSection){
section=entry;
isSection=false;
}else if(entry===',LL'){
PS.teams.usesLocalLadder=true;
}else if(entry===''||entry.charAt(0)===','&&!isNaN(Number(entry.slice(1)))){
isSection=true;

if(entry){
column=parseInt(entry.slice(1),10)||0;
}
}else{
var name=entry;
var searchShow=true;
var challengeShow=true;
var tournamentShow=true;
var team=null;
var teambuilderLevel=null;
var lastCommaIndex=name.lastIndexOf(',');
var code=lastCommaIndex>=0?parseInt(name.substr(lastCommaIndex+1),16):NaN;
if(!isNaN(code)){
name=name.substr(0,lastCommaIndex);
if(code&1)team='preset';
if(!(code&2))searchShow=false;
if(!(code&4))challengeShow=false;
if(!(code&8))tournamentShow=false;
if(code&16)teambuilderLevel=50;
}else{

if(name.substr(name.length-2)===',#'){
team='preset';
name=name.substr(0,name.length-2);
}
if(name.substr(name.length-2)===',,'){
challengeShow=false;
name=name.substr(0,name.length-2);
}else if(name.substr(name.length-1)===','){
searchShow=false;
name=name.substr(0,name.length-1);
}
}
var _id=toID(name);
var isTeambuilderFormat=!team&&name.slice(-11)!=='Custom Game';
var teambuilderFormat='';
var teambuilderFormatName='';
if(isTeambuilderFormat){
teambuilderFormatName=name;
if(_id.slice(0,3)!=='gen'){
teambuilderFormatName='[Gen 6] '+name;
}
var parenPos=teambuilderFormatName.indexOf('(');
if(parenPos>0&&name.slice(-1)===')'){

teambuilderFormatName=teambuilderFormatName.slice(0,parenPos).trim();
}
if(teambuilderFormatName!==name){
teambuilderFormat=toID(teambuilderFormatName);
if(BattleFormats[teambuilderFormat]){
BattleFormats[teambuilderFormat].isTeambuilderFormat=true;
}else{
BattleFormats[teambuilderFormat]={
id:teambuilderFormat,
name:teambuilderFormatName,
team:team,
section:section,
column:column,
rated:false,
isTeambuilderFormat:true,
effectType:'Format'};

}
isTeambuilderFormat=false;
}
}
if(BattleFormats[_id]&&BattleFormats[_id].isTeambuilderFormat){
isTeambuilderFormat=true;
}

if(BattleFormats[_id])delete BattleFormats[_id];
BattleFormats[_id]={
id:_id,
name:name,
team:team,
section:section,
column:column,
searchShow:searchShow,
challengeShow:challengeShow,
tournamentShow:tournamentShow,
rated:searchShow&&_id.substr(4,7)!=='unrated',
teambuilderLevel:teambuilderLevel,
teambuilderFormat:teambuilderFormat,
isTeambuilderFormat:isTeambuilderFormat,
effectType:'Format'};

}
}


var multivariantFormats={};
for(var _id2 in BattleFormats){
var _teambuilderFormat=BattleFormats[BattleFormats[_id2].teambuilderFormat];
if(!_teambuilderFormat||multivariantFormats[_teambuilderFormat.id])continue;
if(!_teambuilderFormat.searchShow&&!_teambuilderFormat.challengeShow&&!_teambuilderFormat.tournamentShow){

if(_teambuilderFormat.battleFormat){
multivariantFormats[_teambuilderFormat.id]=1;
_teambuilderFormat.battleFormat='';
}else{
_teambuilderFormat.battleFormat=_id2;
}
}
}
PS.teams.update('format');
};_proto.
handlePM=function handlePM(user1,user2,message){
var userid1=toID(user1);
var userid2=toID(user2);
var roomid="pm-"+[userid1,userid2].sort().join('-');
var room=PS.rooms[roomid];
if(!room){
var pmTarget=PS.user.userid===userid1?user2:user1;
PS.addRoom({
id:roomid,
pmTarget:pmTarget},
true);
room=PS.rooms[roomid];
}
room.receive("|c|"+user1+"|"+message);
PS.update();
};_proto.
handleQueryResponse=function handleQueryResponse(id,response){
switch(id){
case'userdetails':
var _userid=response.userid;
var userdetails=this.userdetailsCache[_userid];
if(!userdetails){
this.userdetailsCache[_userid]=response;
}else{
Object.assign(userdetails,response);
}
var userRoom=PS.rooms["user-"+_userid];
if(userRoom)userRoom.update('');
break;
case'rooms':
this.roomsCache=response;
var roomsRoom=PS.rooms["rooms"];
if(roomsRoom)roomsRoom.update('');
break;}

};return MainMenuRoom;}(PSRoom);var


MainMenuPanel=function(_PSRoomPanel){_inheritsLoose(MainMenuPanel,_PSRoomPanel);function MainMenuPanel(){return _PSRoomPanel.apply(this,arguments)||this;}var _proto2=MainMenuPanel.prototype;_proto2.
focus=function focus(){
this.base.querySelector('button.big').focus();
};_proto2.
render=function render(){
var onlineButton=' button'+(PS.isOffline?' disabled':'');
var searchButton=PS.down?preact.h("div",{"class":"menugroup",style:"background: rgba(10,10,10,.6)"},
PS.down==='ddos'?
preact.h("p",{"class":"error"},preact.h("strong",null,"Pok\xE9mon Showdown is offline due to a DDoS attack!")):
preact.h("p",{"class":"error"},preact.h("strong",null,"Pok\xE9mon Showdown is offline due to technical difficulties!")),
preact.h("p",null,
preact.h("div",{style:{textAlign:'center'}},
preact.h("img",{width:"96",height:"96",src:"//play.pokemonshowdown.com/sprites/bw/teddiursa.png",alt:""})),"Bear with us as we freak out."),



preact.h("p",null,"(We'll be back up in a few hours.)")):
preact.h("div",{"class":"menugroup"},
preact.h("p",null,
preact.h(FormatDropdown,null)),

preact.h("p",null,
preact.h(TeamDropdown,{format:"gen7ou"})),

preact.h("p",null,preact.h("button",{"class":"mainmenu1 big"+onlineButton,name:"search"},
preact.h("strong",null,"Battle!"),preact.h("br",null),
preact.h("small",null,"Find a random opponent"))));


return preact.h(PSPanelWrapper,{room:this.props.room},
preact.h("div",{"class":"mainmenuwrapper"},
preact.h("div",{"class":"leftmenu"},
preact.h("div",{"class":"activitymenu"},
preact.h("div",{"class":"pmbox"},
preact.h("div",{"class":"pm-window news-embed","data-newsid":"<!-- newsid -->"},
preact.h("h3",null,
preact.h("button",{"class":"closebutton",tabIndex:-1},preact.h("i",{"class":"fa fa-times-circle"})),
preact.h("button",{"class":"minimizebutton",tabIndex:-1},preact.h("i",{"class":"fa fa-minus-circle"})),"News"),


preact.h("div",{"class":"pm-log",style:"max-height:none"},
preact.h("div",{"class":"newsentry"},
preact.h("h4",null,"Test client"),
preact.h("p",null,"Welcome to the test client! You can test client changes here!"),
preact.h("p",null,"\u2014",preact.h("strong",null,"Zarel")," ",preact.h("small",{"class":"date"},"on Sep 25, 2015"))))))),





preact.h("div",{"class":"mainmenu"},
searchButton,

preact.h("div",{"class":"menugroup"},
preact.h("p",null,preact.h("button",{"class":"mainmenu2 button",name:"joinRoom",value:"teambuilder"},"Teambuilder")),
preact.h("p",null,preact.h("button",{"class":"mainmenu3"+onlineButton,name:"joinRoom",value:"ladder"},"Ladder"))),


preact.h("div",{"class":"menugroup"},
preact.h("p",null,preact.h("button",{"class":"mainmenu4"+onlineButton,name:"joinRoom",value:"battles"},"Watch a battle")),
preact.h("p",null,preact.h("button",{"class":"mainmenu5"+onlineButton,name:"finduser"},"Find a user"))))),



preact.h("div",{"class":"rightmenu",style:{display:PS.leftRoomWidth?'none':'block'}},
preact.h("div",{"class":"menugroup"},
PS.server.id==='showdown'?
preact.h("p",null,preact.h("button",{"class":"mainmenu1"+onlineButton,name:"joinRoom",value:"rooms"},"Join chat")):

preact.h("p",null,preact.h("button",{"class":"mainmenu1"+onlineButton,name:"joinRoom",value:"lobby"},"Join lobby chat")))),



preact.h("div",{"class":"mainmenufooter"},
preact.h("div",{"class":"bgcredit"}),
preact.h("small",null,
preact.h("a",{href:"//dex.pokemonshowdown.com/",target:"_blank"},"Pok\xE9dex")," | ",
preact.h("a",{href:"//replay.pokemonshowdown.com/",target:"_blank"},"Replays")," | ",
preact.h("a",{href:"//pokemonshowdown.com/rules",target:"_blank"},"Rules")," | ",
preact.h("a",{href:"//pokemonshowdown.com/credits",target:"_blank"},"Credits")," | ",
preact.h("a",{href:"http://smogon.com/forums/",target:"_blank"},"Forum")))));




};return MainMenuPanel;}(PSRoomPanel);var


FormatDropdown=function(_preact$Component){_inheritsLoose(FormatDropdown,_preact$Component);function FormatDropdown(){var _this3;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this3=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this3.






change=function(){return _this3.forceUpdate();};return _this3;}var _proto3=FormatDropdown.prototype;_proto3.getFormat=function getFormat(){if(this.base){return this.base.value;}return'gen7randombattle';};_proto3.
render=function render(){
var format=this.getFormat();
return preact.h("button",{"class":"select formatselect",name:"format","data-href":"/formatdropdown",onChange:this.change},
format);

};return FormatDropdown;}(preact.Component);var


TeamDropdown=function(_preact$Component2){_inheritsLoose(TeamDropdown,_preact$Component2);function TeamDropdown(){var _this4;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this4=_preact$Component2.call.apply(_preact$Component2,[this].concat(args))||this;_this4.










change=function(){return _this4.forceUpdate();};return _this4;}var _proto4=TeamDropdown.prototype;_proto4.getTeam=function getTeam(){if(this.base){var key=this.base.value;return PS.teams.byKey[key]||null;}for(var _i=0,_PS$teams$list=PS.teams.list;_i<_PS$teams$list.length;_i++){var team=_PS$teams$list[_i];if(team.format===this.props.format)return team;}return null;};_proto4.
render=function render(){
var format=this.props.format;
var team=this.getTeam();
var teambox=null;
if(PS.roomTypes['teamdropdown']){
teambox=preact.h(TeamBox,{team:team,noLink:true});
}
return preact.h("button",{"class":"select teamselect",name:"team","data-href":"/teamdropdown","data-format":format,onChange:this.change},
teambox);

};return TeamDropdown;}(preact.Component);


PS.roomTypes['mainmenu']={
Model:MainMenuRoom,
Component:MainMenuPanel};