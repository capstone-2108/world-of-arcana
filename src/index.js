import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import store from '../client/store';
import App from '../client/App';
import Phaser from "phaser";
import config from './config/config'

import MMOScene from './scene/MMOScene';
import MainScene from './scene/MainScene';

export default class Game extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super(config);
    this.scene.add('PlayScene', MMOScene);
    this.scene.add('MainScene', MainScene);
    //starts the game with the main scene
    this.scene.start('MainScene');
  }
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter >
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);
