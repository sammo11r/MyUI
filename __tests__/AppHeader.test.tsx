import React from 'react';
import AppHeader from '../components/AppHeader';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';

it('renders AppHeader correctly', () => {
    render(<AppHeader></AppHeader>);
})
