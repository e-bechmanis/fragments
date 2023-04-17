# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/plain

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of request
`This is a fragment!`

# We expect to get back an HTTP 201
HTTP/1.1 201

# Capture location URL
[Captures]
url: header "Location"

# 1. Authenticated PUT request to /v1/fragments
PUT {{url}}

# We're sending a plain text fragment
Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

# Body of request
`This is an updated fragment!`

# 2. Trying to GET the updated fragment
GET {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
header "Content-Type" startsWith "text/plain"
body == "This is an updated fragment!"

# 2. Authenticated PUT request to /v1/fragments
# Sending wrong datatype
PUT {{url}}

Content-Type: text/markdown

[BasicAuth]
user1@email.com:password1

# Body of request
`## Some new fragment`
# We expect to get back an HTTP 400
HTTP/1.1 400

