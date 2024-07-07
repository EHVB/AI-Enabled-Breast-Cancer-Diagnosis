import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logoSrc from '../../assets/logo.png'
import baheyaLogo from '../../assets/main logo.jpg'
import axios from 'axios';
import dicomParser from 'dicom-parser'
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 20,
        // Remove the borderWidth and borderColor properties
    },
    section: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
        width: '100%',
    },
    column: {
        flex: 1,
        paddingRight: 10,
    },
    columnLast: {
        flex: 1,
        paddingLeft: 0,
    },
    specialHandling: {
        alignItems: "flex-end"
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: '15px',
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "normal"
    },
    space: {
        marginBottom: "15px"
    },
    date: {
        fontSize: 10,
        textAlign: 'right',
    },
    logo: {
        maxHeight: "50px",
        maxWidth: "50px",
        alignContent: "right"
    },
    baheyaLogo: {
        maxHeight: "60px",
        maxWidth: '100px',
        alignContent: "left"
    },
    underlineTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        marginBottom: 10,
    },
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 10,
    },
    inputValue: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: "left"
    },
    inputPlaceholder: {
        fontSize: 12,
        fontWeight: "extrabold",
        fontStyle: 'italic',
    },
    columnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // column: {
    //     width: '48%',
    // },
    imagesContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-between',

    },
    imagePlaceholder: {
        width: '48%',
        height: 150,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#000000',
    },
    image: {
        width: 120,
        height: 'auto',
        marginBottom: 10,
    },
    commentsBox: {
        borderWidth: 1,
        borderColor: '#000000',
        padding: 10,
    },
    resultText: {
        fontSize: 12,
    },
    signatureSection: {
        marginTop: 20,
        paddingTop: 10,
        width: '100%',
    },
    signaturePlaceholder: {
        textAlign: 'right',
        fontSize: 10,
    },
    commentPlaceholder: {
        fontStyle: "italic",
        fontSize: 12,
        flexGrow: 1,
    }
});


const ReportPDF = ({info, comment, leftBreast, rightBreast, leftBirads, rightBirads, images}) => {

    const today = new Date();

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const formattedDate = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

    const parts = info.examDate.split("-");

    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is zero-based, so subtract 1
    const day = parseInt(parts[2]);

    const examDateFormatted = `${day} ${monthNames[month]} ${year}`;

    console.log("ANA GOWA EL PDF", Object.keys(images))

    
    async function loadImage(dicomUrl) {
        try {
          const imageId = `wadouri:${dicomUrl}`;
          cornerstoneWADOImageLoader.configure({
            beforeSend: (xhr) => {
              // Add custom headers here (e.g., Authorization header)
            },
          });
  
          const image = await cornerstone.loadImage(imageId);
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          cornerstone.renderToCanvas(canvas, image);
  
          const imageSrc = canvas.toDataURL('image/png');

        //   console.log(imageSrc)

          return imageSrc;

        } catch (error) {
          console.error('Error loading DICOM image:', error);
        }
      }

      function removeWadouriPrefix(input) {
        // Split the string by ":"
        let parts = input.split(':');
    
        // Remove the first element (which is "wadouri") and join the rest with ":"
        let result = parts.slice(1).join(':');
    
        return result;
    }

    const imgs = []

    Object.keys(images).map( key => {
        imgs.push(<Image key={key} src={loadImage(removeWadouriPrefix(images[key]))} style={styles.image} />)
    })


    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        {/* <Text style={styles.title}>Baheya Foundation</Text> */}
                        <View style={styles.baheyaLogo}>
                            <Image src={baheyaLogo} style={styles.baheyaLogo}/>
                        </View>
                        <Text style={styles.subTitle}>Breast Findings Report</Text>
                    </View>
                    <View style={[styles.columnLast, styles.specialHandling]}>
                        <View style={styles.logo}>
                            <Image src={logoSrc} style={styles.logo} />
                        </View>
                        <Text style={styles.date}>Date: {formattedDate}</Text>
                    </View>
                </View>


                {/* Patient Data */}
                <View style={styles.section}>
                    <Text style={styles.title}>Patient Data</Text>
                    <View style={styles.columnContainer}>
                        <View style={styles.column}>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputLabel}>Name:</Text>
                            <Text style={styles.inputValue}>{info.patientName}</Text>
                        </View>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputLabel}>Age:</Text>
                            <Text style={styles.inputValue}>{parseInt(info.patientAge.replace(/\D/g, ''), 10)}</Text>
                        </View>
                        </View>
                        <View style={styles.column}>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputLabel}>ID:</Text>
                            <Text style={styles.inputValue}>{info.patientId}</Text>
                        </View>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputLabel}>Sex:</Text>
                            <Text style={styles.inputValue}>Female</Text>
                        </View>
                        </View>
                        <View style={styles.columnLast}>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputLabel}>Date Of Exam:</Text>
                            <Text style={styles.inputValue}>{examDateFormatted}</Text>
                        </View>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputLabel}>Referring Physician:</Text>
                            <Text style={styles.inputValue}>{info.doctor}</Text>
                        </View>
                        </View>
                    </View>
                </View>


                {/* Exam Results */}
                <View style={styles.section}>
                    <Text style={styles.title}>Exam Results</Text>
                    <View style={styles.columnContainer}>
                        <View style={styles.column}>
                        <Text style={styles.resultText}>Left Breast: {leftBreast}</Text>
                        </View>
                        
                        <View style={styles.column}>
                        <Text style={styles.resultText}>Right Breast: {rightBreast}</Text>
                        </View>
                    </View>

                    <View style={styles.space}></View>

                    <View style={styles.columnContainer}>
                        <View style={styles.column}>
                        <Text style={styles.resultText}>Left Breast BIRADS: {leftBirads}</Text>
                        </View>
                        
                        <View style={styles.column}>
                        <Text style={styles.resultText}>Right Breast BIRADS: {rightBirads}</Text>
                        </View>
                    </View>
                </View>

                {/* Doctor's Comments */}
                <View style={styles.section}>
                    <Text style={styles.title}>Physician's Notes</Text>
                    <View style={styles.commentsBox}>
                        <Text style={styles.commentPlaceholder}>{comment}</Text>
                    </View>
                </View>

                {/* Images */}
                {imgs.length > 0 && (<View style={styles.section}>
                    <Text style={styles.title}>Images</Text>
                    <View style={styles.imagesContainer}>

                        {
                            imgs
                        }


                        {/* <Image src={breast} style={styles.image} />
                        <Image src={breast} style={styles.image} />
                        <Image src={breast} style={styles.image} />
                        <Image src={breast} style={styles.image} /> */}
                    </View>
                </View>)}

                {/* Physician's Signature */}
                <View style={[styles.signatureSection]}>
                    <Text style={styles.title}>Physician's Signature</Text>
                    <Text style={styles.signaturePlaceholder}>_______________________________________________________</Text>
                </View>
            </Page>
        </Document>
    );
};

export default ReportPDF;