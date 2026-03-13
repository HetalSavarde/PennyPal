# 💸 PENNYPAL — PSEUDO CODE DOCUMENTATION
**Full-Stack Application (Next.js + Spring Boot + JWT Security)**

---

## 🧩 BACKEND — SPRING BOOT (JAVA)

---

### **1️⃣ USER AUTHENTICATION FLOW**

#### **Endpoints — `UserController.java`**
POST /api/users/register
    INPUT: { username, email, passwordHash }
    ACTIONS:
        - Validate input
        - Create new User entity
        - Save in database
    OUTPUT: Created user (JSON)

POST /api/users/login
    INPUT: { username, passwordHash }
    ACTIONS:
        - Find user by username
        - Compare password hashes
        - Generate JWT token using JwtUtil
    OUTPUT: JWT token (string)

#### **JWT Utility — `JwtUtil.java`**
generateToken(username)
    - Create JWT with subject=username
    - Set issue + expiry date
    - Sign with secret key

validateToken(token)
    - Parse claims
    - Verify signature and expiry
    - Return valid/invalid

#### **Security Config — `SecurityConfig.java`**
configure(HttpSecurity http)
    - Permit: /api/users/login, /api/users/register
    - Require authentication for all other endpoints
    - Add JwtAuthenticationFilter before UsernamePasswordAuthenticationFilter

---

### **2️⃣ TRANSACTION MANAGEMENT**

#### **Endpoints — `TransactionController.java`**
GET /api/transactions
    ACTIONS:
        - Extract username from JWT
        - Fetch user’s transactions
    OUTPUT: List<Transaction>

POST /api/transactions/add
    INPUT: { amount, category, type, transactionDate }
    ACTIONS:
        - Extract user from JWT
        - Save transaction under user
    OUTPUT: Created Transaction

---

### **3️⃣ BILL SPLIT & GROUPS**

#### **Endpoints — `BillController.java`**
GET /api/bills/groups
    ACTIONS:
        - Get logged-in user from JWT
        - Return all groups user belongs to

POST /api/bills/groups
    INPUT: { name, members[] }
    ACTIONS:
        - Create group entity
        - Add members
    OUTPUT: Created group

POST /api/bills/split
    INPUT: { groupId, description, totalAmount, participants[], splitEqually }
    ACTIONS:
        - Create Bill
        - Calculate shares
        - Create BillShare entries
    OUTPUT: Created Bill

GET /api/bills/my-shares
    ACTIONS:
        - Fetch all BillShare entries for user
    OUTPUT: List<BillShare>

POST /api/bills/shares/{id}/settle
    ACTIONS:
        - Mark BillShare as settled
    OUTPUT: Updated share DTO

---

### **4️⃣ DATABASE ENTITIES**
| Entity        | Attributes                                                                 |
|----------------|-----------------------------------------------------------------------------|
| **User**       | id, username, email, passwordHash                                           |
| **Transaction**| id, user, amount, category, type, transactionDate                           |
| **UserGroup**  | id, name, owner, members[]                                                  |
| **Bill**       | id, group, description, totalAmount, creator, createdAt                     |
| **BillShare**  | id, bill, participant, shareAmount, settled                                 |

---

## ⚙️ FRONTEND — NEXT.JS (TYPESCRIPT)

---

### **1️⃣ AUTHENTICATION LOGIC — `lib/auth.ts`**
API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

register(username, email, password)
    POST /users/register { username, email, passwordHash: password }
    RETURN user object

login(username, password)
    POST /users/login { username, passwordHash: password }
    RETURN token (string)

setToken(token)
    localStorage.setItem("token", token)

getToken()
    return localStorage.getItem("token")

removeToken()
    localStorage.removeItem("token")

getAuthHeaders()
    token = getToken()
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

---

### **2️⃣ TRANSACTION API — `lib/api.ts`**
transactionAPI = {
    getAll():
        GET /transactions with getAuthHeaders()
        RETURN list of transactions

    add(transaction):
        POST /transactions/add with getAuthHeaders()
        BODY: transaction JSON
        RETURN created transaction
}

---

### **3️⃣ BILL & GROUP API — `lib/api.ts`**
billAPI = {
    getGroups():
        GET /bills/groups
        RETURN user’s groups

    createGroup(name, members):
        POST /bills/groups { name, members }
        RETURN created group

    getMyShares():
        GET /bills/my-shares
        RETURN list of BillShare

    createBillSplit(data):
        POST /bills/split { groupId, description, amount, participants }
        RETURN created bill

    settleShare(shareId):
        POST /bills/shares/{shareId}/settle
        RETURN updated share
}

---

### **4️⃣ FRONTEND UI FLOW**

Login Page — `/login/page.tsx`
onSubmit():
    token = authAPI.login(username, password)
    if token:
        setToken(token)
        navigate("/dashboard")
    else:
        showError("Invalid credentials")

Dashboard — `/dashboard/page.tsx`
onMount():
    if no token → redirect("/login")
    else:
        loadTransactions()
        loadGroups()

Transactions Component
useEffect():
    data = transactionAPI.getAll()
    setTransactions(data)
render():
    display transaction table

Bill Groups Component
useEffect():
    groups = billAPI.getGroups()
render():
    show group list with bills

Logout Button
onClick():
    removeToken()
    redirect("/login")

---

### **5️⃣ ENVIRONMENT CONFIG**

`.env.local` (frontend)
NEXT_PUBLIC_API_URL=http://localhost:8080

`application.properties` (backend)
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/pennypal
spring.datasource.username=root
spring.datasource.password=root
jwt.secret=your_secret_key
jwt.expiration=86400000

---

## 🚀 END-TO-END FLOW OVERVIEW
User → Login Page
   ↓
POST /api/users/login → Backend validates credentials
   ↓
Backend → returns JWT token
   ↓
Frontend → stores token in localStorage
   ↓
Subsequent API calls → include Authorization: Bearer <token>
   ↓
Backend verifies token on each protected route
   ↓
User accesses Dashboard → Transactions, Groups, Bills
   ↓
User can add expenses, split bills, and settle dues

---

### ✅ SUMMARY
PennyPal is a full-stack expense and bill-split manager that:
- Uses JWT-based authentication
- Manages transactions, groups, and shared bills
- Has a secure backend (Spring Boot) and modern frontend (Next.js + TypeScript)
- Provides seamless user experience with session persistence and API integration.

---

**End of File**
