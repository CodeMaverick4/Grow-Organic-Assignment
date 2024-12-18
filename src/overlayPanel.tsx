
import React, { useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';

export default function OverlayPanelWithButton({setSelectedRows, pageNumber}) {
    const op = useRef(null);
    const [noOfrows, setNoOfRows] = useState('')
    const updateSelectedRows = ()=>{
        console.log("No of rows selected ",noOfrows);
        let temp = {}
        let n = noOfrows
        let page  = pageNumber
        console.log("from overlay ",pageNumber)
        while(n > 0){
            temp[`page_${page}`] = noOfrows < 12 ? noOfrows : 12; 
            n = n - 12
            page +=1
        }
        console.log(temp)
        setSelectedRows(temp);        
    }
    
    return (
        <>
            <Button type="button" label='Select' style={{backgroundColor:'white',color:'black'}} onClick={(e) => op.current.toggle(e)} />
            <OverlayPanel ref={op}>
                
                    <input type="number" placeholder='enter number here ...' value={noOfrows} onChange={(e)=>setNoOfRows(Number(e.target.value))}/>
                    <button onClick={updateSelectedRows}>submit</button>
                
            </OverlayPanel>
        </>
    );
}
        