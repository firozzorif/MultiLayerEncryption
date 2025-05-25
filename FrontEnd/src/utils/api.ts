/**
 * Encrypts a text file using the API
 */
export async function encryptFile(file: File): Promise<{
  fileContent: string;
  key: string;
  filename: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Content = reader.result?.toString().split(',')[1];

      try {
        const response = await fetch('https://dygqvheyj2.execute-api.us-east-1.amazonaws.com/prod/encrypt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filename: file.name,
            fileContent: base64Content
          })
        });

        if (!response.ok) {
          if (response.status === 500) {
            reject(new Error('The file is corrupted or the server rejected the request.'));
            return;
          }
          reject(new Error(`Encryption failed: ${response.statusText}`));
          return;
        }

        const result = await response.json();

        if (!result || !result.fileContent || !result.key) {
          reject(new Error('Invalid response from server.'));
          return;
        }

        resolve({
          fileContent: result.fileContent,
          key: result.key,
          filename: result.filename || 'encrypted.txt'
        });
      } catch (error) {
        reject(new Error('Something went wrong during encryption.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Unable to read the file.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Decrypts a file using the API
 */
export async function decryptFile(file: File, key: string): Promise<{
  decrypted: string;
  filename: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Content = reader.result?.toString().split(',')[1];

      try {
        const response = await fetch('https://xst7akxwsf.execute-api.us-east-1.amazonaws.com/prod/decrypt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fileContent: base64Content,
            filename: file.name,
            key: key.trim()
          })
        });

        if (!response.ok) {
          if (response.status === 500) {
            reject(new Error('The file is corrupted or the key is invalid.'));
            return;
          }
          reject(new Error(`Decryption failed: HTTP ${response.status} - ${response.statusText}`));
          return;
        }

        const result = await response.json();

        if (!result || !result.decrypted) {
          reject(new Error('Invalid response or incorrect key.'));
          return;
        }

        resolve({
          decrypted: result.decrypted,
          filename: result.filename || 'decrypted_file.txt'
        });

      } catch (error) {
        reject(new Error('A network or server error occurred.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Unable to read the file.'));
    };

    reader.readAsDataURL(file);
  });
}