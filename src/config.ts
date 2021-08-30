export interface DatabaseConfig {
  url: string;
}

export interface Configuration {
  port: number;
  database: DatabaseConfig;
}

export interface EnvConfig {
  dev: Configuration;
  int: Configuration;
  prod: Configuration;
}

const commonConfig: Configuration = {
  port: 3000,
  database: {
    url: 'mongodb://localhost:27017/test',
  },
};

export default (): EnvConfig => ({
  dev: commonConfig,
  int: commonConfig,
  prod: commonConfig,
});
