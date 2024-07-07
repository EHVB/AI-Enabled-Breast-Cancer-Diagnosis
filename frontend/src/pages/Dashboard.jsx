import { useEffect, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css'
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import '../styles/AgGridTable.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../features/auth/authSlice';

const CustomBooleanCellRenderer = ({ value }) => {
  const cellStyle = {
    backgroundColor: value ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)',
    height: '100%',
    width: '100%'
  };

  return <div style={cellStyle}></div>;
};

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user, userInfo } = useSelector((state) => state.auth);
  const [rowData, setRowData] = useState([]);
  const navigate= useNavigate();
  const handleRowClick = (event) => {
    const rowData = event.data; // Get row data from event
    // Navigate to another page and pass row data as route state
    console.log("#######################",rowData)
    navigate('/viewer', { state: { rowData } });
  };

  useEffect(() => {
    axios.get('http://localhost:8000/examlist/allexams')
      .then(response => {
        setRowData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    console.log("hereXXXXXXXXXXX", rowData)
  }, []);
  
      useEffect(() => {
        if (user) {
            dispatch(getUserInfo());
        }
    }, [dispatch, user]);

  return (
    <div>
      <h1 className='header-exam'>Exam List {userInfo.name}</h1>
      {/* <div className="upload-container">
        <button className="upload-button" onClick={() => console.log('Upload button clicked')}>
          <img src={UploadIcon} alt="Upload Exam" className="upload-icon" />
          Upload Exam
        </button>
      </div> */}
      <div className="app-content">
        <AgGridTable rowData={rowData} onRowClick={handleRowClick} />
      </div>
    </div>
  );
};

export default Dashboard;





const AgGridTable = ({rowData , onRowClick}) => {

  const ageFormatter = (params) => {
    return parseInt(params.value.replace(/\D/g, ''), 10);
  };

  const dateFormatter = (params) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    
    const parts = params.value.split("-");

    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is zero-based, so subtract 1
    const day = parseInt(parts[2]);

    return `${day} ${monthNames[month]} ${year}`;


  };
    
    const columnDefs = [
        { headerName: 'Patient Name', field: 'Patient_name' },
        { headerName: 'Patient ID', field: 'Patient_id' },
        { headerName: 'Age', field: 'age', 'valueFormatter':ageFormatter, width: 120 }, // Increased width for Age column
        { headerName: 'Physician Name', field: 'Doctor_name' },
        { headerName: 'Study ID', field: 'Study_Id' },
        { headerName: 'Study Date', field: 'Date_Study', 'valueFormatter': dateFormatter },
        { headerName: 'Suspicious', field: 'Classification',  cellRenderer: CustomBooleanCellRenderer, width: 150},
        { headerName: 'CESM', field: 'CEM' }
    ];

    const defaultColDef = {
        resizable: true,
        filter: true,
        floatingFilter: true
    };

    const gridOptions = {
      rowSelection: 'single', // Allow selecting single row
      onRowClicked: onRowClick, // Call onRowClick function on row click
    };

    return (
        <Container fluid className="table-container">
            <Row>
                <Col xs={12}>
                    <div className="ag-theme-material-dark" style={{ height: '80vh', width: '100%' }}>
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={rowData}
                            defaultColDef={defaultColDef}
                            pagination={true}
                            paginationPageSize={20} // Number of rows per page
                            gridOptions={gridOptions}
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};