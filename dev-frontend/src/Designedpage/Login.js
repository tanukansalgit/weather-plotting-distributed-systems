import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ClipLoader from "react-spinners/ClipLoader";
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import axios from 'axios';
import { baseUrl } from '../baseurls';
import { LoginContext } from '../Context/LoginContext';
import React, {useEffect, useState} from 'react';
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import validator from 'validator'




const theme = createTheme();

export default function SignIn() {
  
const {auth, setAuth} = useContext(LoginContext)
const {token, setToken} = useContext(LoginContext)
const {username, setUsername} = useContext(LoginContext)
const {userId, setUserId} = useContext(LoginContext)
const [tokenState, setTokenState] = useState("")
const [loading, setLoading] = useState(false)

let navigate = useNavigate(); 

useEffect(()=>{
  console.log("Token Value", token)
},[token]);

const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    var email = data.get('email')
    var password = data.get('password')
        
    if (!validator.isEmail(email) || password.length < 4) {
        setLoading(false)
        alert('Email or password is not correct! \n- Email format (xyz@domain.com)\n- password length should be >4')
    }
    else{  
        const input = { email, password };
        console.log(input)
        await axios.post(baseUrl+'/login', {email, password }, { headers: { "authorization" : 'token' , 'Access-Control-Allow-Origin': "*"} })
        .then((res) => {  
            setLoading(false)
            console.log("this is Data : ", res);

            if(res.data.statusCode === "userNotExists"){
                setLoading(false)
                alert("SIGN UP PLEASE")
            }else if (res.data.status){
    
                setAuth(true);
                setToken(res.data.response.result.token)

                console.log("Token Value set to: ", token)                
                console.log("res.data.response.result ID: ",res.data.response.result)

                setUserId(String(res.data.response.result._id))
                
                console.log("User Id: ",userId)
                
                setUsername(email)
                navigate("/profiles")

            }
            else{
                setLoading(false)
                alert("User Not Authenticated")
            }
        })
        .catch(err =>{
            console.log("Error is : ", err)
            navigate("/error")
        });
    }
};


return (

    <ThemeProvider theme={theme}>
      
        <Container component="main" maxWidth="xs">
            <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                      Sign in
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      disabled= {loading}
                    >
                    Sign In
                    </Button>
                
                
                    <Grid container>
                      <Grid item>
                        <Link href="/register" variant="body2">
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
              
                  {loading? <ClipLoader size={50} loading={loading}/>:null}
              </Box>
          </Container>
    </ThemeProvider>
  );
}