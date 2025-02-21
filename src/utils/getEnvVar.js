import 'dotenv/config';

export const getEnvVar= (envVarName, defaultValue) => {
    if (!envVarName) {
        throw new Error("Environment variable name is required!");
    }
    const envVar = process.env[envVarName];
    if (envVar === undefined || envVar === "") {
        if (defaultValue !== undefined) {
            return defaultValue; 
        }
        throw new Error (`Env var with name ${envVarName} not exist!`); 
    }
    return envVar;
};