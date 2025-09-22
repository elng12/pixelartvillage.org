# Image Service API Documentation

This document provides details for the Express.js image processing service located in the `/server` directory.

## Overview

The service provides simple, unauthenticated API endpoints for resizing images on the fly. It is built with Express.js and uses the `sharp` library for high-performance image processing.

### General Considerations

- **Error Handling**: On failure (e.g., invalid image data, missing file), the API will return a `400 Bad Request` status code with a JSON body containing an error message: `{"error": "Error message details"}`.
- **File Uploads**: All endpoints expect a `POST` request with the `Content-Type` of `multipart/form-data`. The image must be sent in a form field named `file`.
- **File Size Limit**: The server is configured to accept images up to 20MB.

---

## Endpoints

### 1. Contain Resize

Resizes an image to fit *within* specified maximum dimensions while maintaining its aspect ratio. The image will not be enlarged if it is already smaller than the specified dimensions.

- **URL**: `/api/resize/contain`
- **Method**: `POST`
- **Request Body**: `multipart/form-data` with a `file` field.

#### Query Parameters

| Parameter | Type     | Optional | Default | Description                                                 |
| :-------- | :------- | :------- | :------ | :---------------------------------------------------------- |
| `maxW`    | `Number` | Yes      | `1600`  | The maximum allowed width for the output image.             |
| `maxH`    | `Number` | Yes      | `1200`  | The maximum allowed height for the output image.            |
| `format`  | `String` | Yes      | `webp`  | The output format. Can be `webp`, `jpeg`, or `png`.         |
| `quality` | `Number` | Yes      | `80`    | The image quality (1-100) for lossy formats like `jpeg` and `webp`. |

#### Responses

- **`200 OK`**: The resized image is returned as a binary blob with the appropriate `Content-Type` (e.g., `image/webp`).
- **`400 Bad Request`**: An error occurred. See the JSON response body for details.

### 2. Cover Resize

Resizes an image to completely fill the specified dimensions. The aspect ratio is maintained, and any parts of the image that extend beyond the boundaries are cropped.

- **URL**: `/api/resize/cover`
- **Method**: `POST`
- **Request Body**: `multipart/form-data` with a `file` field.

#### Query Parameters

| Parameter  | Type     | Optional | Default     | Description                                                                                             |
| :--------- | :------- | :------- | :---------- | :------------------------------------------------------------------------------------------------------ |
| `w`        | `Number` | Yes      | `1200`      | The target width for the output image.                                                                  |
| `h`        | `Number` | Yes      | `800`       | The target height for the output image.                                                                   |
| `format`   | `String` | Yes      | `webp`      | The output format. Can be `webp`, `jpeg`, or `png`.                                                     |
| `quality`  | `Number` | Yes      | `80`        | The image quality (1-100) for lossy formats.                                                            |
| `position` | `String` | Yes      | `attention` | The strategy for cropping. Common values include `center`, `top`, `right top`, `attention`. See `sharp` docs. |

#### Responses

- **`200 OK`**: The resized and cropped image is returned as a binary blob with the appropriate `Content-Type`.
- **`400 Bad Request`**: An error occurred. See the JSON response body for details.
