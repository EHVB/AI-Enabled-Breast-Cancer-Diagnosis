import ReportPDF from '../components/viewer/ReportPDF';
import { PDFViewer } from '@react-pdf/renderer';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

const PDF = () => {
    const location = useLocation();
    const [info, SetInfo] = useState({
        patientName : "",
        patientId : "",
        patientAge: "",
        doctor: "",
        examDate: "",

    });

    const [text, setText] = useState('');
    const [rightBreastText, setRightBreastText] = useState("");
    const [leftBreastText, setLeftBreastText] = useState("");
    const [leftBirads, setLeftBirads] = useState("");
    const [rightBirads, setRightBirads] = useState("");
    const [images, setImages] = useState({})

    
    useEffect(() => {
        const {rowData} = location.state;
        setLeftBreastText(location.state.leftBreastText)
        setRightBreastText(location.state.rightBreastText)
        setText(location.state.text)
        setLeftBirads(location.state.leftBirads)
        setRightBirads(location.state.rightBirads)
        setImages(location.state.reportImages)

        console.log("######################## in report ######################", location.state.reportImages)

        SetInfo({
            patientName : rowData.Patient_name,
            patientId : rowData.Patient_id,
            patientAge: rowData.age,
            doctor: rowData.Doctor_name,
            examDate: rowData.Date_Study,
        })
    }, []);
    

    return (
        <PDFViewer style={{ width: '100%', height: '700px' }}> 
            <ReportPDF info = {info} comment={text} leftBreast={leftBreastText} rightBreast={rightBreastText} leftBirads={leftBirads} rightBirads={rightBirads} images={images}/> 
        </PDFViewer>
    );
}
 
export default PDF;