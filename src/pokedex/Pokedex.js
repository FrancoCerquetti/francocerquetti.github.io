import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField } from '@material-ui/core';
import pokedexImg from '../assets/Pokedex.png'
import pokemonThemeSong from '../assets/pokemon-theme-song.mp3'
import './Pokedex.css'

const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokedex/2';

const Pokedex = () => {

    const [pokemons, setPokemons] = useState([]);
    const [currentPokemon, setCurrentPokemon] = useState();
    const [userGuess, setUserGuess] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState();
    const [guessButtonDisabled, setGuessButtonDisabled] = useState();
    const [score, setScore] = useState(0);
    const [started, setStarted] = useState(false);

    const themeSong = new Audio(pokemonThemeSong);
    themeSong.loop = true;
    themeSong.volume = 0.5;

    const textFieldStyle = {
        position: 'absolute',
        width: '200px',
        top: '300px',
        left: '50%',
        marginLeft: '120px'
    }
    
    const startButtonStyle = {
        position: 'absolute',
        top: '335px',
        left: '50%',
        marginLeft: '180px',
        visibility: started ? 'hidden' : 'visible'
    }

    const buttonStyle = {
        position: 'absolute',
        top: '405px',
        left: '50%',
        marginLeft: '180px'
    }

    const start = () => {
        setStarted(true);
        themeSong.play();
    }

    const changePokemon = pokemonArray => {
        const max = pokemonArray.length;
        const random = Math.random() * max;
        const idx = Math.floor(random);
        setCurrentPokemon(pokemonArray[idx]);
        setUserGuess('');
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
        <div className='container'>
            <img src={pokedexImg} alt='Pokedex' className='pokedex' />
            <Button 
                style={startButtonStyle}
                variant='contained'
                color='primary'
                onClick={ () => start() } >
                    Start!
            </Button>
            { started ?
                <div>
                    { currentPokemon ?
                        <img src={currentPokemon.sprite} alt={ currentPokemon.name } className='pokemon'/>
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
                    <img 
                        src="https://fontmeme.com/permalink/210112/acc6915a3b1c8f2927dd3d0a562bab86.png" 
                        className='score' 
                        alt="score" 
                        border="0"
                    />
                    <label className='score-points'>{score}</label>
                    <img src="https://fontmeme.com/permalink/210112/dc1f33a485097e475278d5b3fad8e30c.png" 
                        className='logo'
                        alt="pokemon-font" 
                        border="0"
                    />
                </div> : null
            }
        </div>
    );
}

export default Pokedex;