import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";

import {LoginContext} from '../Context/LoginContext';


export default function BasicCard(props) {
    console.log("PROPS IN CARD: ",props)

    const {defaultDate, setDefaultDate} = React.useContext(LoginContext);
    const { selectRadar, setSelectRadar} = React.useContext(LoginContext);

    var navigate = useNavigate();
      
    var logDetailsJSON = JSON.parse(props.logDetails)
    console.log(logDetailsJSON)

    var date = new Date(logDetailsJSON.year, logDetailsJSON.month, logDetailsJSON.day, logDetailsJSON.hour, logDetailsJSON.minute, logDetailsJSON.second);
    var resultDate = date.toLocaleDateString("en-US", { // you can use undefined as first argument
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }, { hour12: false });


    const options = {label: logDetailsJSON.station }
    var convertedDate = new Date(resultDate)

    console.log(resultDate);


    function seeThePlot(){
      // <a href={}></a>
      window.open(props.url)
      navigate("/Profiles")
  }

    function editButtonClickFunction(){
        console.log("Edit Button Pressed." , props.mapId, logDetailsJSON.station)

        setDefaultDate(convertedDate)
        setSelectRadar(options)

        navigate("/Profiles")
    }


    return (
        <Card sx={{ minWidth: 100 }}>
            <CardContent>
                <Typography component="div">
                      <CardActions>
                      <Button size="small"
                        onClick = {seeThePlot}
                            
                      >See the plot
                      </Button>
                  </CardActions>
                </Typography>
                
                <Typography>{resultDate}</Typography>
                
                <Typography>{logDetailsJSON.station}</Typography>
                
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3}>
                    </Stack>
                </LocalizationProvider>
            </CardContent>
            
            <CardActions>
                <Button size="small"
                  onClick = {editButtonClickFunction}
                      
                >Edit
                </Button>
            </CardActions>
        </Card>
    );
}
