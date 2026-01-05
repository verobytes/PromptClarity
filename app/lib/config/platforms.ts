import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface PlatformConfig {
  name: string;
  provider: string;
  model: string;
}

export interface PlatformConfigWithId extends PlatformConfig {
  id: string;
}

// Find config file path - checks user config first, then falls back to defaults
function findConfigPath(relativePath: string): string {
  const userConfigPath = path.join(process.cwd(), 'data', 'config', relativePath);
  const defaultConfigPath = path.join(process.cwd(), 'config', relativePath);

  if (fs.existsSync(userConfigPath)) {
    console.log(`Loading config from user path: ${userConfigPath}`);
    return userConfigPath;
  }

  console.log(`Loading config from default path: ${defaultConfigPath}`);
  return defaultConfigPath;
}

// Load platform configurations from YAML file
function loadPlatformConfigs(): Record<string, PlatformConfig> {
  const configPath = findConfigPath('platforms/platforms.yaml');
  const fileContents = fs.readFileSync(configPath, 'utf8');
  const data = yaml.load(fileContents) as { platforms: Record<string, PlatformConfig> };
  return data.platforms;
}

// Load configurations once
export const platformConfigs: Record<string, PlatformConfig> = loadPlatformConfigs();

export const availablePlatforms: PlatformConfigWithId[] = Object.entries(platformConfigs).map(([id, config]) => ({
  id,
  ...config
}));

// Create singleton maps for efficient lookups
const providerMap = new Map<string, PlatformConfig>();
const nameMap = new Map<string, PlatformConfig>();
const idToConfigMap = new Map<string, PlatformConfigWithId>();

// Initialize the maps once
Object.entries(platformConfigs).forEach(([id, config]) => {
  providerMap.set(config.provider, config);
  nameMap.set(config.name, config);
  idToConfigMap.set(id, { id, ...config });
});

export function getPlatformConfig(platformId: string): PlatformConfig | undefined {
  return platformConfigs[platformId];
}

export function getPlatformConfigWithId(platformId: string): PlatformConfigWithId | undefined {
  return idToConfigMap.get(platformId);
}

export function getPlatformByProvider(provider: string): PlatformConfig | undefined {
  return providerMap.get(provider);
}

export function getPlatformByName(name: string): PlatformConfig | undefined {
  return nameMap.get(name);
}