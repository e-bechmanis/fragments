# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/plain

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request
`This is a fragment`

# We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
url: header "Location"

# 1. Try to GET the fragment we just posted by its URL
GET {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
header "Content-Type" startsWith "text/plain"
body == "This is a fragment"
