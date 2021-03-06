import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { makeStyles, Card, Grid, Box, TextField, Button } from '@material-ui/core';
import { createPlayerCharacter } from '../store/player';

const useStyles = makeStyles(() => ({
  form: {
    height: 240,
    top: "50%",
    width: 350,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Cinzel Decorative",
    padding: 20,
    color: "#e8e5d3",
    borderRadius: "8%"
  },
  textfield: {
    "& .MuiInputBase-root": {
      // background: "linear-gradient(180deg, rgba(150,192,213,1) 0%, rgba(109,152,194,1) 100%)"
      background: "#5194b6"
    },
    marginBottom: 20,
    "& label.Mui-focused": {
      color: "#d8eaec"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#d8eaec"
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#d8eaec"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#d8eaec"
      }
    },
    marginBottom: 30,
    marginTop: 10,
  },
  btn: {
    fontFamily: "Cinzel Decorative",
    backgroundColor: "#5194b6",
    color: "#f5f3e6",
    marginTop: 10,
    "&:hover": {
      backgroundColor: "#77963f"
    }
  },
}))

const editCharacter = () => {
  const classes = useStyles();
  const character = useSelector(state => state.chosenCharacter);
  const [characterName, setCharacterName] = useState("");
  const dispatch = useDispatch();
  const history = useHistory()

  const handleSubmit = (evt) => {
    evt.preventDefault();
    dispatch(createPlayerCharacter(characterName, character, history))
  }

  return (
    <div className="selectContainer">
      <Card elevation={15} className={classes.form}>
        <Grid align="center">
          <h2>Name Your {character.name}</h2>
        </Grid>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            value={characterName}
            onChange={(evt) => {
              setCharacterName(evt.target.value)
            }}
            name="characterName"
            className={classes.textfield}
            InputLabelProps={{
              className: classes.text
            }}
            variant="outlined"
          >
          </TextField>
          <Grid align="center">
            <Button type="submit" className={classes.btn}>
              Submit
            </Button>
          </Grid>
        </Box>
      </Card>
    </div>
  )
}

export default editCharacter
