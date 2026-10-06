import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '15s', target: 0 },
    ],
};

const BASE_URL = __ENV.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export default function () {
    const jar = http.cookieJar();

    // 1. GET Login Page
    const getLoginRes = http.get(`${BASE_URL}/web/index.php/auth/login`, { jar });

    check(getLoginRes, {
        'login page loaded': (r) => r.status === 200,
    });

    sleep(1);

    // 2. Submit Login
    const loginPayload = {
        username: 'Admin',
        password: 'admin123',
    };

    const loginRes = http.post(`${BASE_URL}/web/index.php/auth/validate`, loginPayload, { jar });

    const isLoggedIn = check(loginRes, {
        'login status is valid': (r) => r.status === 200 || r.status === 302,
    });

    sleep(1);

    // 3. Create Employee
    if (isLoggedIn) {
        const uniqueId = Math.floor(Math.random() * 899999 + 100000).toString();

        const empPayload = JSON.stringify({
            firstName: 'K6Load',
            middleName: 'Test',
            lastName: `User${uniqueId}`,
            employeeId: uniqueId,
        });

        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
            },
            jar: jar, // Meneruskan cookie hasil login
        };

        const createRes = http.post(`${BASE_URL}/web/index.php/api/v2/pim/employees`, empPayload, params);

        check(createRes, {
            'employee created successfully': (r) => r.status === 200 || r.status === 201,
        });
    }

    sleep(2);
}