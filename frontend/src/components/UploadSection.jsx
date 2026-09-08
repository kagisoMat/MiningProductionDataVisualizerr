import React from 'react';
import { Button } from '@mui/material';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const UploadSection = ({ setData, setError, setSuccess }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const { data, errors, meta } = results;
          if (errors.length > 0) {
            setError('Error parsing CSV file.');
            setSuccess(null);
          } else {
            setData({
              columns: meta.fields,
              rows: data.length,
              head: data,
            });
            setSuccess('CSV file uploaded successfully.');
            setError(null);
          }
        },
        error: () => {
          setError('Error reading CSV file.');
          setSuccess(null);
        }
      });
      return;
    }

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        try {
          const workbook = XLSX.read(loadEvent.target.result, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
          const columns = data.length > 0 ? Object.keys(data[0]) : [];

          if (columns.length === 0) {
            setError('The Excel file does not contain any data.');
            setSuccess(null);
            return;
          }

          setData({ columns, rows: data.length, head: data });
          setSuccess('Excel file uploaded successfully.');
          setError(null);
        } catch (error) {
          setError('Error reading Excel file.');
          setSuccess(null);
        }
      };
      reader.onerror = () => {
        setError('Error reading Excel file.');
        setSuccess(null);
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    setError('Please upload a CSV or Excel file.');
    setSuccess(null);
  };

  return (
    <div>
      <input
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          Upload CSV or Excel
        </Button>
      </label>
    </div>
  );
};

export default UploadSection;
