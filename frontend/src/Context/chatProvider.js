import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// creating a context API  which will act as a storage from which all components from our app can fetch data
// and we will wrap our app in ChatProvider   in index.js
const ChatContext = createContext();

//childer -> here is whole of our app

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(); // as this state is defined in context api do ti will be accessible in whole of our app
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      history.push("/");
    } // is user not logged in redirect to login page
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
