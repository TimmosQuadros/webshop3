import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";
import CheckoutPage from "../CheckoutPage.tsx";
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

describe(App.name, () => {
    it('validates email input correctly', async () => {
        render(<CheckoutPage cartItems={[]} removeItem={() => {}} setCartItems={() => {}} />);
        const emailInput = screen.getByTestId("emailInput"); //getByPlaceholderText(/email/i);
        userEvent.type(emailInput, 'invalid-email');
        await waitFor(() => {
            expect(emailInput).toHaveStyle('border-color: red');
        });
        userEvent.clear(emailInput);
        userEvent.type(emailInput, 'valid@example.com');
        await waitFor(() => {
            expect(emailInput).toHaveStyle('border-color: green');
        });
    });

    it('displays "Invalid email" error for incorrect email input', async () => {
        render(<CheckoutPage cartItems={[]} removeItem={() => {}} setCartItems={() => {}} />);
        // Assume your email input triggers validation on change or blur
        const emailInput = screen.getByTestId("emailInput");
        userEvent.type(emailInput, 'invalid-email'); // Trigger validation
        // Use `await` with `findByText` to wait for async updates
        const errorMessage = await screen.findByText('Invalid email');
        // Assert the error message is in the document
        expect(errorMessage).toBeInTheDocument();
    });

});