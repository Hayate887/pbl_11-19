import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
  
  import supabase from "@/libs/supabase";
  
  export interface AuthFormProps {
    isLogin: boolean;
    onClose: () => void;
  }
  
  export function AuthForm({ isLogin, onClose }: AuthFormProps) {
    const router = useRouter();
    const toast = useToast();
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
    async function handleSignIn() {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      setLoading(false);
  
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        return;
      }
  
      onClose();
      router.push("/auth");
    }
  
    async function handleSignUp() {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: username,
          },
        },
      });
      setLoading(false);
  
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        return;
      }
  
      onClose();
      router.push("/auth");
    }
  
    return isLogin ? (
      <>
        <FormControl isInvalid={!!email && !emailRegex.test(email)}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@sample.com"
          />
          {!email || emailRegex.test(email) ? (
            <FormHelperText>Enter your email</FormHelperText>
          ) : (
            <FormErrorMessage>Format is invalid</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mt="4" isInvalid={!!password && password.length < 8}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {!password || password.length >= 8 ? (
            <FormHelperText>Enter the password</FormHelperText>
          ) : (
            <FormErrorMessage>
              Password must be at least 8 characters
            </FormErrorMessage>
          )}
        </FormControl>
        <Button
          mt="4"
          w="100%"
          colorScheme="green"
          onClick={handleSignIn}
          isDisabled={
            !email || !password || !emailRegex.test(email) || password.length < 8
          }
          isLoading={loading}
        >
          Sign in
        </Button>
      </>
    ) : (
      <>
        <FormControl isInvalid={!!username && username.length < 1}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <FormHelperText>Enter your username</FormHelperText>
        </FormControl>
        <FormControl mt="4" isInvalid={!!email && !emailRegex.test(email)}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@sample.com"
          />
          {!email || emailRegex.test(email) ? (
            <FormHelperText>Enter your email</FormHelperText>
          ) : (
            <FormErrorMessage>Format is invalid</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mt="4" isInvalid={!!password && password.length < 8}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {!password || password.length >= 8 ? (
            <FormHelperText>Enter the password</FormHelperText>
          ) : (
            <FormErrorMessage>
              Password must be at least 8 characters
            </FormErrorMessage>
          )}
        </FormControl>
        <Button
          mt="4"
          w="100%"
          colorScheme="blue"
          onClick={handleSignUp}
          isDisabled={
            !username ||
            !email ||
            !password ||
            username.length < 1 ||
            !emailRegex.test(email) ||
            password.length < 8
          }
          isLoading={loading}
        >
          Sign up
        </Button>
      </>
    );
  }