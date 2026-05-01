/**
 * Live API smoke test suite.
 *
 * Start the backend first, then run:
 *   npm run test:api
 */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  endpoint: string;
  statusCode?: number;
  error?: string;
  duration: number;
}

interface RequestOptions {
  data?: unknown;
  expectedStatus?: number | number[];
  token?: string;
}

class APITester {
  private readonly baseURL: string;
  private readonly results: TestResult[] = [];
  private accessToken = '';
  private refreshToken = '';
  private testPhone = '+964771' + Math.random().toString().slice(2, 8);

  constructor(baseURL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1') {
    this.baseURL = baseURL;
  }

  async runAllTests() {
    console.log(`Starting live API smoke tests against ${this.baseURL}\n`);

    await this.testHealth();
    await this.testAuthentication();
    await this.testUserEndpoints();
    await this.testListingEndpoints();
    await this.testCategoryEndpoints();
    await this.testFavoriteEndpoints();
    await this.testNotificationEndpoints();
    await this.testAdminEndpoints();

    this.printResults();

    if (this.results.some((result) => result.status === 'FAIL')) {
      process.exitCode = 1;
    }
  }

  private async request(
    name: string,
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<TestResult> {
    const start = Date.now();
    const result: TestResult = {
      name,
      status: 'PASS',
      endpoint,
      duration: 0,
    };

    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (options.data) headers['Content-Type'] = 'application/json';
      if (options.token || this.accessToken) {
        headers.Authorization = `Bearer ${options.token || this.accessToken}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers,
        body: options.data ? JSON.stringify(options.data) : undefined,
      });

      result.statusCode = response.status;
      const expectedStatuses = Array.isArray(options.expectedStatus)
        ? options.expectedStatus
        : [options.expectedStatus || 200];

      if (!expectedStatuses.includes(response.status)) {
        const body = await response.text();
        result.status = 'FAIL';
        result.error = `Expected ${expectedStatuses.join(' or ')} but got ${response.status}: ${body}`;
      }

      if (name === 'Verify OTP' && response.ok) {
        const body = (await response.json()) as any;
        const payload = body.data || body;
        this.accessToken = payload.accessToken || '';
        this.refreshToken = payload.refreshToken || '';
      }
    } catch (error: any) {
      result.status = 'FAIL';
      result.error = error.message;
    }

    result.duration = Date.now() - start;
    this.results.push(result);
    console.log(`  ${result.status} ${name} (${result.duration}ms)`);
    return result;
  }

  private async testHealth() {
    console.log('Health');
    await this.request('Health check', 'GET', '/health', {
      expectedStatus: [200, 404],
    });
  }

  private async testAuthentication() {
    console.log('\nAuthentication');
    await this.request('Send OTP', 'POST', '/auth/send-otp', {
      data: { phoneNumber: this.testPhone },
      expectedStatus: [201, 400],
    });
    await this.request('Verify OTP', 'POST', '/auth/verify-otp', {
      data: { phoneNumber: this.testPhone, otp: '000000' },
      expectedStatus: [201, 400],
    });

    if (this.refreshToken) {
      await this.request('Refresh token', 'POST', '/auth/refresh', {
        data: { refreshToken: this.refreshToken },
        expectedStatus: 201,
      });
    }
  }

  private async testUserEndpoints() {
    console.log('\nUsers');
    await this.request('Get current user', 'GET', '/auth/me', {
      expectedStatus: this.accessToken ? 200 : 401,
    });
    await this.request('Update profile', 'PUT', '/auth/me', {
      data: { firstName: 'Test', lastName: 'User', city: 'Baghdad' },
      expectedStatus: this.accessToken ? 200 : 401,
    });
  }

  private async testListingEndpoints() {
    console.log('\nListings');
    await this.request('Get listings', 'GET', '/listings?page=1&pageSize=20');
    await this.request('Get featured listings', 'GET', '/listings/featured/top?limit=12');
    await this.request('Search listings', 'GET', '/listings/search?q=car&page=1');
    await this.request('Get my listings', 'GET', '/listings/user/me', {
      expectedStatus: this.accessToken ? 200 : 401,
    });
  }

  private async testCategoryEndpoints() {
    console.log('\nCategories');
    await this.request('Get categories', 'GET', '/categories');
  }

  private async testFavoriteEndpoints() {
    console.log('\nFavorites');
    await this.request('Get favorites', 'GET', '/favorites', {
      expectedStatus: this.accessToken ? 200 : 401,
    });
    await this.request('Get favorites legacy path', 'GET', '/favorites/me', {
      expectedStatus: this.accessToken ? 200 : 401,
    });
  }

  private async testNotificationEndpoints() {
    console.log('\nNotifications');
    await this.request('Get notifications', 'GET', '/notifications/me', {
      expectedStatus: this.accessToken ? 200 : 401,
    });
    await this.request('Get notification preferences', 'GET', '/notifications/me/preferences', {
      expectedStatus: this.accessToken ? 200 : 401,
    });
  }

  private async testAdminEndpoints() {
    console.log('\nAdmin');
    await this.request('Get admin stats', 'GET', '/admin/stats', {
      expectedStatus: this.accessToken ? [200, 403] : 401,
    });
    await this.request('Get admin reports', 'GET', '/admin/reports', {
      expectedStatus: this.accessToken ? [200, 403] : 401,
    });
  }

  private printResults() {
    const passed = this.results.filter((result) => result.status === 'PASS').length;
    const failed = this.results.length - passed;
    const averageDuration =
      this.results.reduce((sum, result) => sum + result.duration, 0) / this.results.length;

    console.log('\nResults');
    console.log(`  Total: ${this.results.length}`);
    console.log(`  Passed: ${passed}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Average response: ${averageDuration.toFixed(0)}ms`);

    for (const result of this.results.filter((item) => item.status === 'FAIL')) {
      console.log(`\nFAIL ${result.name} ${result.endpoint}`);
      console.log(`  ${result.error}`);
    }
  }
}

new APITester().runAllTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
