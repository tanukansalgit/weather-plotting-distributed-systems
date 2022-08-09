import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import TimePicker from '@mui/lab/TimePicker';
import DatePicker from '@mui/lab/DatePicker';
import ClipLoader from "react-spinners/ClipLoader";

import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Stack from '@mui/material/Stack';
import { baseUrl } from '../baseurls';

import axios from 'axios';

import { useContext, useState } from 'react';
import { LoginContext } from '../Context/LoginContext';
import Select from 'react-select';

import { useNavigate } from "react-router-dom";

function validateInputs(year, month, day, hour, minute, second, station) {
  console.log("Hey I am new one ", year, month, day, hour, minute, second, station)
  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute) || isNaN(second)) {
    return false
  }
  if (!station)
    return false


  var today = new Date().getFullYear();
  console.log("-----", today)
  if (year > 2022) {
    return false
  }
  return true
}

function PricingContent() {

  const { auth, setAuth } = useContext(LoginContext)
  const { token, setToken } = useContext(LoginContext)
  const { username, setUsername } = useContext(LoginContext)
  const { userId, setUserId } = useContext(LoginContext)
  const [loading, setLoading] = useState(false)
  const [nexrad, setNexRad] = useState(true)
  const [merra, setMerra] = useState(false)
  const { defaultDate, setDefaultDate } = useContext(LoginContext);

  const { selectRadar, setSelectRadar } = useContext(LoginContext);
  const { logs, setLogs } = useContext(LoginContext);


  let navigate = useNavigate();

  console.log('Radar value is :', selectRadar)
  console.log('Default date  in profile : ', defaultDate)

  const options = [
    { label: 'KABR' },
    { label: 'KABX' },
    { label: 'KAMA' },
    { label: 'PAHG' },
    { label: 'PGUA' },
    { label: 'KFFC' },
    { label: 'KBBX' },
    { label: 'KAKQ' },
  ];

  const getWeather = (event) => {

    setLoading(true)
    event.preventDefault();

    if (defaultDate === "" || defaultDate === null) {
      setLoading(false)
      alert("Please enter valid input")
      return
    }

    console.log('Clieck on weather: ', defaultDate)
    var month = String(defaultDate.getMonth() + 1)
    var day = String(defaultDate.getDate())
    var hour = String(defaultDate.getHours())
    var minute = String(defaultDate.getMinutes())
    var second = String(defaultDate.getSeconds())
    var year = String(defaultDate.getFullYear())
    var station = selectRadar.label
    var authToken = token

    console.log('radar inside get weatther is: ', station)

    if (nexrad) {
      if (validateInputs(year, month, day, hour, minute, second, station)) {
        axios.post(baseUrl + '/plotting', { year, month, day, hour, minute, second, station, authToken }, { headers: { "authToken": String(authToken), 'Access-Control-Allow-Origin': "*" } })
          .then((res) => {
            setLoading(false)
            console.log("this is Data : ", res);
            window.open(res.data)
            console.log("Image source : ", res.data)
          })
          .catch(err => {
            console.log("Error is : ", err)
            navigate("/error")
          });
      }
      else {
        setLoading(false)
        alert("Incorrect format")
      }
    }
    if (merra) {

      console.log(year, month, typeof(year), typeof(month))
      if (year === '2022' && (month === '1' || month === '2')){
        if (validateInputs(year, month, day, hour, minute, second, "station")) {
          // console.log(year, month, day, hour, minute, second, station)
          console.log("Chwcking merra data")
          axios.post(baseUrl + '/plottingmerra', { year, month, day, hour, minute, second, station, authToken }, { headers: { "authToken": String(authToken), 'Access-Control-Allow-Origin': "*" } })
          .then((res) => {
          setLoading(false)
          console.log("this is Data : ", res);
            window.open(res.data)
            console.log("Image source : ", res.data)
          })
          .catch(err => {
            console.log("Error is : ", err)
            navigate("/error")
          });
          
        }
        else {
          setLoading(false)
          alert("Incorrect format")
        }
      }
      else{
        alert("Add dates within January and Februry 2022")
        setLoading(false)
      }
    }

  };

  const handleLogout = (event) => {
    setAuth(false);
    setUsername("");
    setToken("")
    setDefaultDate("")
    setSelectRadar("")
    navigate("/");

    console.log("Coming to console", defaultDate)
  };

  const getHistory = (event) => {
    setLoading(true)
    event.preventDefault()
    console.log("Profile getHistory Function.")

    axios.post(baseUrl + '/logging', { userId, token })
      .then(res => {
        setLoading(false)

        if ((res.data.response === null) || (!Array.isArray(res.data.response)) || res.data.response.length === 0) {
          alert("History deos not exists!")
        } else if (auth) {
          setLogs(res.data.response)
          navigate("/history");
        }
      })
      .catch(err => {
        console.log("Error is : ", err)
        navigate("/error")
      });

  };

  const typeClick = (type) => {
    console.log('Clicked on ', type)
    if (type === 'nexrad') {
      setMerra(false)
      setNexRad(true)
      console.log('state of nexrad is: ', nexrad)
    }
    if (type === 'merra') {
      setDefaultDate(null)
      console.log('Clicked on ', defaultDate)
      setNexRad(false)
      setMerra(true)
      console.log('state of nexrad is: ', nexrad)
    }
  }

  function onDateChange(defaultDate) {
    console.log("On change", defaultDate)
    setDefaultDate(defaultDate)
  }

  let Info;

  if (nexrad) {
    Info =
      <Container maxWidth="sm" component="main">
        <Typography variant="h9" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                disableFuture
                label="Select Date"
                openTo="year"
                views={['year', 'month', 'day']}
                value={defaultDate}
                onChange={defaultDate => onDateChange(defaultDate)}
                maxDate={new Date()}
                minDate={new Date('1990-01-31')}
                renderInput={(params) => <TextField {...params} />}
              />

              <TimePicker
                ampm={false}
                openTo="hours"
                views={['hours', 'minutes', 'seconds']}
                inputFormat="HH:mm:ss"
                mask="__:__:__"
                label="Select time"
                value={defaultDate}
                onChange={defaultDate => onDateChange(defaultDate)}
                renderInput={(params) => <TextField {...params} />}
              />

            </Stack>
            <br />
            {loading ? null : <Select
              label={selectRadar}
              value={selectRadar}
              options={options}
              onChange={selectRadar => setSelectRadar(selectRadar)}
            >
            </Select>}
            <br />

            <Button fullWidth onClick={getWeather} disabled={loading}> Get Weather Forecast </Button>

          </LocalizationProvider>

        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)' }}>
          <br />
          <Button fullWidth onClick={getHistory} disabled={loading}> User history </Button>
        </Box>

        <div style={{ marginLeft: 255 }}>
          {loading ? <ClipLoader size={50} loading={loading} /> : null}
        </div>
      </Container>
  }
  else if (merra) {
    Info =
      <Container maxWidth="sm" component="main">
        <Typography variant="h9" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                disableFuture
                label="Select Date"
                openTo="year"
                views={['year', 'month', 'day']}
                defaultValue=""
                value={defaultDate}
                onChange={defaultDate => onDateChange(defaultDate)}
                maxDate={new Date('2022-02-28')}
                minDate={new Date('2022-01-02')}
                renderInput={(params) => <TextField {...params} />}
              />

              <TimePicker
                ampm={false}
                openTo="hours"
                views={['hours', 'minutes', 'seconds']}
                inputFormat="HH:mm:ss"
                mask="__:__:__"
                label="Select time"
                defaultValue=""
                value={defaultDate}
                onChange={defaultDate => onDateChange(defaultDate)}
                renderInput={(params) => <TextField {...params} />}
              />
            
            </Stack>
            <br />
            {/* {loading ? null : <Select
              label={selectRadar}
              value={selectRadar}
              options={options}
              onChange={selectRadar => setSelectRadar(selectRadar)}
            >
            </Select>} */}
            <br />

            <Button fullWidth onClick={getWeather} disabled={loading}> Get Weather Forecast </Button>

          </LocalizationProvider>

        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)' }}>
          <br />
          <Button fullWidth onClick={getHistory} disabled={loading}> User history </Button>
        </Box>

        <div style={{ marginLeft: 255 }}>
          {loading ? <ClipLoader size={50} loading={loading} /> : null}
        </div>
      </Container>
  }

  return (
    <React.Fragment>


      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />

      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {username}
          </Typography>

          <Button onClick={handleLogout} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 4, pb: 1 }}>
        <Typography
          component="h6"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Select your choice!
        </Typography>
      </Container>

      <div style={{ display: "flex", justifyContent: 'center', marginBottom: 30 }}>
        <Button
          variant={nexrad ? "contained" : "outlined"}
          onClick={() => typeClick('nexrad')}>NEXRAD-Data</Button>
        <Button
          variant={merra ? "contained" : "outlined"}
          onClick={() => typeClick('merra')}>Merra-Data</Button>
      </div>

      {Info}

      {/* <Container maxWidth="sm" component="main">
        <Typography variant="h9" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                disableFuture
                label="Select Date"
                openTo="year"
                views={['year', 'month', 'day']}
                value={defaultDate}
                onChange={defaultDate => onDateChange(defaultDate)}
                maxDate={new Date()}
                minDate={new Date('2022-03-24')}
                renderInput={(params) => <TextField {...params} />}
              />

              <TimePicker
                ampm={false}
                openTo="hours"
                views={['hours', 'minutes', 'seconds']}
                inputFormat="HH:mm:ss"
                mask="__:__:__"
                label="Select time"
                value={defaultDate}
                onChange={defaultDate => onDateChange(defaultDate)}
                renderInput={(params) => <TextField {...params} />}
              />

            </Stack>
            <br />
            {loading ? null : <Select
              label={selectRadar}
              value={selectRadar}
              options={options}
              onChange={selectRadar => setSelectRadar(selectRadar)}
            >
            </Select>}
            <br />

            <Button fullWidth onClick={getWeather} disabled={loading}> Get Weather Forecast </Button>

          </LocalizationProvider>

        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)' }}>
          <br />
          <Button fullWidth onClick={getHistory} disabled={loading}> User history </Button>
        </Box>

        <div style={{ marginLeft: 255 }}>
          {loading ? <ClipLoader size={50} loading={loading} /> : null}
        </div>
      </Container> */}
    </React.Fragment>
  );
}

export default function Pricing() {
  return <PricingContent />;
}