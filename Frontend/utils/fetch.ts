

class Fetch {
  static async get<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async post<T>(url: string, data: any, headers: HeadersInit = {}): Promise<{ json: Promise<T>; response: Response }> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return {
      json: response.json(),
      response, 
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async put<T>(url: string, data: any, headers: HeadersInit = {}): Promise<{ json: Promise<T>; response: Response }> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const contentLength = response.headers.get('Content-Length');
    const contentType = response.headers.get('Content-Type');
    const hasBody = contentLength !== '0' && contentType && contentType.includes('application/json');

    return {
      json: hasBody ? response.json() : Promise.resolve(null),
      response,
    };
  }

  static async delete(url: string, headers: HeadersInit = {}): Promise<void> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  }
}

export default Fetch;