import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from "vitest";
import App from "../App";
import CheckoutPage from "../CheckoutPage.tsx";

describe(App.name, () => {

    // Set up common props if they're needed across all tests
    const commonProps = {
        cartItems: [],
        removeItem: () => {},
        setCartItems: () => {}
    };

    beforeEach(() => {
        // This will run before each test in this describe block
        render(<CheckoutPage {...commonProps} />);
    });

    it('automatically fills in the city "Fredensborg" when "3480" is entered into the ZIP code field', async () => {
        //render(<CheckoutPage cartItems={[]} removeItem={() => {}} setCartItems={() => {}} />);

        // Use userEvent to type "3480" into the ZIP code input field
        await userEvent.type(screen.getByPlaceholderText(/Zip Code/i), '3480');

        // Wait for the city field to be automatically filled and assert the expected value
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/City/i)).toHaveValue('Fredensborg');
        });
    });

    it('displays "Invalid zip code" error for incorrect zip code input', async () => {
        const zipInput = screen.getByPlaceholderText(/Zip Code/i);
        userEvent.type(zipInput, '0000'); // Trigger validation with an incorrect zip code
        const errorMessage = await screen.findByText('Invalid zip code');
        expect(errorMessage).toBeInTheDocument();
    });


    it('validates VAT number input correctly', async () => {
        //render(<CheckoutPage cartItems={[]} removeItem={() => {}} setCartItems={() => {}} />);

        // Find the VAT number input field
        const vatInput = screen.getByPlaceholderText(/Company VAT Number/i); // Use the actual placeholder text

        // Simulate typing an invalid VAT number
        userEvent.type(vatInput, '1234');
        await waitFor(() => {
            const errorMessage = screen.getByText('Invalid VAT number');
            expect(errorMessage).toBeInTheDocument();
            expect(vatInput).toHaveStyle('border-color: red');
        });


        // Clear the input and type a valid VAT number
        userEvent.clear(vatInput);
        userEvent.type(vatInput, '12345678'); // Assuming '12345678' is considered valid
        await waitFor(() => {
            const errorMessageQuery = screen.queryByText('Invalid VAT number');
            expect(errorMessageQuery).toBeNull(); // The error message should not be found
            expect(vatInput).toHaveStyle('border-color: green');
        });
    });

    it('validates phone input correctly', async () => {
        //render(<CheckoutPage cartItems={[]} removeItem={() => {}} setCartItems={() => {}} />);

        // Find the phone input field
        const phoneInput = screen.getByPlaceholderText(/Phone \(8 digits if Denmark\)/i); // Adjust the placeholder text as needed

        // Simulate typing an invalid phone number
        userEvent.type(phoneInput, '12345');
        await waitFor(() => {
            const errorMessage = screen.getByText('Invalid phone number');
            expect(errorMessage).toBeInTheDocument();
            expect(phoneInput).toHaveStyle('border-color: red');
        });

        // Clear the input and type a valid phone number
        userEvent.clear(phoneInput);
        userEvent.type(phoneInput, '12345678'); // Assuming '12345678' is considered valid
        await waitFor(() => {
            const errorMessageQuery = screen.queryByText('Invalid phone number');
            expect(errorMessageQuery).toBeNull(); // The error message should not be found
            expect(phoneInput).toHaveStyle('border-color: green');
        });
    });


    it('validates email input correctly', async () => {
        //render(<CheckoutPage cartItems={[]} removeItem={() => {}} setCartItems={() => {}} />);
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
        //render(<CheckoutPage cartItems={[]} removeItem={() => {}} setCartItems={() => {}} />);
        const emailInput = screen.getByTestId("emailInput");
        userEvent.type(emailInput, 'invalid-email'); // Trigger validation
        // Use `await` with `findByText` to wait for async updates
        const errorMessage = await screen.findByText('Invalid email');
        // Assert the error message is in the document
        expect(errorMessage).toBeInTheDocument();
    });



});