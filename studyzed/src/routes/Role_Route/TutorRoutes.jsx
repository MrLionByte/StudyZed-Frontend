import { Routes, Route } from 'react-router-dom'



export default function StudentRoutes () {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
        </Routes>
    );
};