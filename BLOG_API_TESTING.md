# Blog API Testing - Postman cURL Commands

## Base URL
```
http://localhost:5000/api/blogs
```

---

## 1. CREATE BLOG
**Method:** POST  
**Endpoint:** `/api/blogs`

```bash
curl --location 'http://localhost:5000/api/blogs' \
  --header 'Content-Type: application/json' \
  --data '{
  "title": "Getting Started with Node.js",
  "slug": "getting-started-nodejs",
  "categoryId": 1,
  "authorId": 1,
  "content": "<p>This is a comprehensive guide to getting started with Node.js development...</p>",
  "shortDescription": "Learn the basics of Node.js in this beginner-friendly guide",
  "keywords": "nodejs, javascript, backend, tutorial",
  "thumbnailUrl": "https://via.placeholder.com/300x200",
  "bannerUrl": "https://via.placeholder.com/1200x400",
  "imageAltText": "Node.js Logo",
  "imageCaption": "Getting Started with Node.js",
  "readingTime": "8 min read",
  "seoTitle": "Getting Started with Node.js - Complete Guide",
  "seoDescription": "Learn how to start your Node.js development journey with this comprehensive guide",
  "focusKeyword": "nodejs tutorial",
  "canonicalUrl": "https://example.com/blog/nodejs-tutorial",
  "status": "DRAFT",
  "visibility": "PUBLIC",
  "metaRobots": "INDEX",
  "allowComments": true,
  "showOnHomepage": true,
  "isSticky": false
}'
```

---

## 2. GET ALL BLOGS
**Method:** GET  
**Endpoint:** `/api/blogs`

### Get all published public blogs:
```bash
curl --location 'http://localhost:5000/api/blogs?status=PUBLISHED&visibility=PUBLIC' \
  --header 'Content-Type: application/json'
```

### Get blogs with pagination:
```bash
curl --location 'http://localhost:5000/api/blogs?limit=10&offset=0' \
  --header 'Content-Type: application/json'
```

### Get popular blogs from a specific category:
```bash
curl --location 'http://localhost:5000/api/blogs?categoryId=1&isPopular=true&limit=5' \
  --header 'Content-Type: application/json'
```

### Get sticky blogs:
```bash
curl --location 'http://localhost:5000/api/blogs?isSticky=true' \
  --header 'Content-Type: application/json'
```

### Get blogs by author:
```bash
curl --location 'http://localhost:5000/api/blogs?authorId=1&status=PUBLISHED' \
  --header 'Content-Type: application/json'
```

---

## 3. GET BLOG BY ID
**Method:** GET  
**Endpoint:** `/api/blogs/:id`

```bash
curl --location 'http://localhost:5000/api/blogs/1' \
  --header 'Content-Type: application/json'
```

---

## 4. GET BLOG BY SLUG
**Method:** GET  
**Endpoint:** `/api/blogs/slug/:slug`

```bash
curl --location 'http://localhost:5000/api/blogs/slug/getting-started-nodejs' \
  --header 'Content-Type: application/json'
```

---

## 5. UPDATE BLOG
**Method:** PUT  
**Endpoint:** `/api/blogs/:id`

### Update title and description:
```bash
curl --location --request PUT 'http://localhost:5000/api/blogs/1' \
  --header 'Content-Type: application/json' \
  --data '{
  "title": "Getting Started with Node.js - Updated",
  "shortDescription": "Updated description for the tutorial",
  "readingTime": "10 min read"
}'
```

### Publish a draft blog:
```bash
curl --location --request PUT 'http://localhost:5000/api/blogs/1' \
  --header 'Content-Type: application/json' \
  --data '{
  "status": "PUBLISHED",
  "publishDate": "2026-02-11T10:00:00Z"
}'
```

### Update SEO metadata:
```bash
curl --location --request PUT 'http://localhost:5000/api/blogs/1' \
  --header 'Content-Type: application/json' \
  --data '{
  "seoTitle": "New SEO Title",
  "seoDescription": "New SEO description",
  "focusKeyword": "updated focus keyword"
}'
```

---

## 6. DELETE BLOG
**Method:** DELETE  
**Endpoint:** `/api/blogs/:id`

```bash
curl --location --request DELETE 'http://localhost:5000/api/blogs/1' \
  --header 'Content-Type: application/json'
```

---

## 7. MARK BLOG AS POPULAR
**Method:** PATCH  
**Endpoint:** `/api/blogs/:id/mark-popular`

```bash
curl --location --request PATCH 'http://localhost:5000/api/blogs/1/mark-popular' \
  --header 'Content-Type: application/json'
```

---

## 8. UNMARK BLOG AS POPULAR
**Method:** PATCH  
**Endpoint:** `/api/blogs/:id/unmark-popular`

```bash
curl --location --request PATCH 'http://localhost:5000/api/blogs/1/unmark-popular' \
  --header 'Content-Type: application/json'
```

---

## Query Parameters Reference

### Filtering Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `DRAFT`, `PUBLISHED`, `SCHEDULED` |
| `visibility` | string | `PUBLIC`, `PRIVATE` |
| `categoryId` | number | Filter by category ID |
| `authorId` | number | Filter by author ID |
| `isPopular` | boolean | Filter popular blogs (true/false) |
| `isSticky` | boolean | Filter sticky blogs (true/false) |
| `showOnHomepage` | boolean | Filter homepage blogs (true/false) |
| `limit` | number | Limit number of results |
| `offset` | number | Pagination offset |

---

## Blog Object Fields

### Required
- `title` (string, max 255 chars)
- `slug` (string, max 255 chars, unique)
- `categoryId` (bigint)
- `authorId` (bigint)
- `content` (text)

### Optional
- `keywords` (text)
- `thumbnailUrl` (text)
- `bannerUrl` (text)
- `shortDescription` (text)
- `readingTime` (string)
- `imageAltText` (string, max 255 chars)
- `imageCaption` (text)
- `publishDate` (timestamptz)
- `visibility` (string, default: `PUBLIC`)
- `seoTitle` (string, max 255 chars)
- `seoDescription` (text)
- `focusKeyword` (string, max 255 chars)
- `canonicalUrl` (text)
- `metaRobots` (string, default: `INDEX`)
- `allowComments` (boolean, default: true)
- `showOnHomepage` (boolean, default: true)
- `isSticky` (boolean, default: false)
- `status` (string, default: `ACTIVE`)

---

## Sample Request/Response

### CREATE BLOG Response (Success):
```json
{
  "message": "Blog created successfully",
  "data": {
    "id": 1,
    "title": "Getting Started with Node.js",
    "slug": "getting-started-nodejs",
    "category_id": 1,
    "author_id": 1,
    "content": "<p>This is a comprehensive guide...</p>",
    "keywords": "nodejs, javascript, backend, tutorial",
    "thumbnail_url": "https://via.placeholder.com/300x200",
    "banner_url": "https://via.placeholder.com/1200x400",
    "is_popular": false,
    "status": "DRAFT",
    "created_at": "2026-02-11T10:30:00Z",
    "updated_at": "2026-02-11T10:30:00Z",
    "short_description": "Learn the basics of Node.js...",
    "reading_time": "8 min read",
    "image_alt_text": "Node.js Logo",
    "image_caption": "Getting Started with Node.js",
    "publish_date": null,
    "visibility": "PUBLIC",
    "seo_title": "Getting Started with Node.js - Complete Guide",
    "seo_description": "Learn how to start your Node.js development journey...",
    "focus_keyword": "nodejs tutorial",
    "canonical_url": "https://example.com/blog/nodejs-tutorial",
    "meta_robots": "INDEX",
    "allow_comments": true,
    "show_on_homepage": true,
    "is_sticky": false
  }
}
```

### GET ALL BLOGS Response (Success):
```json
{
  "message": "Blogs retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Getting Started with Node.js",
      "slug": "getting-started-nodejs",
      ...
    }
  ],
  "total": 1
}
```

### Error Response (404 Not Found):
```json
{
  "error": "Blog not found"
}
```

### Error Response (409 Conflict - Slug exists):
```json
{
  "error": "Slug already exists"
}
```

---

## Testing Workflow

1. **Create a blog** (Status: DRAFT)
2. **Get blog by ID** to verify creation
3. **Update blog** to change title/content
4. **Mark as popular** to feature the blog
5. **Change status to PUBLISHED** to publish
6. **Get all blogs** with various filters
7. **Get by slug** to retrieve by slug
8. **Unmark as popular** to remove from featured
9. **Delete blog** to remove it

---

## Notes
- All timestamps are in ISO 8601 format (UTC)
- Slugs must be unique across all blogs
- Status must be one of: `DRAFT`, `PUBLISHED`, `SCHEDULED`
- Visibility must be one of: `PUBLIC`, `PRIVATE`
- Meta robots must be one of: `INDEX`, `NOINDEX`
- Dates should be in ISO 8601 format: `2026-02-11T10:00:00Z`
