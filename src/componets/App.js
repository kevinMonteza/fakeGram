import React, { Component } from 'react';
import './css/App.css';
import firebase from 'firebase';
import FileUpload from './FileUpload';
class App extends Component {
    constructor(){
        super();
        this.state = {
            user:null,
            pictures:[],
            uploadValue:0,
        };
        this.handleRenderLoginButton = this.handleRenderLoginButton.bind(this);
        this.handleLogin=this.handleLogin.bind(this);
        this.handleLogout= this.handleLogout.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }
    componentWillMount(){
        console.log("Willmount");
        firebase.auth().onAuthStateChanged(user =>{
            this.setState({user}) // -> this.setState({ user:user}):
        });
        firebase.database().ref('pictures').on('child_added',snapshot =>{
            console.log(snapshot.val());
            if(snapshot.val().displayName === this.state.user.displayName){
                this.setState({
                    pictures: this.state.pictures.concat(snapshot.val())
                })
            }
        })
    }
    handleLogin(){
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
        .then(result=>{console.log(`Bienvenido ${result.user.email}`)})
        .catch(err=>console.error(`Error ${err}`));
    }
    handleRenderLoginButton(){
        //Si el usuario esta logueado
        if(this.state.user){
            return(
                <div>
                    <img src={this.state.user.photoUrl} alt={this.state.user.displayName} />
                    <p>Hola {this.state.user.displayName}</p>
                    <button onClick={this.handleLogout}>Salir</button>

                    <FileUpload onUpload={this.handleUpload} uploadValue={this.state.uploadValue}/>
                    {this.state.pictures.map((picture,key)=>(
                        <figure key={key}>
                            <img width="120" src={picture.image} alt=""/><br/>
                            <figcaption>
                                <img width="120" src={picture.photoURL} alt=""/><br/>
                                <span>{picture.displayName}</span>
                            </figcaption>

                        </figure>
                    )).reverse()}
                </div>
            )
        }else {
            return (<button onClick ={this.handleLogin}>Login with google</button>)
        }
    }
    handleLogout(){
        firebase.auth().signOut()
            .then(result=>{console.log(` ${result.user.email} Ha salido`)})
            .catch(err=>console.error(`Error ${err}`));
    }
    handleUpload(event){
        const file = event.target.files[0];
        const storageRef = firebase.storage().ref(`fotos/${file.name}`);
        const task = storageRef.put(file);

        task.on('state_changed',snapshot=>{
                let percentage = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                console.log(percentage);
                this.setState({
                    uploadValue:percentage
                })
            },error=>console.error(error.message),
            ()=>{
                task.snapshot.ref.getDownloadURL()
                    .then((downloadURL)=> {
                        console.log('File available at', downloadURL);
                        let record = {
                            photoURL:this.state.user.photoURL,
                            displayName:this.state.user.displayName,
                            image:downloadURL
                        };
                        const dbRef = firebase.database().ref('pictures');
                        const newPicture = dbRef.push();
                        newPicture.set(record);
                    });

            });
    };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <section>
           <h2>Pseudogram</h2>
            {this.handleRenderLoginButton()}
        </section>

      </div>
    );
  }
}

export default App;
