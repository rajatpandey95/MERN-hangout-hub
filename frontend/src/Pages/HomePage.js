import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useEffect } from "react";

import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) history.push("/chats"); // is user already logged in redirect to chats page
  }, [history]);

  return (
    <Container maxWidth="xl">
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        m={"40px 0 15px 0"}
        bg="white"
        color="black"
        borderRadius={10}
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Worsk sans">
          Hangout Hub
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        color="black"
        borderRadius="1g"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%"> Login</Tab>
            <Tab width="50%">SignUps</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
