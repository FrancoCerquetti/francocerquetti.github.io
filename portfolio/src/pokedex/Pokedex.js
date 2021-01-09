import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, CircularProgress } from '@material-ui/core';

const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokedex/2';

const Pokedex = () => {

    const [pokemons, setPokemons] = useState([]);
    const [currentPokemon, setCurrentPokemon] = useState();
    const [userGuess, setUserGuess] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState();
    const [guessButtonDisabled, setGuessButtonDisabled] = useState();
    // const [loading, setLoading] = useState(false);

    const changePokemon = pokemonArray => {
        const max = pokemonArray.length;
        const random = Math.random() * max;
        const idx = Math.floor(random);
        setCurrentPokemon(pokemonArray[idx]);
        setUserGuess('');
        // setLoading(true);
    }

    // Fetch pokedex data, only runs at the component mounting
    useEffect(() => {
        const fetchData = async () => {
            const pokedex = await axios.get(POKEDEX_URL);
            const entries = pokedex.data.pokemon_entries;
            const pokemonsData = entries.map(entry => ({
                id: entry.entry_number,
                name: entry.pokemon_species.name.toUpperCase(),
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${entry.entry_number}.png`
            }));
            setPokemons(pokemonsData);
            changePokemon(pokemonsData);
        }
        fetchData();
    }, []);

    // Validate user guess
    useEffect(() => {
        const validateUserGuess = () => {
            if (!currentPokemon) {
                return false;
            } else {
                return userGuess.toUpperCase() === currentPokemon.name;
            }
        }

        const result = validateUserGuess();
        setCorrectAnswer(result);
        setGuessButtonDisabled(!result);
    }, [userGuess, currentPokemon]);

    return (
        <div>
            { /* <CircularProgress style={{ visibility: loading ? '' : 'hidden' }} /> */ }
            { currentPokemon ?
                <img src={currentPokemon.sprite} alt={ currentPokemon.name } /*onLoad={() => setLoading(false)}*/ />
                : null
            }
            <TextField id="standard-basic" value={userGuess} error={!correctAnswer} onChange={ e => setUserGuess(e.target.value) } />
            <Button variant="contained" disabled={guessButtonDisabled} onClick={ () => changePokemon(pokemons) } >Next!</Button>
        </div>
    );
}

export default Pokedex;