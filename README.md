# fgac-least-privilege-poc

A proof-of-concept NestJS API demonstrating **Fine-Grained Access Control (FGAC)** built on the **Principle of Least Privilege (PoLP)**. Rather than relying on broad role-based gates, this system grants each user only the specific resource-action scopes they need - nothing more.

---


## Concept Overview
This project explores a more granular alternative: each user is assigned a **permission record** containing an explicit list of **scopes** they are allowed to exercise. A scope is a string of the form `Resource:action` - for example, `Sale:update` or `Sale:read`. Nothing is inferred from a role; access is only granted if the exact scope is present.


The system also supports a **multi-tenant** model, where permissions are scoped per tenant. A user may have `Sale:update` in Tenant A and has none in Tenant B.



## Architecture

```
Request
  │
  ├── JwtAuthGuard          → Verifies JWT, attaches user to request
  │
  └── FineGrainedPermissionGuard
        ├── Is SuperAdmin?          → Bypass all checks
        ├── Has @RequirePermission? → Extract resource + action
        ├── Derive tenantId         → From route params or body
        ├── Load Permission record  → Filtered by user + tenantId
        └── Check scope             → `resource:action` ∈ scopes[]
```


Guards are applied at the controller method level via `@UseGuards()`. The `@RequirePermission()` decorator annotates what scope a route requires, and the guard resolves it at runtime.


### `Permission`

A single record per user. The `scopes` column is a JSON array of allowed scope strings, and `tenantId` confines the permission to a specific tenant.



## Permission Model

Scopes follow a `Resource:action` convention. The resource name is derived from the entity class name (e.g. `Sale`), and the action describes the operation being gated.

| Scope | Meaning |
|---|---|
| `Sale:read` | View sales records for a tenant |
| `Sale:create` | Create a new sale record |
| `Sale:update` | Modify an existing sale record |
| `Sale:delete` | Remove a sale record |

A user's `Permission.scopes` array holds whichever of these they have been explicitly granted. Any scope not present is implicitly denied.



### SuperAdmin Bypass

Users with `isSuperAdmin: true` bypass the scope check entirely. This is the only role-level shortcut in the system - all other access decisions are resolved from the `scopes` array.



---

## The `@RequirePermission` Decorator

```typescript
@RequirePermission('Sale', 'update')

```

This decorator attaches metadata to a route handler using NestJS's `SetMetadata`. It takes two arguments:

| Argument | Description | Example |
|---|---|---|
| `resource` | The resource being accessed | `'Sale'`, `Sale.name` |
| `action` | The operation being performed | `'read'`, `'update'`, `'delete'` |

The guard reads this metadata at request time via `Reflector.getAllAndOverride()`. If a route has no `@RequirePermission` decorator, the guard allows access through - useful for public or internally-trusted routes.

---

## The `FineGrainedPermissionGuard`

`FineGrainedPermissionGuard` implements `CanActivate` and runs after `JwtAuthGuard` has authenticated the user. Its decision logic follows this sequence:

```
1. No authenticated user?          → 401 Unauthorized
2. user.isSuperAdmin === true?     → Allow (bypass)
3. No @RequirePermission on route? → Allow (open route)
4. Derive tenantId from request    → params.tenantID ?? body.tenantID
5. No tenantId found?              → 403 Forbidden
6. Load Permission where user.id + tenantId match
7. No permission record found?     → 403 Forbidden
8. requiredScope ∈ scopes[]?       → Allow
9. Scope missing?                  → 403 Forbidden (`Missing required permission: [Sale:update]`)
```

The guard resolves the `tenantId` from either the route params or the request body, making it flexible for both RESTful resource routes and body-driven requests.

---

## Usage Example
```typescript
  import { Tenant } from './tenant.entity';

  @UseGuards(JwtAuthGuard, FineGrainedPermissionGuard)
  @RequirePermission(Tenant.name, 'create')
  @Post()
  async createTenant(@Body() body: CreateTenantDto){
    return await this.tenantsService.createTenant(
      body.name,
      body.tenantAdminName,
      body.tenantAdminEmail
    )
  }

```


## Running the Project

### Prerequisites

- Node.js >= 18
- PostgreSQL
- A `.env` file (see below)

### Environment Variables

```env
DB_USERNAME=admin
DB_PASSWORD=admin
DB_NAME=fgac_db
DB_HOST=localhost
DB_PORT=5432
PGADMIN_EMAIL=admin@gmail.com
PGADMIN_PASSWORD=admin-password
JWT_SECRET=the-most-secret-thing-ever
```

### Install and Start

```bash
npm install
npm run start:dev
```

### Swagger Docs

API documentation is available at:

```
http://localhost:3000/api-docs
```

---

## Things to Note
1. For every created module that will be access via API endpoint, update its CRUD actions in the permissions overview function.
2. For every created module that will be access via API endpoint, import the Tenant and Permission entities as a TypeORModule feature.
3. To avoid typographical error, use the name attribute of entity classes, together with the CRUD action in the `@RequiredPermission()` decorator.
4. For every new module/resource created, there's need to update the permission of the tenant admin in relation to it. This can be manually done by the tenant admin updating their permission scope, or a Cron job can defined to auto-update scopes for all new resources.
