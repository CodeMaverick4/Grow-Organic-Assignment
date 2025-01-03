import React, { useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';

interface OverlayPanelWithButtonProps {
  setSelectedRows: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  pageNumber: number;
}

const OverlayPanelWithButton: React.FC<OverlayPanelWithButtonProps> = ({ setSelectedRows, pageNumber }) => {
  const op = useRef<OverlayPanel>(null);
  const [noOfRows, setNoOfRows] = useState<number | ''>('');

  const updateSelectedRows = () => {
    const temp: Record<string, number> = {};
    let remainingRows = typeof noOfRows === 'number' ? noOfRows : 0;
    let currentPage = pageNumber;

    while (remainingRows > 0) {
      temp[`page_${currentPage}`] = Math.min(remainingRows, 12); // Limit rows to 12 per page
      remainingRows -= 12;
      currentPage += 1;
    }
    setSelectedRows(temp);

    // Close the OverlayPanel after submitting
    if (op.current) {
      op.current.hide();
    }
  };

  return (
    <>
      <Button
        type="button"
        label="Select"
        style={{ backgroundColor: 'white', color: 'black' }}
        onClick={(e) => op.current?.toggle(e)}
      />
      <OverlayPanel ref={op}>
        <div style={{ padding: '1rem' }}>
          <input
            type="number"
            placeholder="Enter number here..."
            value={noOfRows}
            onChange={(e) => setNoOfRows(Number(e.target.value) || '')}
            style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
          />
          <Button
            type="button"
            label="Submit"
            style={{ backgroundColor: 'blue', color: 'white', width: '100%' }}
            onClick={updateSelectedRows}
          />
        </div>
      </OverlayPanel>
    </>
  );
};

export default OverlayPanelWithButton;
