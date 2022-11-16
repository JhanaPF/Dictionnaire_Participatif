import React from 'react';
import WordModal from './wordModal';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import {expect} from '@jest/globals';


it("Modal renders without crashing", () => {
    const div = document.createElement("div");
    render(<WordModal></WordModal>, div);
});

describe("Form is working correctly", () => {

    beforeEach(() => { // Render the page before each test
        render(<WordModal></WordModal>);
    });
    
    it("Word input is working", async () => {
        const wordInput = screen.queryByTestId('word');
        user.type(wordInput, 'haha');
        await waitFor(() => {  
            expect(wordInput.value).toEqual("haha");
        });
    });

});