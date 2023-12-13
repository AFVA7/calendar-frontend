import { configureStore } from "@reduxjs/toolkit"
import { authSlice } from "../../src/store"
import { act, renderHook, waitFor } from "@testing-library/react"
import { useAuthStore } from "../../src/hooks"
import { Provider } from "react-redux"
import { initialState, notAuthenticatedState } from "../fixtures/authStates"
import { testUserCredentials } from "../fixtures/authUser"
import { calendarAPI } from "../../src/api"

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}
describe('Pruebas en useAuthstore', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    test('debe de regresar los valores por default', () => {
        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });
        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
        })
    });

    test('startLogin debe de realizar el login correctamente', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin(testUserCredentials)
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            status: 'authenticated',
            user: { name: 'Test', uid: '65786c4f4485b67dbc0fb10a' },
            errorMessage: undefined,
        });

        //todo lo q se graba en el localStorage termina siento un string
        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
    });

    test('startLogin debe de fallar la autenticación', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin({ email: 'algo@gmail.com', password: '123456' });
        });
        const { errorMessage, status, user } = result.current;
        expect(localStorage.getItem('token')).toBeNull();
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        });

        await waitFor(() => {
            expect(result.current.errorMessage).toBeUndefined();
        });

    });

    test('startRegister debe de crear un usuario', async () => {
        const newUser = { email: 'algo@gmail.com', password: '123456', name: 'Test user 2' };
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarAPI, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: '123',
                name: 'Test User',
                token: 'ALGUN-TOKEN',
                msg: 'Usuario creado correctamente'
            }
        });

        await act(async () => {
            await result.current.startRegister(newUser);
        });
        const { errorMessage, status, user } = result.current;
        console.log({ errorMessage, status, user });

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '123' }
        });
        spy.mockRestore();
    });

    test('startRegister debe de fallar la creación', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });


        await act(async () => {
            await result.current.startRegister(testUserCredentials);
        });
        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'El usuario con ese correo ya existe',
            status: 'not-authenticated',
            user: {}
        });
    });

    test('checkAuthToken debe de fallar si no hay token', async () => {

        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });
    });

    test('checkAuthToken debe de autenticar el user si hay token', async () => {

        const { data } = await calendarAPI.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test', uid: '65786c4f4485b67dbc0fb10a' }
        });
    });
});