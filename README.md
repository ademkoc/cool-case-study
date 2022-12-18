# Github User-Organization Comparator

## Infrastructure

* I developed the project with Fastify Web framework using JavaScript.
* Fastify offers dynamic Swagger document generation and advanced plugin management.
* With Fastify-Autoload, plugins and routes folders are initialized in parallel and automatically.
* I had to write unit test functions with Vitest, not Jest. Because Jest's ESM support is experimental.

## Domain

* When fetching the User/Organization repository, I am fetching 30 records.
* To get the programming language details of these records, I created a set by fetching the language details using the *repository.languages_url* property.
* These sets limited with 5 entries and It's ordered in descending order.
* At the intersection of the sets of user and organization sets, I determined a ratio by adding the size of that language in both sets and dividing by the total size.
* I added records to the database for these calculated common languages.

## Install

It has to be an `.env` file. Sample: `.env.defaults`

**Local**

```bash
node -v # 16.18.1
```

```bash
npm i
```

```bash
npm run dev
```

**With Docker**

```bash
npm run docker:build
```

```bash
npm run docker:run
```

For swagger documentation

```bash
http://localhost:8080/docs
```

## Usage

This API has two endpoints.

1. Calculate compability

```bash
curl --request GET \
  --url 'http://localhost:8080/v1/calculate-compability?org=nodejs&user=mcollina'
```

Response

```json
[
    {
        "language": "JavaScript",
        "ratio": 43.1
    },
    {
        "language": "HTML",
        "ratio": 7.96
    },
    {
        "language": "Python",
        "ratio": 8.43
    }
]
```

2. Listing calculated compability result

```bash
curl --request GET \
  --url 'http://127.0.0.1:8080/v1/best-matches?lang=JavaScript'
```

Response

```json
[
  {
    "_id": "639ec6bd59c66c2251e8c1c3",
    "user": "aykutkircan",
    "org": "nodejs",
    "user_stats": [...],
    "org_stats": [...],
    "language": "javascript",
    "language_pretty": "JavaScript",
    "ratio": 58.19,
    "created_at": 1671349949457,
    "updated_at": 1671349949457
  },
  {
    "_id": "639ec7373f372fd8adfaaa5a",
    "user": "Atakannbal",
    "org": "nodejs",
    "user_stats": [...],
    "org_stats": [...],
    "language": "javascript",
    "language_pretty": "JavaScript",
    "ratio": 55.43,
    "created_at": 1671350071594,
    "updated_at": 1671350071594
  },
  {
    "_id": "639f70433bc066c731349439",
    "user": "Atakannbal",
    "org": "nodejs",
    "user_stats": [...],
    "org_stats": [...],
    "language": "javascript",
    "language_pretty": "JavaScript",
    "ratio": 55.43,
    "created_at": 1671393347250,
    "updated_at": 1671393347250
  },
  {
    "_id": "639f7e010c59ffcffebae899",
    "user": "mcollina",
    "org": "nodejs",
    "user_stats": [...],
    "org_stats": [...],
    "language": "javascript",
    "language_pretty": "JavaScript",
    "ratio": 43.1,
    "created_at": 1671396865891,
    "updated_at": 1671396865891
  }
]

```