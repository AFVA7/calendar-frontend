import calendarAPI from "../../src/api/calendarAPI";

describe('Pruebas en CalendarAPI', () => {
    test('debe de tener la configuración por defecto', () => {
        // console.log(process.env);
        // console.log(calendarAPI);
        expect(calendarAPI.defaults.baseURL).toBe(process.env.VITE_API_URL);
    });

    test('debe de tener el x-token en el header de todas las peticiones ', async() => {
        const token = 'ABC-123-XYZ';
        localStorage.setItem('token', token);
        const res = await calendarAPI.get('/auth');
        // console.log(res);
        expect(res.config.headers['x-token']).toBe(token);
    });
})