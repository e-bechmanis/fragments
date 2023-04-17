# Authenticated GET request /v1/fragments
# Checking if it returns an empty list if there are no fragments, then adding 2 fragments, and checking return again
GET http://localhost:8080/v1/fragments

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
# No fragments should be returned because none was added yet
jsonpath "$.fragments" count == 0

# 1. First authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

`Fragment 1`

# We expect to get back an HTTP 201
HTTP/1.1 201

# 2. Second authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

`Fragment2`

# We expect to get back an HTTP 201
HTTP/1.1 201

# 3. Authenticated GET request /v1/fragments
GET http://localhost:8080/v1/fragments

[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
# 2 fragments should be in the list
jsonpath "$.fragments" count == 2

# 4. Authenticated GET request /v1/fragments?expand=1
GET http://localhost:8080/v1/fragments?expand=1

[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
jsonpath "$.fragments" count == 2
jsonpath "$.fragments[0].size" == 10
jsonpath "$.fragments[1].size" == 9
