'use strict';

const DEFAULT_TIMEOUT_MS = 15000;

const isAxiosAvailable = () => typeof window !== "undefined" && typeof window.axios !== "undefined";

const createHttpClient = (options = {}) => {
  if (!isAxiosAvailable()) {
    throw new Error("axiosが読み込まれていません。先にaxiosを読み込んでください。");
  }

  const client = window.axios.create({
    timeout: options.timeout ?? DEFAULT_TIMEOUT_MS,
    ...options,
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const status = error.response.status;
        if (status === 401 || status === 419) {
          window.location.href = "/login?timeout";
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

window.ProjectManagementHttpClient = {
  create: createHttpClient,
};