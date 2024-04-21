import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from 'react-to-print';
import Menu from '../Components/menu';
import AppBar from '../Components/Appbar';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Paper, InputBase, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@mui/material';
import vehicle from "../css/Vehicle.css";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
const URL = "http://localhost:5000/Vehicles";

const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);//url local host wenuwata
}

function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);
    const navigate = useNavigate();
    const ComponentsRef = useRef();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchHandler().then((data) => setVehicles(data.vehicle));
    }, []);

    const handlePrint = useReactToPrint({
        content: () => ComponentsRef.current,
        documentTitle: 'Vehicles Report',
        onAfterPrint: () => alert("Vehicles Report successfully Downloaded!"),
    });

    const handlePrintSingle = (vehicleData) => {
        // Here you can generate a report for the specific vehicleData
        // For example, you can create a new window/tab with the vehicle details to print
        const reportWindow = window.open("", "_blank");
        reportWindow.document.write(`<html><head><title>Vehicle Report</title></head><body><h1>Vehicle Details</h1><p>Register No: ${vehicleData.RegNo}</p><p>Vehicle Name: ${vehicleData.Vname}</p><p>Vehicle Type: ${vehicleData.Type}</p><p>Vehicle Inditification NO: ${vehicleData.VIN}</p><p>License Expiry Day: ${formatDate(vehicleData.lic_expDay)}</p><p>Insurance Expiry Day: ${formatDate(vehicleData.ins_expDay)}</p><p>Last Service Day: ${formatDate(vehicleData.last_serviceDay)}</p><p>Mileage: ${vehicleData.mileage}</p><p>Driver Name: ${vehicleData.dname}</p><p>Vehicle Status: ${vehicleData.vstatus}</p></body></html>`);
        reportWindow.document.close();
        reportWindow.print();
    };

    const handleSearch = () => {
        fetchHandler().then((data) => {
            const filteredVehicles = data.vehicle.filter((vehicle) =>
                Object.values(vehicle).some((field) =>
                    field.toString().toLowerCase().includes(searchQuery.toLowerCase())
                ));
            setVehicles(filteredVehicles);
            setNoResults(filteredVehicles.length === 0);
        });
    };

    const handleAddClick = () => {
        navigate(`/addvehicle`);
    };

    const deleteHandler = async (_id) => {
        try {
            await axios.delete(`http://localhost:5000/vehicles/${_id}`);
            setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle._id !== _id));
        } catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
      
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    
    return (
    <div>

            <AppBar />
            <Menu />
            <div style={{ marginLeft: '260px', paddingTop: '100px'}}>
                <Breadcrumbs
                    arial-label="breadcrumb"
                    separator={<NavigateNextIcon fontSize="small" />}
                >
                <Link underline="hover" key="1" color="inherit" href="/vehicle">
                    Vehicle DashBoard
                </Link>
                <Typography key="3" color="text.primary">
                    Vehicles List
                </Typography>
                </Breadcrumbs>
                <br></br>
            <Paper sx={{ width: '100%', boxShadow: 'none' }}>
                <Box >
                    <InputBase
                    sx={{ flex: 1, marginLeft: '10px' }}
                    placeholder="Search vehicle Details"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startAdornment={<SearchIcon />}
                    />
                    <IconButton color="primary" aria-label="search" onClick={handleSearch}>
                        <SearchIcon />
                    </IconButton>
                    <IconButton color="primary" aria-label="add vehicle" onClick={handleAddClick}>
                        <AddIcon />
                    </IconButton>
                    <IconButton color="primary" aria-label="print all" onClick={handlePrint}>
                        <PrintIcon />
                    </IconButton>
                </Box>

            {noResults ? (
                <div>
                    <p>No results found</p>
                </div>
            ) : (
                <div ref={ComponentsRef}>
                     <h1 style={{ textAlign: 'center' }}>Details of Vehicles</h1>
                    <TableContainer component={Paper}>
                        <Table stickyHeader aria-label="sticky table" sx={{ borderCollapse: 'collapse' }}>
                           
                               
                                <TableHead>
                                    <TableRow>
                                        <TableCell  sx={{backgroundColor: '#b1c5d4',fontWeight: 'bold',border: 'none',padding: '5px 10px','&:hover': {backgroundColor: '#b1c5d4'}}}>Register No</TableCell>
                                        <TableCell sx={{backgroundColor: '#b1c5d4',fontWeight: 'bold',border: 'none',padding: '5px 10px','&:hover': {backgroundColor: '#b1c5d4'}}}>Vehicle Name</TableCell>
                                        <TableCell sx={{backgroundColor: '#b1c5d4',fontWeight: 'bold',border: 'none',padding: '5px 10px','&:hover': {backgroundColor: '#b1c5d4'}}}>Type</TableCell>
                                        
                                        <TableCell sx={{backgroundColor: '#b1c5d4',fontWeight: 'bold',border: 'none',padding: '5px 10px','&:hover': {backgroundColor: '#b1c5d4'}}}>License Expiry Day</TableCell>
                                        <TableCell sx={{backgroundColor: '#b1c5d4',fontWeight: 'bold',border: 'none',padding: '5px 10px','&:hover': {backgroundColor: '#b1c5d4'}}}>Insurance Expiry Day</TableCell>
                                        <TableCell sx={{backgroundColor: '#b1c5d4',fontWeight: 'bold',border: 'none',padding: '5px 10px','&:hover': {backgroundColor: '#b1c5d4'}}}>Last Service Day</TableCell>
                                        <TableCell sx={{backgroundColor: '#b1c5d4',fontWeight: 'bold',border: 'none',padding: '5px 10px','&:hover': {backgroundColor: '#b1c5d4'}}}>Mileage</TableCell>
                                        <TableCell sx={{backgroundColor: '#b1c5d4',fontWeight: 'bold',border: 'none',padding: '5px 10px','&:hover': {backgroundColor: '#b1c5d4'}}}>Driver Name</TableCell>
                                        <TableCell sx={{backgroundColor: '#b1c5d4',fontWeight: 'bold',border: 'none',padding: '5px 10px','&:hover': {backgroundColor: '#b1c5d4'}}}>Vehicle Status</TableCell>
                                        <TableCell sx={{backgroundColor: '#b1c5d4',fontWeight: 'bold',border: 'none',padding: '5px 10px','&:hover': {backgroundColor: '#b1c5d4'}}}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vehicles.map((vehicle) => (
                                        <TableRow key={vehicle._id}>
                                            <TableCell sx={{ border: '1px', padding: '5px 10px', backgroundColor: 'white', textAlign: 'center' }}>{vehicle.RegNo}</TableCell>
                                            <TableCell sx={{ border: '1px', padding: '5px 10px', backgroundColor: 'white', textAlign: 'center' }}>{vehicle.Vname}</TableCell>
                                            <TableCell sx={{ border: '1px', padding: '5px 4px', backgroundColor: 'white', textAlign: 'center' }}>{vehicle.Type}</TableCell>
                                           
                                            <TableCell sx={{ border: '1px', padding: '5px 10px', backgroundColor: 'white', textAlign: 'center' }}>{formatDate(vehicle.lic_expDay)}</TableCell>
                                            <TableCell sx={{ border: '1px', padding: '5px 10px', backgroundColor: 'white', textAlign: 'center' }}>{formatDate(vehicle.ins_expDay)}</TableCell>
                                            <TableCell sx={{ border: '1px', padding: '5px 10px', backgroundColor: 'white', textAlign: 'center' }}>{formatDate(vehicle.last_serviceDay)}</TableCell>
                                            <TableCell sx={{ border: '1px', padding: '5px 10px', backgroundColor: 'white', textAlign: 'center' }}>{vehicle.mileage}</TableCell>
                                            <TableCell sx={{ border: '1px', padding: '5px 10px', backgroundColor: 'white', textAlign: 'center' }}>{vehicle.dname}</TableCell>
                                            <TableCell sx={{ border: '1px', padding: '5px 10px', backgroundColor: 'white', textAlign: 'center' }}>{vehicle.vstatus}</TableCell>
                                            <TableCell sx={{ border: '1px', padding: '5px 10px', backgroundColor: 'white', textAlign: 'center'}}>
                                                <IconButton onClick={() => navigate(`/viewvehicles/${vehicle._id}`)} >
                                                <EditIcon
                                                    color="primary"
                                                    aria-label="edit"
                                                    sx={{
                                                      '&:hover': {
                                                        color: '#00008b',
                                                      },
                                                      color: '',
                                                    }} 
                                                />
                                                </IconButton>
                                                <IconButton onClick={() => deleteHandler(vehicle._id)} >
                                                    <DeleteIcon  color="secondary"
                                                                aria-label="delete"
                                                                sx={{
                                                                    '&:hover': {
                                                                    color: '#FF1B1B',
                                                                    },
                                                                    color: '#CF5C5C',
                                                                    }}/>
                                                </IconButton>
                                                <IconButton onClick={() => handlePrintSingle(vehicle)} >
                                                    <PrintIcon
                                                     color="primary"
                                                     aria-label="edit"
                                                     sx={{
                                                       '&:hover': {
                                                         color: '#00008b',
                                                       },
                                                       color: '',
                                                     }}  />
                                                </IconButton>
                                                <IconButton onClick={() => navigate(`/viewvehicle/${vehicle._id}`)}>
                                                    <VisibilityIcon
                                                     color="primary"
                                                     aria-label="edit"
                                                     sx={{
                                                       '&:hover': {
                                                         color: '#00008b',
                                                       },
                                                       color: '',
                                                     }}

                                                     /> 
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                           
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={vehicles.length} // Assuming vehicles is the array of data you want to paginate
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            borderTop: 'none',
                            padding: '12px 16px',
                        }}
                    />

                </div>
            )}
            <br /><br />
            </Paper>
        </div>
    </div>
    )
}

export default Vehicles;
