# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a markdown fragment
Content-Type: text/markdown

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of request
`# Header`

# We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
url: header "Location"

# 1. Use extension to convert fragment data
GET {{url}}.html

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
body matches "<h1>Header</h1"
header "Content-Type" startsWith "text/html"

# 2. Use unsupported extension (for content-type in test) to convert fragment data
GET {{url}}.gif

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 415


