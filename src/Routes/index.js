import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Signin from "../Pages/Signin";
import Signup from "../Pages/Signup";

const Private = ({ Item }) => {
    const signed = false;

    return signed > 0 ? <Item /> : <Signin />
}

const RoutesApp = () => {
    return (
        <BrowserRouter>
            <Fragment>
                <Routes>
                    <Route exact path="/home" element={<Private Item={Home} />} />
                    <Route path="/" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<Signin />} />
                </Routes>
            </Fragment>
        </BrowserRouter>
    );
};

export default RoutesApp;