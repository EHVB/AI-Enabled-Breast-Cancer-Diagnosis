import { useState , useEffect} from "react";
import {  FaExpandArrowsAlt, FaEraser ,FaPencilAlt } from "react-icons/fa";
import { FaArrowsRotate, FaArrowUpRightFromSquare, FaArrowTurnDown } from "react-icons/fa6";
import { IoEllipseOutline } from "react-icons/io5";
import { IoMdContrast } from "react-icons/io";
import { MdOutlineRectangle } from "react-icons/md";
import { TiZoom } from "react-icons/ti";
import { TbZoomPan, TbAngle } from "react-icons/tb";
import { TfiRulerAlt } from "react-icons/tfi";
import Thumbnail from './thumbnail';
import MainViewer from "./mainViewer";
import "../../styles/mainFunction.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../../styles/Buttons.css";
import cornerstoneTools from 'cornerstone-tools';

function Buttons({rowData, patientInfo, sourceImages , cornerstone, idList, saveAnnotations}) {


    const [probeTool, setProbeTool] = useState(['Pan', 'PanTool']);
    const [reportImages, setReportImages] = useState([]);
    const [Layout, setLayout] = useState("1x1");
    const [index, setIndex] = useState([0]);






    const handleLayoutChange = (event) => {
        const viewerlayout = event.target.value;
        switch (viewerlayout) {
            case "1x1":
                setIndex([0])
                break;
            case "1x2":
                setIndex([0,1])
                break;
            case "1x4":
                setIndex([0,1,2,3])
                break;
            case "2x1":
                setIndex([0, 1])
                break;
            case "2x2":
                setIndex([0, 1, 2, 3])
                break;
            default:
            }
        setLayout(viewerlayout);
    };


    const handleButtonClick = (newValue) => {
        setProbeTool(newValue);
    };



    return (
        <div className="content">
        {      <div className="Navbar">
                <Navbar patientInfo = {patientInfo}/>
                <div className="headertool">
                    <nav className="toolsbar">
                        <button className="icontool"  onClick={() => handleButtonClick(['Pan','PanTool'])}> <FaExpandArrowsAlt className="tool"/></button>
                        <button className="icontool"  onClick={() => handleButtonClick(['Eraser','EraserTool'])}> <FaEraser className="tool"/></button>
                        <button className="icontool"  onClick={() => handleButtonClick(['Rotate','RotateTool'])}> <FaArrowsRotate className="tool"/></button>
                        <button className="icontool"  onClick={() => handleButtonClick(['Magnify','MagnifyTool'])}> <TiZoom className="tool"/></button>
                        <button className="icontool"  onClick={() => handleButtonClick(['Wwwc','WwwcTool'])}> <IoMdContrast  className="tool"/></button>
                        <button className="icontool"  onClick={() => handleButtonClick(['Zoom','ZoomTool'])}> <TbZoomPan className="tool"/></button>
                        <button className="icontool"  onClick={() => handleButtonClick(['Angle','AngleTool'])}> <TbAngle className="tool"/></button>
                        <button className="icontool"  onClick={() => handleButtonClick(['ArrowAnnotate','ArrowAnnotateTool'])}> <FaArrowUpRightFromSquare className="tool"/></button>
                        <button className="icontool"  onClick={() => handleButtonClick(['Probe','ProbeTool'])}> <FaArrowTurnDown className="tool"/></button>
                        <button className="icontool"  onClick={() => handleButtonClick(['Length','LengthTool'])}> <TfiRulerAlt className="tool"/></button>
                        <button className="icontool" onClick={() => handleButtonClick(['FreehandRoi', 'FreehandRoiTool'])}> <FaPencilAlt className="tool" /></button>
                        <button className="icontool" onClick={() => handleButtonClick(['EllipticalRoi', 'EllipticalRoiTool'])}> <IoEllipseOutline className="tool" /></button>
                        <button className="icontool" onClick={() => handleButtonClick(['RectangleRoi', 'RectangleRoiTool'])}> <MdOutlineRectangle className="tool" /></button>
                        <select value={Layout} onChange={handleLayoutChange}>
                            <option value="1x1">1x1</option>
                            <option value="2x1">1x2</option>
                            {/* <option value="1x2">2x1</option> */}
                            <option value="2x2">2x2</option>
                            <option value="1x4">1x4</option>
                        </select>
                    </nav>
            </div>
            </div> }
                
            { <div className="Viewers">
                <MainViewer probeTool={probeTool} cornerstone={cornerstone} Layout={Layout} index={index} setIndex={setIndex} image={sourceImages}  className="main"  />
            
            </div> }
            <Sidebar rowData={rowData} reportImages={reportImages} saveAnnotations={saveAnnotations} />
            <Thumbnail images_src_list={sourceImages} setIndex={setIndex}  setLayout={setLayout} names={['R-MLO', 'L-MLO', 'R-CC', 'L-CC', 'R-MLO', 'L-MLO', 'R-CC', 'L-CC']} reportImages={reportImages} setReportImages={setReportImages} idList={idList}/>
            </div>
	);
}

export default Buttons;
