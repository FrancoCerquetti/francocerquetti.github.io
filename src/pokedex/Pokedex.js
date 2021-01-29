import { React, useState } from 'react';
import pokedexImg from '../assets/Pokedex.png';
import { Button, TextField } from '@material-ui/core';
import './Pokedex.css';

const Pokedex = ({ start, correctAnswer, userGuess, setUserGuess, guessButtonDisabled, nextPokemon, score }) => {

    const [started, setStarted] = useState(false);
    const currentPokemon = undefined;

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

    return (
        <div className='pokedex-container' >
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