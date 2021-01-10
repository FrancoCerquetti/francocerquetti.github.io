import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ScoreIcon from '@material-ui/icons/Score';
import pokedexImg from './Pokedex.png'
import './Pokedex.css'

const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokedex/2';

const Pokedex = () => {

    const [pokemons, setPokemons] = useState([]);
    const [currentPokemon, setCurrentPokemon] = useState();
    const [userGuess, setUserGuess] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState();
    const [guessButtonDisabled, setGuessButtonDisabled] = useState();
    const [score, setScore] = useState(0);
    // const [loading, setLoading] = useState(false);

    const textFieldStyle = {
        position: 'absolute',
        width: '200px',
        top: '300px',
        left: useMediaQuery('(min-width: 1440px) and (max-width: 1919px)') ? '840px' : '1080px',
    }
    
    const buttonStyle = {
        position: 'absolute',
        top: '405px',
        left: useMediaQuery('(min-width: 1440px) and (max-width: 1919px)') ? '905px' : '1145px',
    }
    
    const iconStyle = {
        position: 'absolute',
        top: '373px',
        left: useMediaQuery('(min-width: 1440px) and (max-width: 1919px)') ? '895px' : '1135px',
    }

    const changePokemon = pokemonArray => {
        const max = pokemonArray.length;
        const random = Math.random() * max;
        const idx = Math.floor(random);
        setCurrentPokemon(pokemonArray[idx]);
        setUserGuess('');
        // setLoading(true);
    }

    const nextPokemon = () => {
        changePokemon(pokemons);
        setScore(score + 1);
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
        <div class='container'>
            { /* <CircularProgress style={{ visibility: loading ? '' : 'hidden' }} /> */ }
            <img src={pokedexImg} alt='Pokedex' className='pokedex' />
            { currentPokemon ?
                <img src={currentPokemon.sprite} alt={ currentPokemon.name } className='pokemon' /*onLoad={() => setLoading(false)}*/ />
                : null
            }
            <TextField style={textFieldStyle} value={userGuess} error={!correctAnswer} onChange={ e => setUserGuess(e.target.value) } />
            <Button 
                style={buttonStyle}
                variant='contained'
                disabled={guessButtonDisabled}
                color='primary'
                onClick={ () => nextPokemon() } >
                    Next!
            </Button>
            <ScoreIcon style={iconStyle} />
            <label className='score'>Score: {score}</label>
        </div>
    );
}

export default Pokedex;