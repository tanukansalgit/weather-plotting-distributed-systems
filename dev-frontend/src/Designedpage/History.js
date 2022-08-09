import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Card from './Card'
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useContext } from 'react';
import {LoginContext} from '../Context/LoginContext';

export default function History(props) {

    const {logs, setLogs} = useContext(LoginContext)
    const theme = createTheme();
    console.log("logs" , logs.response)
    const filteredLogs = logs.filter(e=> e.logType === "RESPONSE");

    console.log("Filtered LOGS: ", filteredLogs)

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
            <CssBaseline />
              <div style={{margin:'40px'}} >

              {filteredLogs.map((e, i) =>{
                return (
                    <Card  userId={e.userId} 
                            logIdentifier={JSON.parse(e.logIdentifier)} 
                            insertedOn={e.insertedOn} 
                            logType = {e.logType}
                            logDetails = {e.logDetails}
                            url = {JSON.parse(e.url)}
                            mapId = {i}
                            />
                );
              })}
              {logs.map((e)=>{
              })}
              </div>
          </Container>
      </ThemeProvider>
    );
}