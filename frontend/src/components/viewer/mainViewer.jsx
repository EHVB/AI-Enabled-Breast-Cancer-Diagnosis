import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { useEffect, useRef } from "react";
import "../../styles/style.css"
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import  ViewerLayout from "./layout"
import { useState } from 'react';



const MainViewer = ({ probeTool, setIndex, Layout, index, image }) => {
  
  

  var annotations;
  
  
  
  const ForwardBtn = () => {
    switch (Layout) {
      case "1x1":
        
        if ((Math.max.apply(null,index )) < (image.length -1)){
          setIndex([index[0] + 1]) 
          console.log(index)
          
        }
        else {
          setIndex([0])
        }
        break;
      case "2x1":
          if ((Math.max.apply(null,index ))< (image.length -1)){
            setIndex([index[0]+2 ,index[1]+2 ])
        }
        else {
            setIndex([0,1])
        }
        break;
      
      case "1x2":
          if ((Math.max.apply(null,index ))< (image.length -1)){
            setIndex([index[0]+2 ,index[1]+2 ])
        }
        else {
            setIndex([0,1])
        }
        break;
      
      
      
      
      
      case "1x4":
        if ((Math.max.apply(null,index ))< (image.length -1)){
            setIndex([index[0]+4 ,index[1]+4 ,index[2]+4 ,index[3]+4])
        }
        else {
          setIndex([0,1,2,3])
          }
        break;
      
      
      
      case "2x2":
        if ((Math.max.apply(null,index ))< (image.length -1)){
            setIndex([index[0]+4 ,index[1]+4 ,index[2]+4 ,index[3]+4])
        }
        else {
          setIndex([0,1,2,3])
          }
        break;

      default:
      
    }
  }



  const BackdBtn = () => {
        switch (Layout) {
      case "1x1":
        
        if ((Math.min.apply(null,index ))> 0){
          setIndex([index[0] -1]) 
          console.log(index)
          
        }
        else {
          setIndex([image.length -1])
        }
            break;
          
          
          

      case "2x1":
          if ((Math.min.apply(null,index ))> 0){
            setIndex([index[0]-2 ,index[1]-2 ])
        }
        else {
            setIndex([image.length -2,image.length -1])
        }
        break;
      
          
          
          

      case "1x2":
          if ((Math.min.apply(null,index ))> 0){
            setIndex([index[0]-2 ,index[1]-2 ])
        }
        else {
            setIndex([image.length - 2, image.length - 1])
            
            console.log(index)
        }
            break;
          
          
          


      case ("1x4"):
        if ((Math.min.apply(null,index ))> 0){
            setIndex([image.length-4 ,image.length-4 ,image.length-4 ,image.length -4])
        }
        else {
          setIndex([0,1,2,3])
          }
            break;
          
          case "2x2":
            console.log("A7777777A Ana Hena")
            if ((Math.min.apply(null,index ))> 0){
            setIndex([0,1,2,3])
        }
        else {
          setIndex([4,5,6,7])
          }
            break;
      default:
      
    }
    }









    useEffect(() => {
    
    
    

      if (probeTool) {
        const Tool = cornerstoneTools[probeTool[1]];;
        cornerstoneTools.addTool(Tool)
        cornerstoneTools.setToolActive(probeTool[0], {
          mouseButtonMask: 1
        }
        );
        console.log(index);
      }
    }, [probeTool ,image ,annotations, index]);


  return (
    
    <div className='editing'>
      <ViewerLayout layout={Layout} cornerstone={cornerstone}>
        {index.map((item, i) => (
          <div key={i}>
              <ShowMainClass
                ind={i}
                cornerstone={cornerstone}
                image={image[item]}
                setIndex={setIndex}
                index={index}
                totalImages={image.length}
              />
          </div>
        ))}
      </ViewerLayout>
      <div className='back-btn'  onClick={() => BackdBtn()}><FaChevronLeft /></div>
      <div className='next-btn'  onClick={() => ForwardBtn()}> <FaChevronRight/></div>
    </div>
  );
}


export default MainViewer;



const ShowMainClass = ({ image, setIndex, index, totalImages }) => {
  const eleds = useRef();
  const clickTimeout = useRef(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    cornerstone.enable(eleds.current);
    cornerstone.displayImage(eleds.current, image);
    cornerstone.updateImage(eleds.current);
    cornerstone.fitToWindow(eleds.current);
    const vp = cornerstone.getViewport(eleds.current);

    if (image.data.string('x00080008') === 'DERIVED\\SECONDARY') {
      vp.voiLUT = undefined;
      vp.voi = { windowWidth: 256, windowCenter: 128 };
      cornerstone.setViewport(eleds.current, vp);
    } else {
      vp.voi = { windowWidth: image.windowWidth, windowCenter: image.windowCenter };
      cornerstone.setViewport(eleds.current, vp);
    }
  }, [image]);

  const handleDoubleClick = () => {
    if (index[0] < 4) {
      const newIndex = index.map(i => (i + 4) % totalImages);
      setIndex(newIndex);
    } else {
      const newIndex = index.map(i => (i - 4 + totalImages) % totalImages);
      setIndex(newIndex);
    }
  };

  const handleClick = () => {
    setClickCount(prevCount => prevCount + 1);

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    clickTimeout.current = setTimeout(() => {
      setClickCount(0);
    }, 250); // 0.5 seconds to detect double click

    if (clickCount === 1) {
      handleDoubleClick();
      setClickCount(0);
      clearTimeout(clickTimeout.current);
    }
  };

  return (
    <div
      ref={eleds}
      id='Mainviewer'
      onClick={handleClick}
    ></div>
  );
};