import * as React from 'react';
import cornerstone from 'cornerstone-core';
import { useEffect, useRef ,useState} from "react";






const Showthumbnail = ({ image ,name }) => {
    const ele = useRef();


    useEffect(() => {
        cornerstone.enable(ele.current);
        cornerstone.displayImage(ele.current, image);

    }, []);



    return (

        <div ref={ele} className='thumbnailContainer'>
        {name && <div className="thumbnailName">{name}</div>}
        </div>
    )
}



const Thumbnail = ({ images_src_list, setIndex , setLayout ,names, reportImages, setReportImages, idList}) => {
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);

    const [activeDivs, setActiveDivs] = useState(new Array(images_src_list.length).fill(false));

    const setIDX = (idx) => {
        setLayout("1*1");
        setIndex([idx]);
        console.log("Ana Dost");
        setSelectedThumbnail(idx);
    }

    const handleRightClick = (index, event) => {
        event.preventDefault(); // Prevent the default context menu from appearing
        setActiveDivs(prevActiveDivs => {
          const newActiveDivs = [...prevActiveDivs];
          newActiveDivs[index] = !newActiveDivs[index];
          return newActiveDivs;
        });

        setReportImages(prevReportImages => {
            if (prevReportImages.includes(idList[index])) {
              // If image is already in clickedimages, remove it
              return prevReportImages.filter(v => v !== idList[index]);
            } else {
              // If image is not in clickedimages, add it
              return [...prevReportImages, idList[index]];
            }
        });

        console.log("###################### kosom el 3alm #################", reportImages)
    };

    return (
        <div 
            className ="ThumbnailContainer"
            style={{"overflowY":"auto", "maxHeight":"80%", "direction":"rtl", "scrollbarWidth":"thin", "scrollbarColor":"white black"}}
        >
            <h2
                style={{
                    "textAlign":"center"
                }}
            >
                Thumbnails
            </h2>
        <div className ="ThumbnailClasses" >
            {images_src_list.map((src_img, idx) => (
                <div 
                    className={`ThumbnailFirstChieldClass ${selectedThumbnail === idx ? 'selected' : ''}`}
                    onClick={() => setIDX(idx)} 
                    key={idx}
                    style={{
                        border: ` 1px solid ${activeDivs[idx] ? 'blue' : '#5a5a5a'}`
                    }}
                    onContextMenu={(event) => handleRightClick(idx, event)}
                >
                    <Showthumbnail image={src_img} name={names[idx]} />
                </div>
                
            ))}
        </div>
        </div>
    );
}

export default Thumbnail;



