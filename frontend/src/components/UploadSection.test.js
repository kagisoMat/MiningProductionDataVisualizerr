import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadSection from './UploadSection';

describe('UploadSection Component', () => {
  test('renders without crashing', () => {
    render(
      <UploadSection 
        setData={() => {}} 
        setError={() => {}} 
        setSuccess={() => {}} 
      />
    );

    expect(screen.getByText(/Upload CSV or Excel/i)).toBeInTheDocument();
  });
});
