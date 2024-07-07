
import "../../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import * as cornerstone from "cornerstone-core";
import { Link } from "react-router-dom";
import axios from 'axios';
import editLogo from '../../assets/edit.png'
import cornerstoneTools from 'cornerstone-tools';

function Sidebar({rowData, reportImages , saveAnnotations}) {

    // Component for the editable span
    const EditableSpan = ({ initialValue, onSave, c }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);

    const handleSave = () => {
        setIsEditing(false);
        onSave(value); // Send the value to the parent component
    };

    return (
        <span className="result">
        {isEditing ? (
            <select id="classification" onChange={(e) => setValue(e.target.value)} onBlur={handleSave} value={value}>
                <option value="Normal">Normal</option>
                <option value="Benign">Benign</option>
                <option value="Malignant">Malignant</option>
            </select>
        ) : (
            <span style={{color:c}} onClick={() => setIsEditing(true)}>{value}</span>
        )}
        </span>
    );
    };

    const [text, setText] = useState('');
    const navigate= useNavigate();
    const location = useLocation();
    const [rightBreastText, setRightBreastText] = useState("");
    const [leftBreastText, setLeftBreastText] = useState("");
    const [leftBirads, setLeftBirads] = useState("3");
    const [rightBirads, setRightBirads] = useState("3");
    const [cesmClicked, setCesmClicked] = useState(false)

    useEffect(() => {
        setLeftBreastText(
            rowData.left_breast ? "Malignant" : "Benign"
        );

        setRightBreastText(
            rowData.right_breast ? "Malignant" : "Benign"
        );

        try {
            if (location.state.cesmClicked != null) { // This checks for both null and undefined
                setCesmClicked(true)
            } 
        } catch (error) {
        }

        console.log("######################", rowData.CEM)

    }, []);


    const handleChange = (event) => {
        setText(event.target.value);
        };

    const handleLeftSpanChange = (newValue) => {
        setLeftBreastText(newValue);
    };

    const handleRightSpanChange = (newValue) => {
        setRightBreastText(newValue);
    };

    

    const handleClick = () => {
        // Navigate to another page and pass row data as route state
        console.log("########### erkb ray7en el report ############", reportImages)
        
        const annotations = cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();
        console.log(annotations)
        saveAnnotations(annotations);


        // const serializablePixelData = JSON.stringify({
        //     data: reportImages
        // });

        navigate('/report', { state: { rowData, text, leftBreastText, rightBreastText, leftBirads, rightBirads ,reportImages} });
      };

    const handleCESMClick = () => {

        navigate('/loading', { state: { from: '/viewer', rowData: rowData } });
        
        axios.get(`http://localhost:8000/examlist/generate-cesm/${rowData.Study_Id}`)
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    return (
        <div className="sidebarinput">

            <aside>
                <div className="container-paragraph">
                <h2>AI Suggestion</h2>
                <div className="ai">
                    <h3 className="tiny-paragraph">
                        Left Breast: 
                        {rowData.left_breast ? 
                        <EditableSpan initialValue={leftBreastText} onSave={handleLeftSpanChange} c="red"/>
                        : 
                        <EditableSpan initialValue={leftBreastText} onSave={handleLeftSpanChange} c="greenyellow"/> 
                        }
                    </h3>
                    <img className="edit-logo" src={editLogo} alt="edit"/>
                </div>
                <div className="ai">
                    <h3 className="tiny-paragraph">
                        Right Breast :
                        {rowData.right_breast ? 
                        <EditableSpan initialValue={rightBreastText} onSave={handleRightSpanChange} c="red"/>
                        : 
                        <EditableSpan initialValue={rightBreastText} onSave={handleRightSpanChange} c="greenyellow"/>
                        }

                    </h3>
                    <img className="edit-logo" src={editLogo} alt="edit"/>
                </div>

                <h2 className="birads">BI-RADS Assessment</h2>

                <div className="bi-rads">
                    <h3 className="tiny-paragraph">
                        Left Breast: 
                        <select id="left-birads" onChange={(e) => setLeftBirads(e.target.value)} value={leftBirads}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4A">4A</option>
                            <option value="4B">4B</option>
                            <option value="4C">4C</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </h3>
                    
                    <h3 className="tiny-paragraph">
                        Right Breast: 
                        <select id="right-birads" onChange={(e) => setRightBirads(e.target.value)} value={rightBirads}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4A">4A</option>
                            <option value="4B">4B</option>
                            <option value="4C">4C</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </h3>
                </div>

                </div>


                <form>
                    <textarea type="text" className="styled-input" placeholder="Add comment" value={text} onChange={handleChange}/>
                    <button type="submit" className="submit-button" onClick={handleClick}>Generate Report</button>
                    {/* <Link to="/report" state={{rowData, text, leftBreastText, rightBreastText, leftBirads, rightBirads ,reportImages}}> dos kosom hena</Link> */}
                    <button type="button" className="call-function-button" hidden={rowData.CEM || cesmClicked} onClick={handleCESMClick}>Generate CESM</button>
                </form>
            </aside>

        </div>

	);
}

export default Sidebar;
