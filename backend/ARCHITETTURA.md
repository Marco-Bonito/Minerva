# Architettura cartelle backend Minerva

Questa documentazione spiega la struttura delle cartelle del backend e fornisce esempi di codice per ogni sezione.

---

## Struttura principale

- **src/**: Codice sorgente TypeScript.
- **logs/**: File di log generati dall'applicazione.
- **uploads/**: File caricati dagli utenti.

---

## 1. config

**Funzione:** Configurazione (DB, env, chiavi servizio).

**Esempio:**
```ts
// src/config/db.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './minerva-book-firebase-key.json';

initializeApp({ credential: cert(serviceAccount) });
export const db = getFirestore();
```

---

## 2. constants

**Funzione:** Costanti riutilizzabili.

**Esempio:**
```ts
// src/constants/httpStatus.ts
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};
```

---

## 3. controllers

**Funzione:** Gestione richieste HTTP.

**Esempio:**
```ts
// src/controllers/book.controller.ts
import * as bookService from '../services/book.services';
export const getBooks = async (req, res, next) => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};
```

---

## 4. middlewares

**Funzione:** Middleware Express (auth, error, ecc).

**Esempio:**
```ts
// src/middlewares/auth.middleware.ts
import jwt from 'jsonwebtoken';
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

---

## 5. models

**Funzione:** Tipi TypeScript per i dati.

**Esempio:**
```ts
// src/models/book.model.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
}
```

---

## 6. routes

**Funzione:** Definizione delle rotte Express.

**Esempio:**
```ts
// src/routes/book.route.ts
import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
const router = Router();
router.get('/', bookController.getBooks);
export default router;
```

---

## 7. services

**Funzione:** Logica di business e accesso DB.

**Esempio:**
```ts
// src/services/book.services.ts
import { db } from '../config/db';
export const getAllBooks = async () => {
  const snapshot = await db.collection('books').get();
  return snapshot.docs.map(doc => doc.data());
};
```

---

## 8. utils

**Funzione:** Funzioni di utilità generiche.

**Esempio:**
```ts
// src/utils/hashPassword.ts
import bcrypt from 'bcryptjs';
export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);
```

---

## 9. validations

**Funzione:** Schemi di validazione (Joi).

**Esempio:**
```ts
// src/validations/book.validation.ts
import Joi from 'joi';
export const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  year: Joi.number().integer().min(0),
});
```

---

## 10. tests

**Funzione:** Test automatici (Jest).

**Esempio:**
```ts
// src/tests/book.test.ts
import { getAllBooks } from '../services/book.services';
test('getAllBooks returns array', async () => {
  const books = await getAllBooks();
  expect(Array.isArray(books)).toBe(true);
});
```

---

## Pattern generali
- Separazione responsabilità: ogni cartella ha un ruolo chiaro.
- Naming convention: nomi chiari e coerenti.
- Modularità: ogni risorsa ha controller, service, model, validation dedicati.
- Centralizzazione: le route sono centralizzate in `routes/index.ts`.

---

Per domande o approfondimenti su una sezione specifica, chiedi pure!