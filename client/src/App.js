import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar/navigation';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <Route path="/cart" exact render={()=><h1>cart</h1>}/>
          <Route path="/product/:id" exact render={()=><h1>product</h1>}/>
          <Route path="/user" exact render={()=><h1>user</h1>}/>
          <Route path="/" exact render={()=><h1>products</h1>}/>
          <Route path="*" render={()=><h1>error</h1>}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
export default  App;