type TPropsReqXHR = {
  url: string;
  data: unknown;
  httpMethod: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
};

type TInitAtomRequest = {
  abortTimeoutDefaultValue: number;
};

class AtomRequest {
  xhr: XMLHttpRequest;
  abortTimeoutDefaultValue = 10000;

  constructor() {
    this.xhr = new XMLHttpRequest();
  }

  initAtomRequest(props: TInitAtomRequest) {
    this.abortTimeoutDefaultValue = props.abortTimeoutDefaultValue;
  }

  request(props: TPropsReqXHR) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.xhr.abort();
        console.error("ERROR Atom: abort http request");
      }, this.abortTimeoutDefaultValue);

      this.xhr.open(props.httpMethod, props.url, true);
      this.xhr.setRequestHeader("Content-Type", "application/json");

      if (props.headers) {
        for (const [key, value] of Object.entries(props.headers)) {
          this.xhr.setRequestHeader(key, value);
        }
      }

      this.xhr.onload = () => {
        clearTimeout(timeout);
        if (this.xhr.status === 200) {
          console.info(`server request completed, URL: ${props.url}`);
          resolve(this.xhr.responseText);
        } else {
          console.error("ERROR Atom: something went wrong");
          reject("Network error");
        }
      };

      this.xhr.onerror = () => {
        console.error(
          `ERROR Atom: something went wrong, status: ${this.xhr.status}`
        );
        reject("Network error");
      };

      this.xhr.send();
    });
  }

  async get(url: string, data: unknown) {
    try {
      const method = "GET";
      return await this.request({
        httpMethod: method,
        url: url,
        data: data,
      });
    } catch (err) {
      console.error("ERROR Atom: ", err);
    }
  }

  async post(url: string, data: unknown) {
    try {
      const method = "POST";
      return await this.request({
        httpMethod: method,
        url: url,
        data: JSON.stringify(data),
      });
    } catch (err) {
      console.error("ERROR Atom: ", err);
    }
  }

  async put(url: string, data: unknown) {
    try {
      const method = "PUT";
      return await this.request({
        httpMethod: method,
        url: url,
        data: JSON.stringify(data),
      });
    } catch (err) {
      console.error("ERROR Atom: ", err);
    }
  }

  async delete(url: string, data: unknown) {
    try {
      const method = "DELETE";
      return await this.request({
        httpMethod: method,
        url: url,
        data: data,
      });
    } catch (err) {
      console.error("ERROR Atom: ", err);
    }
  }
}

export const atomRequest = new AtomRequest();
