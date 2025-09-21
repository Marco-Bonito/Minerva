# Minerva Backend – Documentazione API

## Autenticazione

### /api/auth/
Endpoint per login, registrazione e gestione autenticazione (Firebase JWT).

---

## Utenti

### /api/users/
CRUD utenti, recupero profilo, ecc.

---

## Libri

### /api/books/
- `POST /`  
  Crea un nuovo libro (richiede autenticazione).
  
  **Body:**
  ```json
  {
    "title": "Titolo libro",
    "author": "Autore",
    "description": "Descrizione",
    "fileUrl": "/uploads/abc.pdf",
    "isPublic": true
  }
  ```
  **Esempio cURL:**
  ```bash
  curl -X POST http://localhost:3000/api/books \
    -H "Authorization: Bearer <TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"title":"Libro","author":"Autore","fileUrl":"/uploads/abc.pdf","isPublic":true}'
  ```

- `GET /`  
  Elenco libri pubblici + privati dell’utente autenticato.

- `GET /:id`  
  Dettaglio libro (se pubblico o se owner).

- `PUT /:id`  
  Modifica libro (solo owner).

- `DELETE /:id`  
  Cancella libro (solo owner).

#### Modello Book
```ts
{
  id?: string,
  title: string,
  author: string,
  description?: string,
  fileUrl: string,
  ownerId: string,
  isPublic: boolean,
  createdAt?: Date,
  updatedAt?: Date
}
```

---

## Upload e Visualizzazione File

### /api/files/upload
- `POST` – Upload file PDF (autenticato, multipart/form-data, campo `file`).
  
  **Esempio cURL:**
  ```bash
  curl -X POST http://localhost:3000/api/files/upload \
    -H "Authorization: Bearer <TOKEN>" \
    -F "file=@/path/to/file.pdf"
  ```
  Ritorna: `{ "fileUrl": "/uploads/abc.pdf" }`

### /api/files/:id/view
- `GET` – Visualizza file (streaming PDF, solo se pubblico, owner o con richiesta approvata).

---

## Recensioni

### /api/reviews/
- `POST /`  
  Crea recensione (autenticato, un solo review per libro per utente).
  
  **Body:**
  ```json
  {
    "bookId": "idLibro",
    "rating": 5,
    "comment": "Ottimo libro!"
  }
  ```
  **Esempio cURL:**
  ```bash
  curl -X POST http://localhost:3000/api/reviews \
    -H "Authorization: Bearer <TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"bookId":"idLibro","rating":5,"comment":"Ottimo libro!"}'
  ```

- `GET /book/:bookId`  
  Elenco recensioni per libro.

- `PUT /:id`  
  Modifica recensione (solo autore).

- `DELETE /:id`  
  Cancella recensione (solo autore).

#### Modello Review
```ts
{
  id?: string,
  bookId: string,
  userId: string,
  rating: number, // 1-5
  comment?: string,
  createdAt?: Date
}
```

---

## Lending/Borrowing (Richieste Accesso Libri Privati)

### /api/lending/
- `POST /`  
  Richiedi accesso a libro privato.
  
  **Body:**
  ```json
  {
    "bookId": "idLibro"
  }
  ```
  **Esempio cURL:**
  ```bash
  curl -X POST http://localhost:3000/api/lending \
    -H "Authorization: Bearer <TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"bookId":"idLibro"}'
  ```

- `GET /received`  
  Proprietario: richieste ricevute.

- `GET /sent`  
  Utente: richieste inviate.

- `PUT /:id`  
  Proprietario: approva/rifiuta richiesta.
  
  **Body:**
  ```json
  { "status": "approved" }
  ```

#### Modello LendingRequest
```ts
{
  id?: string,
  bookId: string,
  requesterId: string,
  ownerId: string,
  status: 'pending' | 'approved' | 'rejected',
  createdAt?: Date,
  updatedAt?: Date
}
```

---

## Notifiche Email

- Quando viene fatta una richiesta di accesso a un libro privato, il proprietario riceve una mail di notifica.

---

## Sicurezza

- Tutte le rotte sensibili richiedono autenticazione JWT Firebase.
- Accesso ai file e ai libri privati controllato tramite ownerId e richieste approvate.

---

## Variabili d’Ambiente Necessarie

- `EMAIL_USER` – Email mittente per nodemailer
- `EMAIL_PASS` – Password app/email mittente

---

## Note

- I file vengono salvati localmente in `/uploads/` (puoi estendere a Firebase Storage).
- Le richieste e le recensioni sono collegate tramite gli ID degli utenti e dei libri.
- Per testare le API, usa Postman/Insomnia o cURL con autenticazione Bearer token.
