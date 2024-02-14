module.exports = {
  apps: [
    {
      name: "nome-do-app",
      script: "./src/server.ts",
      watch: false,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
