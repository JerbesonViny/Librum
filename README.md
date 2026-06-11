## Descrição

- TODO

## Instalar as dependências

```bash
$ yarn install
```

## Rodar o projeto

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
