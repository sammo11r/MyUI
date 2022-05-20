import React from 'react';
import AppHeader from '../components/AppHeader';
import AppSider from '../components/AppSider';
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';

describe("renderHeader", () => {
    it('renders AppHeader correctly', () => {
        render(<AppHeader></AppHeader>);

        const settingsIcon = screen.getByTestId("header-settings-element");
        const userIcon = screen.getByTestId("header-profile-element");

        expect(settingsIcon).toBeInTheDocument();
        expect(userIcon).toBeInTheDocument();
    });
    it('renders AppSider correctly', () => {
        render(<AppSider></AppSider>);

        const siderMenu = screen.getByTestId("sider-menu");

        expect(siderMenu).toBeInTheDocument();
    });
    // it('loads a table on clicking option in Tables Menu', () => {
        
    // });
  });