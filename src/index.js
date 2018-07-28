import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './componets/App';
import registerServiceWorker from './registerServiceWorker';
import Firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAJ7AVIkkbLP8EReY-MCkBKzdVJDLBtGZw",
    authDomain: "pseudogram-8c2be.firebaseapp.com",
    databaseURL: "https://pseudogram-8c2be.firebaseio.com",
    projectId: "pseudogram-8c2be",
    storageBucket: "pseudogram-8c2be.appspot.com",
    messagingSenderId: "500535504564"
};
Firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
