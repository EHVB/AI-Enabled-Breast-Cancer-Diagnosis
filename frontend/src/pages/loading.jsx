import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import loadingGif from '../assets/ai_loading.gif';
import '../styles/loading.css'

const Loading = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => {
            // Navigate back to the previous page after 10 seconds
            navigate(location.state.from, {state: {rowData: location.state.rowData, cesmClicked: true}});
        }, 45000);

        // Cleanup the timer if the component is unmounted
        return () => clearTimeout(timer);
    }, [navigate, location.state.from]);

    return (
        <div className="loading-page">
            <h2 className='h'>Calculating CESM...</h2>
            <img src={loadingGif} alt="Loading..." className='gif'/>
        </div>
    );
};

export default Loading;