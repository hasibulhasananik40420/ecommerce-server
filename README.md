how can clone the repository

```bash
git clone https://github.com/OmarDevZon/sms-server.git
```

goto file

```bash
cd sms-server
```

```bash
npm install
```

---

### base url

```bash
http://localhost:5000/
```

### user account create url

```bash
{{base_url}}/user/create-user
```

### login user url

```bash
{{base_url}}/auth/login
```

### find all user

```bash
{{base_url}}/user
```

### find single user

```bash
{{base_url}}/user/<email>
```

# Category Management API

This API allows administrators to manage categories including creating, viewing, and deleting categories.

## Authentication

All routes are protected and require the user to be authenticated as an admin.

## Endpoints

### 1. Create Category

**Endpoint:** `POST

```bash
/category/create-category
```

**Description:** Creates a new category.

**Request Body:**

```json
{
  "admin": "668bc9b54444bc0e5e33128a",
  "category": "T-Shirt-2",
  "measurementName": [
    "লম্বা",
    "বুক",
    "বুকের লুজ",
    "পেট",
    "হিপ",
    "শোল্ডার",
    "হাতের লম্বা",
    "কপ",
    " গলা",
    "গুলফি",
    "মোহরা"
  ],
  "lugeSize": ["Small", "Medium", "Large"],
  "dropdownStyle": [
    {
      "পকেট": ["পকেট ১", "পকেট ২", "পকেট ৩"]
    }
  ],
  "singleStyle": ["পকেট", "কলার", "হাতা"],
  "image": "https://example.com/image.jpg"
}
```

Response:

201 Created: Successfully created the category.
400 Bad Request: Invalid request data.

### 2. Get My Categories

Endpoint: GET

```bash
   /category/my-categories
```

Description: Retrieves all categories created by the authenticated admin.

Response:

200 OK: Returns a list of categories.
401 Unauthorized: If the user is not authenticated.

### 3. Get Single Category

Endpoint: GET

```bash
/category/my-category
```

Description: Retrieves a single category created by the authenticated admin.

200 OK: Returns the category details.
401 Unauthorized: If the user is not authenticated.
404 Not Found: If the category does not exist. 4. Delete Category

### Endpoint: DELETE

```bash
/category/delete-category
```

### 1. Create industry order

**Endpoint:** `POST

```bash
/individual-order/create-individual-order
```

**Request Body:**

```json
{
  "admin": "668f2ef6eb7391598a5ff7cf",
  "customerName": "জন ডো",
  "address": "১২৩ প্রধান রাস্তা, ঢাকা",
  "phoneNumber": "01970299035",
  "orderStatus": "নতুন অর্ডার",
  "tryerDate": "2024-07-25",
  "orderDate": "2024-07-20",
  "deliveryDate": "2024-07-30",
  "item": [
    {
      "category": "shirt",
      "measurement": [
        {
          "chest": "38 inches",
          "waist": "32 inches",
          "hips": "40 inches"
        }
      ],
      "lugeSize": ["M", "L"],
      "quantity": 2,
      "note": "বিশেষ যত্নের প্রয়োজন"
    }
  ]
}
```

Response:

201 Created: Successfully created the order.
400 Bad Request: Invalid request data.

### 2. Get My individual orders

Endpoint: GET

```bash
   /individual-order/my-individual-orders?adminId=668f2ef6eb7391598a5ff7cf&searchTerm=''
```

Response:

200 OK: Returns a list of individual orders.
401 Unauthorized: If the user is not authenticated.

### 3. Get Single individual order

Endpoint: GET

```bash
/individual-order/my-individual-order/66a33fd8162d05ee84ec23ff
```

Description: Retrieves a single individual order created by the authenticated admin.

200 OK: Returns the individual order details.
401 Unauthorized: If the user is not authenticated.
404 Not Found: If the category does not exist. 4. Delete Category

### Endpoint: put

```bash
/individual-order/update-individual-order
```

```json
{
  "id": "66a7d1ede0e0ffec187c2c49",
  "data": {
    "folder": "Omar ltd"
  }
}
```

Description: Deletes a individual order created by the authenticated admin.

Response:

### Endpoint: DELETE

```bash
/individual-order/delete-individual-order/66a33e75bbd1b1f7aac17a63
```

Description: Deletes a individual order created by the authenticated admin.

### 1. Create industry order

**Endpoint:** `POST

```bash
/industry-order/create-industry-order
```

**Request Body:**

```json
{
  "admin": "668f2ef6eb7391598a5ff7cf",
  "customerName": "জন ডো",
  "industry": "Omar Faruk",
  "phoneNumber": "01970299035",
  "orderStatus": "নতুন অর্ডার",
  "tryerDate": "2024-07-25",
  "orderDate": "2024-07-20",
  "deliveryDate": "2024-07-30",
  "item": [
    {
      "category": "shirt",
      "measurement": [
        {
          "chest": "38 inches",
          "waist": "32 inches",
          "hips": "40 inches"
        }
      ],
      "lugeSize": ["M", "L"],
      "quantity": 2,
      "note": "বিশেষ যত্নের প্রয়োজন"
    }
  ]
}
```

Response:

201 Created: Successfully created the order.
400 Bad Request: Invalid request data.

### 2. Get My industry folder

Endpoint: GET

```bash
   /industry-order/my-industry-folder/66a8ae2db335a5f38d13ba09 (please change id)
```

Response:

200 OK: Returns a list of industry folder.
401 Unauthorized: If the user is not authenticated.

### 2. edit industry folder

Endpoint: put

```bash
   /industry-order/edit-industry-folder
```

```json
{
  "id": "66a8c95df41d1a5ff13b969d",
  "data": {
    "folder": "Omar ltd 3"
  }
}
```


### 3. get industry orders by folder

Endpoint: get

```
   /industry-order/my-industry-orders/?adminId=668f2ef6eb7391598a5ff7cf&industry=Omar Faruk
```


Response:

200 OK: Returns a list of industry folder.
401 Unauthorized: If the user is not authenticated.

### 2. Get My industry orders

Endpoint: GET

```bash
   /industry-order/my-industry-orders/?adminId=668f2ef6eb7391598a5ff7cf&searchTerm=''
```

Response:

200 OK: Returns a list of industry orders.
401 Unauthorized: If the user is not authenticated.

### 3. Get Single industry order

Endpoint: GET

```bash
/industry-order/my-industry-order/66a7d1ede0e0ffec187c2c49
```

Description: Retrieves a single industry order created by the authenticated admin.

200 OK: Returns the industry order details.
401 Unauthorized: If the user is not authenticated.
404 Not Found: If the category does not exist. 4. Delete Category

### Endpoint: put

```bash
/industry-order/update-industry-order
```

```json
{
  "id": "66a7d1ede0e0ffec187c2c49",
  "data": {
    "folder": "Omar ltd"
  }
}
```

Description: Deletes a individual order created by the authenticated admin.

Response:

### Endpoint: DELETE

```bash
/individual-order/delete-individual-order/66a33e75bbd1b1f7aac17a63
```

Description: Deletes a individual order created by the authenticated admin.

Response:

200 OK: Successfully deleted the category.
401 Unauthorized: If the user is not authenticated.
404 Not Found: If the category does not exist.

#### Middleware

auth: Protects routes to ensure only authenticated users with the appropriate role (admin) can access them.
validateRequest: Validates incoming requests against the specified Zod schema.
# Skillion-web-server
