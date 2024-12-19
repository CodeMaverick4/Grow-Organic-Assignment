import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import 'primereact/resources/themes/saga-blue/theme.css'; // Include PrimeReact styles
import 'primereact/resources/primereact.min.css';
import OverlayPanelWithButton from './overlayPanel';
import { Paginator } from 'primereact/paginator';

interface Product {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

interface PaginationDetails {
  current_page: number;
  total: number;
  limit: number;
  prev_url: string | null;
  next_url: string | null;
}

export default function BasicDemo(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<Record<string, number>>({});
  const [paginationDetails, setPaginationDetails] = useState<PaginationDetails | null>(null);
  const [first, setFirst] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);

  
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


  useEffect(() => {
    fetchData('https://api.artic.edu/api/v1/artworks?page=1');
  }, []);

  useEffect(() => {
    console.log('Checked IDs:', checkedIds);
  }, [checkedIds]);

  useEffect(() => {
    console.log('Selected Rows:', selectedRows);
  }, [selectedRows]);

  const fetchData = async (url: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPaginationDetails(data.pagination);
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onCheckboxChange = (e: CheckboxChangeEvent, rowData: Product): void => {
    setCheckedIds((prevCheckedIds) =>
      e.checked ? [...prevCheckedIds, rowData.id] : prevCheckedIds.filter((id) => id !== rowData.id)
    );
  };

  const checkboxBodyTemplate = (rowData: Product): JSX.Element => (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Checkbox
        id={`checkbox-${rowData.id}`}
        value={rowData.id}
        checked={checkedIds.includes(rowData.id)}
        onChange={(e) => onCheckboxChange(e, rowData)}
      />
    </div>
  );

  const overlaypanelTemplate = (): JSX.Element | null =>
    paginationDetails ? (
      <OverlayPanelWithButton setSelectedRows={setSelectedRows} pageNumber={paginationDetails.current_page} />
    ) : null;

  const onPageChange = (event: { first: number }): void => {
    const newFirst = event.first;
    setFirst(newFirst);
    const url = newFirst < first ? paginationDetails?.prev_url : paginationDetails?.next_url;
    if (url) {
      fetchData(url);
    }
  };

  if (isLoading) {
    return <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>Loading...</div>;
  }
  const getRowClass = (rowData: Product): string => {
    return checkedIds.includes(rowData.id) ? 'blue-row' : '';
  };
  return (
    <>
      <div style={{ maxHeight: '600px', overflowY: 'scroll', padding: '5px' }}>
        <DataTable value={products}  rowClassName={getRowClass}>
          <Column
            // style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            body={checkboxBodyTemplate}
            header={overlaypanelTemplate}
          />
          <Column field="title" header="Title" />
          <Column field="place_of_origin" header="Place of Origin" />
          <Column field="artist_display" header="Artist Display" />
          <Column field="inscriptions" header="Inscription" />
          <Column field="date_start" header="Date Start" />
          <Column field="date_end" header="Date End" />
        </DataTable>
      </div>

      {paginationDetails && (
        <Paginator
          first={first}
          rows={paginationDetails.limit}
          totalRecords={paginationDetails.total}
          onPageChange={onPageChange}
          template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
        />
      )}
    </>
  );
}
