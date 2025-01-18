import React from 'react';
import "./styles/app.scss";
import SettingBar from "./components/SettingBar1";
import Toolbar from "./components/Toolbar1";
import Canvas from "./components/Canvas1";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path='/:id' element={<><Toolbar /> <SettingBar /> <Canvas /></>} />
                    <Route path='*' element={<Navigate to={`f${(+new Date).toString(16)}`} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
