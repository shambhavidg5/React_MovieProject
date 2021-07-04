import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./home/Home";
import Details from './details/Details';
import BookShow from './bookshow/BookShow';
import Confirmation from './confirmation/Confirmation';

const Controller = () => {
    const baseUrl = "/api/v1/";
    return(
        <Router>
            <div className="controller">
                <Route exact path="/" render = {(props) => <Home {...props} baseUrl = {baseUrl} />} />
                <Route exact path="/movie/:id" render = {(props) => <Details {...props} baseUrl = {baseUrl} />} />
                <Route exact path="/bookshow/:id" render = {(props) => <BookShow {...props} baseUrl = {baseUrl} />} />
                <Route exact path="/confirm/:id" render = {(props) => <Confirmation {...props} baseUrl = {baseUrl} />} />
            </div>
        </Router>
    );
}

export default Controller;
