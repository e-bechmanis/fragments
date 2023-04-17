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

# Capturing ID as well in this case, so that we can match it agains the response
[Captures]
id: jsonpath "$.fragment.id"
url: header "Location"

# 1. GET fragment metadata
GET {{url}}/info

[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "{{id}}"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 18
