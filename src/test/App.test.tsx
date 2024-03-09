import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from "vitest";
import App from "../App";
import CheckoutPage from "../CheckoutPage.tsx";

describe(App.name, () => {

    it('automatically fills in the city "Fredensborg" when "3480" is entered into the ZIP code field', async () => {
        render(<CheckoutPage cartItems={[]} removeItem={() => {}} setCartItems={() => {}} />);

        // Use userEvent to type "3480" into the ZIP code input field
        await userEvent.type(screen.getByPlaceholderText(/Zip Code/i), '3480');

        // Wait for the city field to be automatically filled and assert the expected value
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/City/i)).toHaveValue('Fredensborg');
        });
    });

    it('validates email input correctly', async () => {
        render(<CheckoutPage cartItems={[]} removeItem={() => {}} setCartItems={() => {}} />);
        const emailInput = screen.getByTestId("emailInput"); //getByPlaceholderText(/email/i);
        await userEvent.type(emailInput, 'invalid-email');
        //await waitFor(() => {
        expect(emailInput).toHaveStyle('border-color: red');
        //});
        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, 'valid@example.com');
        //await waitFor(() => {
        expect(emailInput).toHaveStyle('border-color: green');
        //});
    });

    it('displays "Invalid email" error for incorrect email input', async () => {
        render(<CheckoutPage cartItems={[]} removeItem={() => {}} setCartItems={() => {}} />);
        const emailInput = screen.getByTestId("emailInput");
        userEvent.type(emailInput, 'invalid-email'); // Trigger validation
        // Use `await` with `findByText` to wait for async updates
        const errorMessage = await screen.findByText('Invalid email');
        // Assert the error message is in the document
        expect(errorMessage).toBeInTheDocument();
    });



});