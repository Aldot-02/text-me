import React, { useEffect, useRef, useState } from 'react'
import { getUser } from '../../api/UserRequests';
import "./ChatBox.css";
import { addMessage, getMessages } from "../../api/MessageRequests";
import {format} from "timeago.js"
import InputEmoji from 'react-input-emoji';

function ChatBox({chat, currentUser, setSendMessage, receiveMessage}) {


    const [userData, setUserData] = useState(null)
    const [Messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scroll = useRef()
  


  useEffect(()=> {
    if(receiveMessage !== null && receiveMessage.chatId === chat._id) {
      setMessages([...Messages, receiveMessage])
    }
  }, [receiveMessage])

    // fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id)=>id!==currentUser);
    const getUserData = async()=> {
        try {
            const {data} = await getUser(userId)
            setUserData(data)
        } catch (error) {
            console.log(error)
        }
    }

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

//   Fetching data for messages

  useEffect(()=> {
      const fetchMessages = async ()=> {
          try {
              const {data} = await getMessages(chat._id);
              console.log(data)
              setMessages(data)
          } catch (error) {
              console.log(error)
          }
      }
      if(chat !== null) fetchMessages();
  }, [chat])

  const handleChange = (newMessage)=> {
      setNewMessage(newMessage)
  }

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    }

    //send to database
    try {
      const {data} = await addMessage(message);
      setMessages([...Messages, data])
      setNewMessage("")
    } catch (error) {
      console.log(error)
    }

    //Send message to the socket server for real time data
    const receiverId = chat.members.find((id)=> id !== currentUser);
    setSendMessage({...message, receiverId})
  }

  //Scroll to the last sent message always
  useEffect (()=>{
    scroll.current?.scrollIntoView({behavior: "smooth"})
  }, [Messages])

  return (
    <>
        <div className="ChatBox-container">
          {chat? (
              <>
              {/* chat-header */}
                <div className="chat-header">
                  <div className="follower">
                    <div>
                      <img
                        src={
                          userData?.profilePicture
                            ? process.env.REACT_APP_PUBLIC_FOLDER +
                              userData.profilePicture
                            : process.env.REACT_APP_PUBLIC_FOLDER +
                              "defaultProfile.png"
                        }
                        alt="Profile"
                        className="followerImage"
                        style={{ width: "50px", height: "50px" }}
                      />
                        <div className="name" style={{ fontSize: "0.9rem" }}>
                          <span>
                            {userData?.firstname} {userData?.lastname}
                          </span>
                      </div>
                      
                    </div>
                  </div>
                
                </div>

                {/* ChatBox Messages */}

                <div className="chat-body">
                  {Messages.map((message)=>(
                      <>
                        
                        <div ref={scroll}
                        className={message.senderId === currentUser? "message own" : "message"}>
                            <span>
                                {message.text}
                            </span>
                            <span>
                                {format(message.createdAt)}
                            </span>
                        </div>
                        
                        
                      </>
                  ))}
                </div>

                {/* Chat sender section */}
                <div className="chat-sender">
                  <div className='File-sender'>+</div>
                  <InputEmoji
                    value={newMessage}
                    onChange={handleChange}
                    borderColor="none"
                    borderRadius={4}
                    fontSize={14}
                    height={200}
                    cleanOnEnter
                    keepOpened={true}
                    maxLength={100}
                    className="input"
                    
                  />

                  
                  <button className="button-chat" onClick={handleSend}>
                      Send
                  </button>
                </div>
              </>
              ): (
                  ""
          )}
                
        </div>
    </>
  )
}

export default ChatBox