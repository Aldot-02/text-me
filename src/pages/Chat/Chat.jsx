import React from 'react'
import './Chat.css'
import { useState } from 'react'
import { useEffect } from "react"
import { userChats } from '../../api/ChatRequests'
import { useSelector } from "react-redux";
import Conversation from '../../components/Conversation/Conversation'
import ChatBox from '../../components/ChatBox/ChatBox'
import {io} from 'socket.io-client'
import { useRef } from "react";
import Header from '../../components/Header/Header'



const Chat = () => {
  const { user } = useSelector((state) => state.authReducer.authData);
  // console.log(user)
  

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([])
  const [sendMessage, setSendMessage] = useState(null)
  const [receiveMessage, setReceiveMessage] = useState(null)
  const socket = useRef()

// sending message to socket server
  useEffect(()=> {
    if(sendMessage !== null)
    socket.current.emit('send-message', sendMessage)
  }, [sendMessage])

  useEffect(()=>{
    socket.current = io('https://simple-socket-server.onrender.com')
    socket.current.emit("new-user-add", user._id)
    socket.current.on('get-users', (users)=>{
      setOnlineUsers(users);
    })
  }, [user])

  //receiving message from socket server

  useEffect(()=> {
    socket.current.on("receive-message", (data)=> {
      setReceiveMessage(data)
    })
  }, [])

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
        console.log(data)
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user]);

  //checking online status

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member)=> member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember) 
    return online? true : false
  }
  return (
    <div className="Chat">
      <div className="Left-side-chat">
        <div className="Chat-container">
          <Header/>
          <div className="Chat-list">
            {chats.map((chat)=>(
              <div onClick={()=> setCurrentChat(chat)} className='one-chat'>
                <Conversation data={chat} currentUser={user._id} online={checkOnlineStatus(chat)}/>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="Right-side-chat">
        <div>
          <ChatBox chat={currentChat} currentUser = {user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage}/>
        </div>
      </div>
    </div>
  )
}

export default Chat