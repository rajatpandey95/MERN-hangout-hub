import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  function handleClick() {
    setShow(!show);
  }

  async function submitHandler() {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Enter all Fields",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 1000,
        isClosable: false,
        position: "top",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      history.push("/chats");
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
  }

  return (
    <VStack>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          value={email}
        ></Input>
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            value={password}
          ></Input>
          <InputRightElement>
            <Button h="2.44rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme={"blue"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>

      <Button
        variant={"solid"}
        colorScheme={"red"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={(e) => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        isLoading={loading}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
