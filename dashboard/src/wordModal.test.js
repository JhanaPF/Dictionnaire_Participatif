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

    // ------ add select "Class" input ---------

    it("Translated definition input", async () => {
        const wordInput = screen.queryByTestId('translated_definition');
        user.type(wordInput, 'haha');
        await waitFor(() => {  
            expect(wordInput.value).toEqual("haha");
        });
    });

    it("Definition input", async () => {
        const wordInput = screen.queryByTestId('definition');
        user.type(wordInput, 'haha');
        await waitFor(() => {  
            expect(wordInput.value).toEqual("haha");
        });
    });

    it("Riddle input", async () => {
        const wordInput = screen.queryByTestId('riddle');
        user.type(wordInput, 'haha');
        await waitFor(() => {  
            expect(wordInput.value).toEqual("haha");
        });
    });

    it("Translated riddle input", async () => {
        const wordInput = screen.queryByTestId('translated_riddle');
        user.type(wordInput, 'haha');
        await waitFor(() => {  
            expect(wordInput.value).toEqual("haha");
        });
    });

    it("Story input", async () => {
        const wordInput = screen.queryByTestId('story');
        user.type(wordInput, 'haha');
        await waitFor(() => {  
            expect(wordInput.value).toEqual("haha");
        });
    });

    it("Sentence input", async () => {
        const wordInput = screen.queryByTestId('sentence');
        user.type(wordInput, 'haha');
        await waitFor(() => {  
            expect(wordInput.value).toEqual("haha");
        });
    });

    // ----- add select "Level" input
    // ----- add select "Categories" input
    // ----- add select "Source" input




});