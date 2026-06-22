// Per-environment configuration. Each environment is deployed as its own
// CloudFormation stack with its own isolated resources (VPC, cluster, ALB,
// secret, Fargate service), so QA and PROD never share infrastructure.

export type EnvName = 'QA' | 'PROD';

export interface EnvConfig {
  /** Logical name, also used as a suffix for stack and resource names. */
  readonly name: EnvName;
  /** Fargate task CPU units (256 = 0.25 vCPU). */
  readonly cpu: number;
  /** Fargate task memory in MiB. */
  readonly memoryLimitMiB: number;
  /** Number of tasks to keep running. */
  readonly desiredCount: number;
  /** Number of NAT gateways. PROD uses one per AZ for resilience. */
  readonly natGateways: number;
}

const CONFIGS: Record<EnvName, EnvConfig> = {
  QA: {
    name: 'QA',
    cpu: 256,
    memoryLimitMiB: 512,
    desiredCount: 1,
    natGateways: 1,
  },
  PROD: {
    name: 'PROD',
    cpu: 512,
    memoryLimitMiB: 1024,
    desiredCount: 2,
    natGateways: 2,
  },
};

/**
 * Resolve the environment config from the `env` CDK context value
 * (e.g. `cdk deploy -c env=QA`). Throws on a missing or unknown value so a
 * misconfigured deploy fails fast instead of touching the wrong environment.
 */
export function resolveEnv(value: unknown): EnvConfig {
  if (value !== 'QA' && value !== 'PROD') {
    throw new Error(
      `Missing or invalid "env" context. Pass -c env=QA or -c env=PROD ` +
        `(got: ${value === undefined ? 'undefined' : JSON.stringify(value)}).`,
    );
  }
  return CONFIGS[value];
}
