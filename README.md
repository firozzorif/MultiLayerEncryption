# MultiLayerEncryption
Layered Encryption for text documents using AWS
# 🔐 Multilayer Encryption and Decryption System

A cloud based encryption-decryption application that provides secure, scalable, and user-friendly protection for sensitive text data. Built using **AWS Lambda**, **Amazon S3**, **API Gateway**, and **ReactJS**, it implements a **four-layer encryption pipeline** with custom **Federated Entropy Derivation (FED)** key generation.

---

## 🚀 Features

* 🔒 **Four-Layer Encryption Pipeline:**

  1. XOR Encryption
  2. Next Lexicographic Permutation
  3. HMAC-based Stream Cipher
  4. SHA-256 Hashing

* 🧠 **FED-Based Key Generation:**

  * 512-bit private key
  * ECC-like public key
  * 2048-bit modulus
  * Unique seed and salt

* ☁️ **Cloud-Native Deployment:**

  * AWS Lambda for serverless encryption logic
  * Amazon S3 for secure file storage
  * Amazon API Gateway for stateless communication

* 🌐 **Responsive Frontend:**

  * Built with ReactJS
  * Upload text files, initiate encryption/decryption, and download results

* ✅ **Integrity Verification:**

  * SHA-256 hashes ensure tamper detection and content integrity

---

## 🛠️ Tech Stack

* **Frontend:** ReactJS, JavaScript, HTML/CSS
* **Backend:** AWS Lambda (Python/Node.js), Amazon API Gateway
* **Storage:** Amazon S3
* **Security:** HMAC, SHA-256, Base64, ECC-like keys
* **Key Management:** Custom Federated Entropy Derivation (FED)

---

## 📦 Installation & Setup

> **Note:** This project assumes access to AWS services. You will need AWS credentials and permission to deploy Lambda functions, S3 buckets, and API Gateway routes.

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/multilayer-encryption-system.git
   cd multilayer-encryption-system
   ```

2. Set up the React frontend:

   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Deploy AWS Lambda functions:

   * Use the AWS CLI or AWS Console to upload and configure the Lambda functions found in `/lambda`.

4. Configure Amazon API Gateway to route frontend requests to the Lambda functions.

5. Set up an S3 bucket with appropriate read/write permissions.

---

## 📁 Project Structure

```
multilayer-encryption-system/
├── frontend/             # ReactJS frontend
├── lambda/               # FED key generation and encryption helpers
├── README.md
```
