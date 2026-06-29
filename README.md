# Descrição

- Librum é um sistema simples de uma biblioteca. Ele tem como objetivo resolver alguns dos problemas existentes, como o gerenciamento de usuários (aluno, bibliotecário e admin), gerenciamento de empréstimos e devoluções, criação e listagem dos livros existentes e etc.

# Como rodar o projeto

## Instalar as dependências

```bash
$ yarn install
```

### Docker

Para rodar o projeto utilizando o docker, basta executar os seguintes comandos:

```bash
docker compose up -d --build
```

Caso tenha o task instalado, uma outra maneira de iniciar o projeto também utilizando o docker é através do comando:

```bash
task
```

Por baixo dos panos, ele vai estar executando o comando anterior relacionado ao docker.

### Sem docker

```bash
yarn start:dev
```

# Diagrama UML

## Entidades

```mermaid
classDiagram
    class EntityId {
        -value: string

        +equals(other: EntityId) boolean
        +isValid(id: string)$ boolean
        +toString() string
    }

    class UserEntity {
        <<abstract>>
        #id: EntityId
        #name: string
        #lastName: string
        #email: string
        #password: string
        #role: UserRoles
        #createdAt: Date

        #validate() void
        +setName(name: string) void
        +setLastName(lastName: string) void
        +setEmail(email: string) void
        +setPassword(password: string) void
        +getId() EntityId
        +getName() string
        +getLastName() string
        +getEmail() string
        +getPassword() string
        +getRole() UserRoles
    }

    class TenantEntity {
        #birthDate: string
        #role: UserRoles

        #validate() void
        +getBirthDate() string
    }

    class LibrarianEntity {
        #role: UserRoles
        -approved: boolean
        -disabled: boolean
        -approvedAt: Date
        -disabledAt: Date

        #validate() void
        +isApproved() boolean
        +isDisabled() boolean
        +getApprovedAt() Date
        +getDisabledAt() Date
        +markDisabled() boolean
        +markApproved() boolean
        +getStatus() LibrarianStatus
    }

    class AdminEntity {
        #role: UserRoles
    }

    class AuthorEntity {
        -id: EntityId
        -name: string

        #validate() void
        +copy() AuthorEntity
        +getId() string
        +setName() void
        +getName() string
    }

    class BookEntity {
        -id: EntityId
        -title: string
        -authors: AuthorEntity[]
        -releaseDate: string
        -description: string

        #validate() void
        +copy() BookEntity
        +setTitle(title: string) void
        +setAuthors(authors: AuthorEntity[]) void
        +setReleaseDate(releaseDate: string) void
        +setDescription(description: string) void
        +getId() EntityId
        +getTitle() string
        +getDescription() string
        +getAuthors() AuthorEntity[]
        +getReleaseDate() string
    }

    class LoanEntity {
        -id: EntityId
        -tenant: TenantEntity
        -book: BookEntity
        -dueDate: Date
        -createdAt: Date

        #validate() void
        -generateDueDate(createdAt: Date) Date
        +getId() EntityId
        +getTenant() TenantEntity
        +getBook() BookEntity
        +getDueDate() Date
        +getCreatedAt() Date
    }

    class ReturnsEntity {
        -id: EntityId
        -loan: LoanEntity
        -createdAt: Date

        #validate() void
        +getId() EntityId
        +getLoan() LoanEntity
        +getCreatedAt() Date
    }

    UserEntity *-- EntityId
    AuthorEntity *-- EntityId
    BookEntity *-- EntityId
    LoanEntity *-- EntityId
    ReturnsEntity *-- EntityId

    BookEntity "1" --> "1..*" AuthorEntity : tem
    ReturnsEntity "0..1" --> "1" LoanEntity: tem

    UserEntity <|-- TenantEntity
    UserEntity <|-- LibrarianEntity
    UserEntity <|-- AdminEntity
```
