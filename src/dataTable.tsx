import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import 'primereact/resources/themes/saga-blue/theme.css';  // Include PrimeReact styles
import 'primereact/resources/primereact.min.css';
import OverlayPanelWithButton from './overlayPanel';
import { Paginator } from 'primereact/paginator';

export default function BasicDemo() {
  const [products,setProducts] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);  
  
  //for select rows
  const [selectedRows,setSelectedRows] = useState({});
  //for pagination
  const [paginationDetails,setPaginationDetails] = useState(null)
  const [first, setFirst] = useState(0);
 
  //for loading
  const [isLoading,setLoading] = useState(true);

  useEffect(()=>{    
    fetchData('https://api.artic.edu/api/v1/artworks?page=1')
  },[])

  useEffect(()=>{    
    console.log("check ids ",checkedIds)
  },[checkedIds])
  useEffect(()=>{
    console.log("selected row ",selectedRows)
  },[selectedRows])

  useEffect(() => {
    const key = `page_${paginationDetails?.current_page}`;
    console.log("from key from useEffect", key)
    if (key in selectedRows && Array.isArray(products)) {
      console.log('selected key', selectedRows);
      for (let i = 0; i < selectedRows[key]; i++) {
        setCheckedIds((prevCheckedIds) => prevCheckedIds.includes(products[i].id) ? prevCheckedIds : [...prevCheckedIds, products[i].id] );
      }
      setSelectedRows((prevSelectedRows) => {        
        const newSelectedRows = { ...prevSelectedRows };
        delete newSelectedRows[key];        
        return newSelectedRows;
      });
    }
  }, [paginationDetails,selectedRows]);

  const fetchData = async (url)=>{
    // console.log('fetching the data ')
    setLoading(true);
    const response = await fetch(url);
    const data = await response.json()
    setPaginationDetails(data.pagination)    
    // console.log("paginationDetails ",data.pagination)
    setLoading(false);    
    setProducts(data.data)    

}

  const onCheckboxChange = (e:any, rowData:any) => {
    if (e.checked) {
      setCheckedIds([...checkedIds, rowData.id]);
    // setCheckedIds(`page_${first}`)
    } else {
      setCheckedIds(checkedIds.filter(id => id !== rowData.id));
    }
  };

  // Function to render the checkbox column
  const checkboxBodyTemplate = (rowData) => {
    return (
      <Checkbox
        id={`checkbox-${rowData.id}`}
        value={rowData.id}
        checked={checkedIds.includes(rowData.id)} // Set the checked state
        onChange={(e) => {
            onCheckboxChange(e, rowData)            
        }}
      />
    );
  };

  const overlaypanelTemplate = ()=>{

    return paginationDetails && <OverlayPanelWithButton setSelectedRows={setSelectedRows} pageNumber={paginationDetails?.current_page}/>
  }

  const onPageChange = (event) => {    
    setFirst(event.first);  // Update the first value from the event
    const url = event.first < first ? paginationDetails.prev_url : paginationDetails.next_url;
    
    // Fetch the data based on the next/prev URL
    if (url) {
      fetchData(url);
    }
  };

  if(isLoading){
    return (
        <div style={{maxHeight:'400px', overflowY:'scroll'}}>
            loading ....
            </div>    
    )
  }
  return (
    <>
    <div style={{maxHeight:'400px', overflowY:'scroll' ,padding:'5px' }} >
      <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
      <Column body={checkboxBodyTemplate} header={overlaypanelTemplate}></Column>    
        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscripation"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>        
      </DataTable>
    </div>
    
    {paginationDetails &&
    <Paginator 
        first={first} 
        rows={paginationDetails?.limit || 10} 
        totalRecords={paginationDetails?.total || 0} 
        onPageChange={(e)=>onPageChange(e)} 
        template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }} 
    /> }
      {/* <Paginator first={paginationDetails.current_page} rows={paginationDetails.limit} totalRecords={paginationDetails && paginationDetails.total_pages} onPageChange={onPageChange} template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }} /> */}
    </>  
        
  );
}


        