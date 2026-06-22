# hello-rails

Aplicação Rails 8 (API-only) que expõe um endpoint na root retornando `{"message":"hello"}`,
rodando na AWS ECS (Fargate) atrás de um Application Load Balancer HTTP, com infraestrutura
definida em AWS CDK (TypeScript).

## Estrutura

```
hello-rails/
  rails-app/   # aplicação Rails (Ruby 3.4.5 / Rails 8.1) + Dockerfile de produção
  infra/       # app AWS CDK (TypeScript) — VPC, ECS Fargate, ALB, ECR, Secrets Manager
  .github/     # workflows: ci.yml (lint/security/test) e deploy.yml (cdk deploy via OIDC)
```

## Endpoints

- `GET /`   → `{"message":"hello"}` (`application/json`)
- `GET /up` → healthcheck do Rails (usado pelo target group do ALB)

## Desenvolvimento local

```bash
cd rails-app
bin/rails server          # http://localhost:3000/
bin/rails test
bin/rubocop
```

Imagem de produção:

```bash
docker build -t hello-rails rails-app/
docker run -p 8080:80 -e SECRET_KEY_BASE=$(openssl rand -hex 32) hello-rails
curl http://localhost:8080/
```

## Deploy (AWS)

Pré-requisitos: credenciais AWS (`us-east-1`), Docker rodando, Node.js, e bootstrap do CDK
uma única vez por conta/região.

```bash
cd infra
npm ci
npx cdk bootstrap          # apenas na primeira vez
npx cdk deploy             # builda a imagem e provisiona tudo
```

Ao final, o output `LoadBalancerUrl` traz a URL pública do endpoint.

Limpeza: `npx cdk destroy`.

### CI/CD

- **CI** (`.github/workflows/ci.yml`): roda em PRs e pushes — Brakeman, bundler-audit,
  RuboCop e testes do Rails.
- **Deploy** (`.github/workflows/deploy.yml`): em push na `main`, assume uma role AWS via
  OIDC e roda `cdk deploy`.

Para o deploy funcionar, configure no repositório:
- O secret `AWS_DEPLOY_ROLE_ARN` apontando para uma IAM Role com trust no GitHub OIDC
  provider e permissão para o `cdk deploy`.
