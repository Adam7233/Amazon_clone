import React,{useEffect} from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router ,Switch,Route} from 'react-router-dom' 
import Checkout from './Checkout';
import Login from './Login';
import Payment from './Payment'
import {auth} from './Firebase'
import { useStateValue } from './StateProvider';
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js';
import Order from './Order';
import Footer from './Footer';

const promise = loadStripe('pk_test_51JhFGdHEwLBi2SUWttxN9Klyu6m51l8uYmupCLBFmVvtfEYetnDXzgdqqxMg9qG2YzQ26zosvUo1O5SXjejYBJhA00Aq3fuNs1');

function App() {
  const [,dispatch] = useStateValue();
  useEffect(() => {
    auth.onAuthStateChanged((authUser)=>{
       console.log('the user is',authUser);
       if(authUser){
        dispatch({
          type:'SET_USER',
          user:authUser
        })
       }else{
        dispatch({
          type:'SET_USER',
          user:null
        })
       }
    })
  }, [])
  return (
    <Router>
    <div className="App">
      <Switch>
        <Route path='/orders'>
          <Header />
          <Order />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/checkout'>
          <Header/>
          <Checkout />
        </Route>
        <Route path='/payment'>
          <Header/>
          <Elements stripe={promise}>
            <Payment/>
          </Elements>
        </Route>
        <Route path='/'>
          <Header/>
          <Home/>
          <Footer />
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
