/**
 * Fetches the city name from a given Danish zip code.
 * @param zipCode The zip code to query for its city name.
 * @returns A promise that resolves to the city name.
 */
export const fetchCityNameFromZip = (zipCode: string): Promise<string[]> => {
    const apiUrl = `https://api.dataforsyningen.dk/postnumre/autocomplete?q=${zipCode}`;

    return new Promise((resolve, reject) => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    // The API returns multiple possible matches for the zip code,
                    // so you could resolve with all matched city names, or just the first one.
                    // Here, we resolve with an array of all matched city names.
                    const cityNames = data.map((item: { postnummer: { navn: never; }; }) => item.postnummer.navn);
                    console.log(data);
                    resolve(cityNames);
                } else {
                    reject(new Error('City not found for provided zip code'));
                }
            })
            .catch(error => {
                reject(error);
            });
    });
};


/**
 * Validates an email address.
 * @param email The email address to validate.
 * @returns True if the email is valid, otherwise false.
 */
export const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(email.toLowerCase());
};

/**
 * Validates a Danish phone number.
 * @param phone The phone number to validate.
 * @returns True if the phone number is valid, otherwise false.
 */
export const validatePhoneNumber = (phone: string): boolean => {
    return /^\d{8}$/.test(phone);
};

/**
 * Validates a Danish VAT number.
 * @param vatNumber The VAT number to validate.
 * @returns True if the VAT number is valid, otherwise false.
 */
export const validateVATNumber = (vatNumber: string): boolean => {
    return /^\d{8}$/.test(vatNumber);
};
