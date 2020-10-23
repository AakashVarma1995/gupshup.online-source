import React, { useRef } from 'react';
import io from 'socket.io-client';
import {createUseStyles} from 'react-jss'

const useStyles = createUseStyles({
  root:{
    width:'90%',
    margin:'0 auto'
  },
  chatWindow:{
    height:'500px',
    boxShadow:'2px 2px 7px #aaaaaa inset',
    overflowY:'scroll',
    scrollSnapAlign:'end'
  },
  myChatMesageRow:{
    width:'100%',
    display:'flex',
    justifyContent:'flex-end'
  },
  myChatMessageBox:{
    margin:'8px',
    background:'dodgerblue',
    padding:'10px',
    color:'white',
    borderRadius:'10px',
    minWidth:'50px',
    textAlign:'right'

  },
  chatMesageRow:{

    width:'100%',
    display:'flex',

  },
  chatMessageBox:{
    margin:'10px',
    background:'#F93D66',
    padding:'8px',
    color:'white',
    borderRadius:'10px',
    minWidth:'50px',
  },
  sendBtn:{
    border:'none',
    background:"dodgerblue",
    color:'white',
    fontWeight:'bold',
    padding:'12px',
    marginLeft:'8px'
    
  },
  input:{
    border:'none',
    background:'#f5f5f5',
    padding:'12px',
    width:'calc(100% - 90px)'
  },
  actionsBar:{
    marginTop:'8px',
    width:"100%"
  },
  userNameShow:{
    fontSize:'0.7em',
    paddingBottom:'5px'
  }
})
const userName = window.location.pathname.replace('/',"")
const socket = io.connect('socket-chat-app-backend.herokuapp.com',{query:{user:userName}})


function App() {
  const classes = useStyles()
  const [messages, setMessages] = React.useState([{sender:userName, message:'Joined!'}])
  const [sendMessageInput, setSendMessageInput] = React.useState('')
  const messagesEndRef = useRef(null)

  
  React.useEffect(() => {


    socket.on("onConnect",allMessages=>{
      setMessages(allMessages)
    })

    socket.on("chatMessage",chatMessage=>{
      console.log(chatMessage)
      setMessages(messages=>messages.concat(chatMessage))
      console.log(messages)
     
    })
    return()=>{
      socket.off()
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(scrollToBottom, [messages]);


 

  const sendMessage =(e)=>{
    e.preventDefault()
    if(sendMessageInput==''){

    }
    else{
      socket.emit("chatMessage",{sender:userName, message:sendMessageInput})
      setSendMessageInput("")
    }
  }

  return (
   <div className={classes.root}>
      <center><h1>GupShup.online<br/>Hi, {userName}</h1></center>
      <div className={classes.chatWindow}>
          { 
            messages.map((msg,index)=>{
              if(msg.sender==userName){
                return(<div className={classes.myChatMesageRow} key={index}>
                  <div className={classes.myChatMessageBox}>
                  <div className={classes.userNameShow}>Me</div>
    
                  {msg.message}
                  </div>
           
              </div>)
              }
              else{
                return(
                  <div className={classes.chatMesageRow} key={index}>
                  <div className={classes.chatMessageBox}>
                <div className={classes.userNameShow}>{msg.sender}</div>
    
                  {msg.message}
                  </div>
              </div>
                )
              }
            })
          }
          
       <div ref={messagesEndRef}/>
      </div>
      <div className={classes.actionsBar}>
        <form onSubmit={(e)=>sendMessage(e)}>
        <input type='text' placeholder="Enter a message" className={classes.input} onChange={(e)=>setSendMessageInput(e.target.value)} value={sendMessageInput}></input>
        <button className={classes.sendBtn} type="submit">Send</button>
        </form>
      
      </div>
   </div>
  );
}

export default App;
