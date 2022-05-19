import React from 'react';
import AppSider from '../components/AppSider';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';

it('renders AppSider correctly', () => {
    render(<AppSider></AppSider>);
})
