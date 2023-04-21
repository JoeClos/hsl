import {
  FormGroup,
  FormControl,
  InputLabel,
  Input,
  Button,
  styled,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addStation } from '../service/api';
import { useState } from "react";

const initialValue = {
    fid: '',
    id: '',
    nimi: '',
    namn: '',
    name: '',
    osoite: '',
    address: '',
    kaupunki: '',
    stad: '',
    operaattor: '',
    kapasiteet: '',
    x: '',
    y: ''
};

const Container = styled(FormGroup)`
    width: 50%;
    margin: 5% 0 0 25%;
    & > div {
        margin-top: 20px;
`;

const AddStation = () => {
  const [station, setStation] = useState(initialValue);
  const {
    fid,
    id,
    nimi,
    namn,
    name,
    osoite,
    address,
    kaupunki,
    stad,
    operaattor,
    kapasiteet,
    x,
    y,
  } = station;

  let navigate = useNavigate();

  const onValueChange = (e) => {
    setStation({ ...station, [e.target.name]: e.target.value });
  };

  const addStationDetails = async () => {
    await addStation(station);
    navigate("/stations");
  };

  return (
    <Container>
      <Typography variant="h4" color="#1976D2">Add Station</Typography>
      <FormControl>
        <InputLabel htmlFor="my-input">FID</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="fid"
          value={fid}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">ID</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="id"
          value={id}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">NIMI</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="nimi"
          value={nimi}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">NAMN</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="namn"
          value={namn}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">NAME</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="name"
          value={name}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">OSOITE</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="osoite"
          value={osoite}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">ADDRESS</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="address"
          value={address}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">KAUPUNKI</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="kaupunki"
          value={kaupunki}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">STAD</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="stad"
          value={stad}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">OPERAATTOR</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="operaattor"
          value={operaattor}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">KAPASITEET</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="kapasiteet"
          value={kapasiteet}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">X</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="x"
          value={x}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Y</InputLabel>
        <Input
          onChange={(e) => onValueChange(e)}
          name="y"
          value={y}
          id="my-input"
        />
      </FormControl>
      <FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={() => addStationDetails()}
        >
          Add Station
        </Button>
      </FormControl>
    </Container>
  );
};

export default AddStation;
