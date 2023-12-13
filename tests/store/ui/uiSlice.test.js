import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store";

describe('pruebas en uiSlice', () => {
    test('debe de tener el estado por default/inicial', () => {
        expect(uiSlice.getInitialState()).toEqual({ isDateModalOpen: false });
    });

    test('debe de cambiar el isDateModalOpen correctamente', () => {
        let state = uiSlice.getInitialState();
        state = uiSlice.reducer(state, onOpenDateModal());
        expect(state.isDateModalOpen).toBeTruthy();
        
        state = uiSlice.reducer(state, onCloseDateModal());
        expect(state.isDateModalOpen).toBeFalsy();
    });
})