
import { useEffect, useState } from "react";
import * as cornerstone from "cornerstone-core";
import Buttons from "../components/viewer/ViewerFunctions";
import { useLocation } from "react-router-dom";
import cornerstoneTools from 'cornerstone-tools';
import axios from 'axios';
const ExameViewer = () => {
    const location = useLocation();
    const [patientInfo, setPatientInfo] = useState({
        patientName : "",
        patientId : "",
        patientAge: ""
    });

    const [rowDataG, setRowData] = useState();

    const [sourceImages, setSourceImages] = useState([]);
    const [idList, setIdList] = useState([])
    const [instances, setInstances] = useState([])
    const [annotationsdata, setAnnotations] = useState()


    useEffect(() => {
        const { rowData } = location.state;
        setRowData(rowData);

        const fetchInstances = async () => {
            try {
                const response = await fetch(`http://localhost:8000/examlist/instance-list/${rowData.Study_Id}/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
            
                setIdList(data);
            } catch (error) {
                console.error('Error fetching instances:', error);
            }
        };


        const fetchAnnotations = async () => {

            axios.get(`http://localhost:8000/dicomViewer/getAnnotations/${rowData.Study_Id}/`)
                .then(response => {
                    var data = response.data
                    console.log(data.annotations)
                    setAnnotations(data.annotations);
                    console.log(annotationsdata)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }

        fetchInstances();
        fetchAnnotations();

        setPatientInfo({
            patientName: rowData.Patient_name,
            patientId: rowData.Patient_id,
            patientAge: rowData.age,
            Study_Id: rowData.Study_Id,
        });
    }, []);

    useEffect(() => {
        if (idList.length === 0) return;

        const order = [
            { type: "D", laterality: "R", view: "MLO" },
            { type: "D", laterality: "L", view: "MLO" },
            { type: "D", laterality: "R", view: "CC" },
            { type: "D", laterality: "L", view: "CC" },
            { type: "C", laterality: "R", view: "MLO" },
            { type: "C", laterality: "L", view: "MLO" },
            { type: "C", laterality: "R", view: "CC" },
            { type: "C", laterality: "L", view: "CC" },
        ];

        const urls = order.map(o => {
            const instance = idList.find(i => i.Type === o.type && i.laterality === o.laterality && i.view === o.view);
            return instance ? `wadouri:http://localhost:8042/instances/${instance.instance_id}/file` : null;
        }).filter(url => url !== null);

        setInstances(urls);

        async function processItems(items) {
            const loadedImages = [];
            for (let i = 0; i < items.length; i++) {
                try {
                    let img = await cornerstone.loadAndCacheImage(items[i]);
                    loadedImages.push(img);

                    // const instanceId = getInstanceIdFromUrl(items[i]);
                    // console.log("annotations:", annotationsdata)
                    // const imageAnnotations = annotationsdata.filter(annotation => annotation.instance_id === instanceId);
            
                    // // Apply the annotations to the image
                    // applyAnnotationsToImage(img, imageAnnotations);

                } catch (error) {
                    console.error("Error loading image:", error);
                }
            }
            setSourceImages(loadedImages);
        }


//     const getInstanceIdFromUrl = (url) => {
//     const regex = /instances\/(.*?)\/file/;
//     const matches = url.match(regex);
//     return matches ? matches[1] : null;
// };

// const applyAnnotationsToImage = (image, annotations) => {
//     annotations.forEach(annotation => {
//         const toolData = cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();
//         const imageId = image.imageId;

//         if (!toolData[imageId]) {
//             toolData[imageId] = {};
//         }

//         if (!toolData[imageId][annotation.toolType]) {
//             toolData[imageId][annotation.toolType] = { data: [] };
//         }

//         toolData[imageId][annotation.toolType].data.push(annotation.data);
//         cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState(toolData);
//     });
//         };
        


        

        
        // cornerstone.invalidateImageId()



        


        processItems(urls);
    }, [idList]);


    if (annotationsdata) {

        console.log(annotationsdata)
        console.log("Anan Hena yawlad ")
        cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState(annotationsdata);
    }



    // console.log(cornerstoneTools.globalImageIdSpecificToolStateManager.toolState)


    



    const saveAnnotations = async (annotations) => {
        try {
            const response = await fetch('http://localhost:8000/dicomViewer/saveAnnotations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ annotations, patientInfo })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Annotations saved:', data);
        } catch (error) {
            console.error('Error saving annotations:', error);
        }
    };

    return (
        <>
            {sourceImages.length > 0 && <Buttons rowData= {rowDataG} patientInfo = {patientInfo} sourceImages={sourceImages} cornerstone={cornerstone} idList={instances}   saveAnnotations={saveAnnotations}/>}
        </>
    );
};

export default ExameViewer;




