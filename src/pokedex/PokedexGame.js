import { React, useState, useEffect } from 'react';
import axios from 'axios';
import pokemonThemeSong from '../assets/pokemon-theme-song.mp3'
import './Pokedex.css'
import Pokedex from './Pokedex';

const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokedex/2';

const PokedexGame = () => {

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
        <div className='game-container'>
            <div className='pokes1 sprites' />
            <Pokedex />
            <div className='pokes2 sprites' />
        </div>
    );
}

export default PokedexGame;
